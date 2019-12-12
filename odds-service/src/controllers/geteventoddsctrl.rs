extern crate serde_json;
use std::fmt;
use serde::ser::{Serialize, Serializer, SerializeStruct};
use serde::de::{self, Deserialize, Deserializer, Visitor, SeqAccess, MapAccess};
use hyper::{Body, Request, Response, StatusCode, header};
use futures::{Future};
use crate::futures::Stream;

use super::super::models;

type GenericError = Box<dyn std::error::Error + Send + Sync>;
type ResponseFuture = Box<dyn Future<Item=Response<Body>, Error=GenericError> + Send>;

struct EventOddsRequestBody {
  sport: String,
  local_team_name: String,
  visitor_team_name: String,
  local_team_result: i32,
  visitor_team_result: i32
}

pub struct EventOddsResult {
  local_stake: f32,
  draw_stake: f32,
  visitor_stake: f32
}

const ELO_ADDITION_PER_POINT_OF_DIFFERENCE: i32 = 80;

impl<'de> Deserialize<'de> for EventOddsRequestBody {
  fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
  where
    D: Deserializer<'de>,
    {
      enum Field {
        Sport, LocalTeamName, VisitorTeamName, LocalTeamResult, VisitorTeamResult
      }

      impl<'de> Deserialize<'de> for Field {
        fn deserialize<D>(deserializer: D) -> Result<Field, D::Error>
        where
          D: Deserializer<'de>
        {
          struct FieldVisitor;

          impl<'de> Visitor<'de> for FieldVisitor {
            type Value = Field;

            fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
              formatter.write_str("`sport`|`localTeamName`|`visitorTeamName`|`localTeamResult`|`visitorTeamResult`")
            }

            fn visit_str<E>(self, value: &str) -> Result<Field, E>
            where
              E: de::Error,
            {
              match value {
                "sport" => Ok(Field::Sport),
                "localTeamName" => Ok(Field::LocalTeamName),
                "visitorTeamName" => Ok(Field::VisitorTeamName),
                "localTeamResult" => Ok(Field::LocalTeamResult),
                "visitorTeamResult" => Ok(Field::VisitorTeamResult),
                _ => Err(de::Error::unknown_field(value, FIELDS))
              }
            }
          }
          deserializer.deserialize_identifier(FieldVisitor)
        }
      }

      struct EventOddsRequestBodyVisitor;

      impl<'de> Visitor<'de> for EventOddsRequestBodyVisitor {
        type Value = EventOddsRequestBody;
        
        fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
          formatter.write_str("struct EventOddsRequestBody")
        }

        fn visit_seq<V>(self, mut seq: V) -> Result<EventOddsRequestBody, V::Error>
        where
          V: SeqAccess<'de>
        {
          let sport = seq.next_element()?
            .ok_or_else(|| de::Error::invalid_length(0, &self))?;
          let local_team_name = seq.next_element()?
            .ok_or_else(|| de::Error::invalid_length(1, &self))?;
          let visitor_team_name = seq.next_element()?
            .ok_or_else(|| de::Error::invalid_length(2, &self))?;
          let local_team_result = seq.next_element()?
            .ok_or_else(|| de::Error::invalid_length(3, &self))?;
          let visitor_team_result = seq.next_element()?
            .ok_or_else(|| de::Error::invalid_length(4, &self))?;
          Ok(EventOddsRequestBody {
            sport: sport,
            local_team_name: local_team_name,
            visitor_team_name: visitor_team_name,
            local_team_result: local_team_result,
            visitor_team_result: visitor_team_result
          })
        }

