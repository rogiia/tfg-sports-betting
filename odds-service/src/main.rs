extern crate hyper;
extern crate futures;

use futures::{future};
use hyper::{Server, Client};
use hyper::rt::Future;
use hyper::service::service_fn;

mod controllers;

fn main() {
  let addr = "127.0.0.1:1337".parse().unwrap();

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
