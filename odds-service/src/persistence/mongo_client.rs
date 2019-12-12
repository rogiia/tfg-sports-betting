// Utilitzar: https://github.com/ptariche/rust-rocket-mongo-example/blob/master/src/models/user.rs

use mongodb;
use mongodb::{Client, ThreadedClient};
use std;

pub fn connect() -> std::sync::Arc<mongodb::ClientInner>{
  /*let user = env::var("MONGO_USER")
    .unwrap_or("root".to_string());
  let pass = env::var("MONGO_PASSWORD")
      .unwrap_or("".to_string());*/
  let client = Client::connect("mongo-odds-service", 27017)
    .expect("Failed to connect to mongodb");
  client
}

/*pub fn get_team_elo(team_name: String) {
  let elo_collection = client.db("admin").collection("elo");
  let result = elo_collection.find_one(Some(doc! {
    "team_name": team_name
  }), None).ok().expect("Failed to find team");
  cursor.get("elo")
}

pub fn set_team_elo(team_name: String, elo: i32) {
  let elo_collection = client.db("admin").collection("elo");
  let result = elo_collection.find_one(Some(doc! {
    "team_name": team_name
  }), None).ok().expect("Failed to find team");
  if result == None {
    elo_collection.create(Some(!doc {
      "team_name": team_name,
      "elo": elo
    }))
  } else {
    elo_collection.update(Some(doc! {
      "team_name": team_name
    }), Some(doc! {
      "team_name": team_name,
      "elo": elo
    }))
  }
}*/