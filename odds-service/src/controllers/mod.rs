extern crate futures;
extern crate hyper;

use futures::{future, Future};
use hyper::{Body, Request, Response, Client, Method, StatusCode};
use hyper::client::HttpConnector;

mod geteventoddsctrl;
mod handleeventresultctrl;

type GenericError = Box<dyn std::error::Error + Send + Sync>;
type ResponseFuture = Box<dyn Future<Item=Response<Body>, Error=GenericError> + Send>;

static NOTFOUND: &[u8] = b"Not Found";
static PREFLIGHT: &[u8] = b"";

pub fn service_controllers(req: Request<Body>, _client: &Client<HttpConnector>) -> ResponseFuture {
  match req.method() {
    &Method::OPTIONS => {
      let body = Body::from(PREFLIGHT);
      Box::new(future::ok(Response::builder()
          .status(StatusCode::OK)
          .header("Access-Control-Allow-Origin", "*")
          .header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
          .header("Access-Control-Allow-Headers", "X-Requested-With,Content-type")
          .body(body)
          .unwrap()))
    }
    _ => {
      println!("Received new request with method {} at path {}", req.method(), req.uri().path());
      match (req.method(), req.uri().path()) {
        (&Method::POST, "/event-odds") => {
          Box::new(geteventoddsctrl::get_event_odds(req))
        }
        (&Method::POST, "/event-result") => {
          Box::new(handleeventresultctrl::handle_event_result(req))
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
  }
}