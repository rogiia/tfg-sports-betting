use serde::{Serialize, Deserialize};
use hyper::{Body, Request, Response, StatusCode, header};
use futures::{Future};
use crate::futures::Stream;

type GenericError = Box<dyn std::error::Error + Send + Sync>;
type ResponseFuture = Box<dyn Future<Item=Response<Body>, Error=GenericError> + Send>;

use super::super::models;

#[derive(Serialize, Deserialize)]
struct HandleEventResultRequestBody {
  winning_team_name: String,
  losing_team_name: String
}

#[derive(Serialize, Deserialize)]
struct HandleEventResultResponse {
  message: String
}

pub fn handle_event_result(req: Request<Body>) -> ResponseFuture {
  Box::new(req.into_body()
    .concat2()
    .from_err()
    .and_then(|entire_body| {
      let str = String::from_utf8(entire_body.to_vec())?;
      let body_data: HandleEventResultRequestBody = serde_json::from_str(&str).unwrap();
      let winning_doc = models::elo::find_one(body_data.winning_team_name).unwrap();
      let mut winning_team = bson::from_bson::<models::elo::Model>(bson::Bson::Document(winning_doc.unwrap()))
        .unwrap();
      let losing_doc = models::elo::find_one(body_data.losing_team_name).unwrap();
      let mut losing_team = bson::from_bson::<models::elo::Model>(bson::Bson::Document(losing_doc.unwrap()))
        .unwrap();
      let mut winning_team_expectancy = 0;
      if winning_team.elo > losing_team.elo {
        winning_team_expectancy = 1;
      } else if winning_team.elo > losing_team.elo {
        winning_team_expectancy = 0;
      }
      let K_FACTOR = 32;
      let new_winning_team_elo = winning_team.elo + K_FACTOR * (1 - winning_team_expectancy);
      let new_losing_team_elo = losing_team.elo + K_FACTOR * (-1 - (winning_team_expectancy * -1));
      winning_team.elo = new_winning_team_elo;
      losing_team.elo = new_losing_team_elo;
      winning_team.update()
        .expect("Error while updating elo");
      losing_team.update()
        .expect("Error while updating elo");
      let response = HandleEventResultResponse {
        message: String::from("Updated elo successfully")
      };
      let json = serde_json::to_string(&response)?;
      let response = Response::builder()
        .status(StatusCode::OK)
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(json))?;
      Ok(response)
    })
  )
}