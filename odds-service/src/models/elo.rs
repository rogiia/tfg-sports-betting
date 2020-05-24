use std;
use serde::{Serialize, Deserialize};
use bson::{doc};
use mongodb::{error::Error};
use super::super::persistence;

#[derive(Debug, Serialize, Deserialize)]
pub struct Model {
  pub team_name: String,
  pub elo: i32
}

impl Model {
  pub fn to_bson(&self) -> bson::ordered::OrderedDocument {
    doc! {
      "team_name": self.team_name.to_owned(),
      "elo": self.elo.to_owned()
    }
  }

  pub fn create(&self) -> Result<std::option::Option<bson::ordered::OrderedDocument>, String> {
    let db = persistence::mongo_client::connect().or(Err("Error connecting to database"))?;
    let collection = db.collection("elo");
    collection.insert_one(self.to_bson().clone(), None).or(Err("Error inserting to database"))?;
    let response_document = collection.find_one(Some(self.to_bson().clone()), None).or(Err("Cannot find newly created database entry"))?;
    Ok(response_document)
  }

  pub fn update(&self) -> Result<std::option::Option<bson::ordered::OrderedDocument>, String> {
    let db = persistence::mongo_client::connect().or(Err("Error connecting to database"))?;
    let collection = db.collection("elo");
    collection.update_one(doc! {
      "_id" => bson::from_bson::<Model>(bson::Bson::Document(self.to_bson().clone())).unwrap().team_name
    }, self.to_bson().clone(), None).or(Err("Error updating database entry"))?;
    let result = collection.find_one(Some(self.to_bson().clone()), None).or(Err("Cannot find updated database entry"))?;
    Ok(result)
  } 

}

pub fn find_one(team_name: String) -> Result<std::option::Option<bson::ordered::OrderedDocument>, String> {
  let db = persistence::mongo_client::connect().or(Err("Error connecting to database"))?;
  println!("Accessing database collection elo");
  let collection = db.collection("elo");
  println!("Performing find on team name {}", team_name);
  let result = collection.find_one(Some(doc! { "team_name" => team_name }), None).or(Err("Error performing find one operation"))?;
  println!("Find operation successful");
  Ok(result)
}