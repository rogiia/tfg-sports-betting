extern crate futures;
extern crate hyper;

use futures::{future, Future};
use hyper::{Body, Request, Response, Client, Method, StatusCode};
use hyper::client::HttpConnector;

mod geteventoddsctrl;

type GenericError = Box<dyn std::error::Error + Send + Sync>;
type ResponseFuture = Box<dyn Future<Item=Response<Body>, Error=GenericError> + Send>;

static NOTFOUND: &[u8] = b"Not Found";

pub fn service_controllers(req: Request<Body>, _client: &Client<HttpConnector>) -> ResponseFuture {
  match (req.method(), req.uri().path()) {
    (&Method::POST, "/event-odds") => {
      geteventoddsctrl::get_event_odds(req)
    }
    _ => {
      let body = Body::from(NOTFOUND);
      Box::new(future::ok(Response::builder()
      .status(StatusCode::NOT_FOUND)
      .body(body)
      .unwrap()))
    }
  }
}