        fn visit_map<V>(self, mut map: V) -> Result<EventOddsRequestBody, V::Error>
        where
          V: MapAccess<'de>,
        {
          let mut sport = None;
          let mut local_team_name = None;
          let mut visitor_team_name = None;
          let mut local_team_result = None;
          let mut visitor_team_result = None;
          while let Some(key) = map.next_key()? {
            match key {
              Field::Sport => {
                if sport.is_some() {
                  return Err(de::Error::duplicate_field("sport"));
                }
                sport = Some(map.next_value()?);
              }
              Field::LocalTeamName => {
                if local_team_name.is_some() {
                  return Err(de::Error::duplicate_field("local_team_name"));
                }
                local_team_name = Some(map.next_value()?);
              }
              Field::VisitorTeamName => {
                if visitor_team_name.is_some() {
                  return Err(de::Error::duplicate_field("visitor_team_name"));
                }
                visitor_team_name = Some(map.next_value()?);
              }
              Field::LocalTeamResult => {
                if local_team_result.is_some() {
                  return Err(de::Error::duplicate_field("local_team_result"));
                }
                local_team_result = Some(map.next_value()?);
              }
              Field::VisitorTeamResult => {
                if visitor_team_result.is_some() {
                  return Err(de::Error::duplicate_field("visitor_team_result"));
                }
                visitor_team_result = Some(map.next_value()?);
              }
            }
          }
          let sport = sport.ok_or_else(|| de::Error::missing_field("sport"))?;
          let local_team_name = local_team_name.ok_or_else(|| de::Error::missing_field("local_team_name"))?;
          let visitor_team_name = visitor_team_name.ok_or_else(|| de::Error::missing_field("visitor_team_name"))?;
          let local_team_result = local_team_result.ok_or_else(|| de::Error::missing_field("local_team_result"))?;
          let visitor_team_result = visitor_team_result.ok_or_else(|| de::Error::missing_field("visitor_team_result"))?;
          Ok(EventOddsRequestBody {
            sport: sport,
            local_team_name: local_team_name,
            visitor_team_name: visitor_team_name,
            local_team_result: local_team_result,
            visitor_team_result: visitor_team_result
          })
        }
      }
      const FIELDS: &'static [&'static str] = &["sport", "localTeamName", "visitorTeamName", "localTeamResult", "visitorTeamResult"];
      deserializer.deserialize_struct("EventOddsRequestBody", FIELDS, EventOddsRequestBodyVisitor)
    }
}

impl Serialize for EventOddsResult {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where
    S: Serializer,
    {
      let mut state = serializer.serialize_struct("EventOddsResult", 3)?;
      state.serialize_field("local_stake", &self.local_stake)?;
      state.serialize_field("draw_stake", &self.draw_stake)?;
      state.serialize_field("visitor_stake", &self.visitor_stake)?;
      state.end()
    }
}

// https://en.wikipedia.org/wiki/Elo_rating_system#Mathematical_details
pub fn calculate_probabilities_of_winning(
  local_team_result: i32,
  visitor_team_result: i32,
  local_elo: i32,
  visitor_elo: i32) -> EventOddsResult {
  let result_difference: i32 = local_team_result - visitor_team_result;
  let modified_local_elo: i32 = local_elo + (result_difference * ELO_ADDITION_PER_POINT_OF_DIFFERENCE);
  let local_stake: f32 = 1.0 / (1.0 + (10 as f32).powi((visitor_elo - modified_local_elo)/400));
  let visitor_stake: f32 = 1.0 / (1.0 + (10 as f32).powi((modified_local_elo - visitor_elo)/400));
  let draw_stake: f32 = 1.0 - local_stake - visitor_stake;
  EventOddsResult {
    local_stake: local_stake,
    visitor_stake: visitor_stake,
    draw_stake: draw_stake
  }
}

pub fn get_event_odds(req: Request<Body>) -> ResponseFuture {
  Box::new(req.into_body()
    .concat2()
    .from_err()
    .and_then(|entire_body| {
      let str = String::from_utf8(entire_body.to_vec())?;
      let body_data: EventOddsRequestBody = serde_json::from_str(&str).unwrap();
      let local_doc = models::elo::find_one(body_data.local_team_name).unwrap();
      let local_elo = bson::from_bson::<models::elo::Model>(bson::Bson::Document(local_doc.unwrap()))
        .unwrap().elo;
      let visitor_doc = models::elo::find_one(body_data.visitor_team_name).unwrap();
      let visitor_elo = bson::from_bson::<models::elo::Model>(bson::Bson::Document(visitor_doc.unwrap()))
        .unwrap().elo;
      let response = calculate_probabilities_of_winning(body_data.local_team_result, body_data.visitor_team_result, local_elo, visitor_elo);
      let json = serde_json::to_string(&response)?;
      let response = Response::builder()
        .status(StatusCode::OK)
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(json))?;
      Ok(response)
    })
  )
}