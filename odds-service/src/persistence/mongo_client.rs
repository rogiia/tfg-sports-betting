// Utilitzar: https://github.com/ptariche/rust-rocket-mongo-example/blob/master/src/models/user.rs

use mongodb;
use mongodb::{Client, options::ClientOptions, options::auth::Credential, Database, error::Error};
use std::env;

pub fn connect() -> Result<Database, Error> {
  let user = env::var("MONGO_USER")
    .unwrap_or("root".to_string());
  let pass = env::var("MONGO_PASSWORD")
      .unwrap_or("".to_string());
  // Parse a connection string into an options struct.
  let mut client_options = ClientOptions::parse("mongodb://oddsservice-mongo:27017")?;
  client_options.credential = Some(Credential {
    username: Some(user),
    password: Some(pass),
    mechanism: None,
    mechanism_properties: None,
    source: None
  });
  println!("Connecting to mongo database...");
  let client = Client::with_options(client_options)?;
  println!("Connected to mongo database");
  // List the names of the databases in that deployment.
  for db_name in client.list_database_names(None)? {
    println!("Database found: {}", db_name);
  }
  Ok(client.database("admin"))
}