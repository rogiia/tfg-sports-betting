use std;
use std::io;
use bson;
use bson::oid::ObjectId;
use mongodb::ThreadedClient;
use mongodb::db::ThreadedDatabase;

mod persistence;

pub struct Model {
  pub team_name: String;
  pub elo: i32;
}

impl Model {
  pub fn to_bson(&self) -> bson::ordered::OrderedDocument {
    doc! {
      "team_name": self.team_name.to_owned(),
      "elo": self.elo.to_owned()
    }
  }

  pub fn create(&self) -> Result<std::option::Option<bson::ordered::OrderedDocument>, io::Error> {
    let client = persistence::mongo_client::connect();
    let collection = client.db("admin").collection("elo");
    collection.insert_one(self.to_bson().clone(), None)
      .ok().expect("Failed to insert team elo.");
    let response_document = collection.find_one(Some(self.to_bson().clone()), None)
      .ok().expect("Failed to insert team elo.");
    Ok(response_document)
  }

  pub fn update(&self) -> Result<std::option::Option<bson::ordered::OrderedDocument>, io::Error> {
    let client = persistence::mongo_client::connect();
    let collection = client.db("admin").collection("elo");
    collection.update_one(Some(doc! {
      "_id" => self.team_name
    }), self.to_bson().clone(), None)
      .ok().expect("Failed to update team elo.");
    let result = collection.find_one(Some(self.to_bson().clone()), None)
      .ok().expect("Failed to update team elo.");
    Ok(result)
  } 

  pub fn find_one(team_name: String) -> Result<std::option::Option<bson::ordered::OrderedDocument>, io::Error> {
    let client = persistence::mongo_client::connect();
    let collection = client.db("admin").collection("elo");
    let result = collection.find_one(Some(doc! { "team_name" => team_name }), None)
      .ok().expect("Failed to find team");
    Ok(result)
  }
}