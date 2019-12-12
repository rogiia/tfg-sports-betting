extern crate hyper;
extern crate futures;

use futures::{future};
use hyper::{Server, Client};
use hyper::rt::Future;
use hyper::service::service_fn;
use std::env;

mod controllers;
mod models;
mod persistence;

fn main() {
  // Connect to database
  persistence::mongo_client::connect();

  // Run web server
  let port = env::var("HTTP_PORT")
    .unwrap_or("1337".to_string());
  let addr = format!("127.0.0.1:{}", port).parse().unwrap();

  hyper::rt::run(future::lazy(move || {
    let client = Client::new();

    let odds_service = move || {
        let client = client.clone();
        service_fn(move |req| {
            controllers::service_controllers(req, &client)
        })
    };

    let server = Server::bind(&addr)
        .serve(odds_service)
        .map_err(|e| eprintln!("server error: {}", e));

    println!("Listening on http://{}", addr);

    server
  }));
}
