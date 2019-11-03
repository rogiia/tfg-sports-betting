use hyper::{Body, Request, Response};
use futures::{future, Future};

type GenericError = Box<dyn std::error::Error + Send + Sync>;
type ResponseFuture = Box<dyn Future<Item=Response<Body>, Error=GenericError> + Send>;

const PHRASE: &str = "Hello, World!";

pub fn get_event_odds(_req: Request<Body>) -> ResponseFuture {
  Box::new(future::ok(Response::new(Body::from(PHRASE))))
}