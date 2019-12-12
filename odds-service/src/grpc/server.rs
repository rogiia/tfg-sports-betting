//https://github.com/hyperium/tonic/blob/master/examples/helloworld-tutorial.md
use tonic::{transport::Server, Request, Response, Status};

pub mod grpc_server {
    tonic::include_proto!("helloworld");
}

use grpc_server::{
    server::{Greeter, GreeterServer},
    HelloReply, HelloRequest,
};

pub struct MyGreeter {}

#[tonic::async_trait]
impl Greeter for MyGreeter {
    async fn say_hello(
        &self,
        request: Request<HelloRequest>,
    ) -> Result<Response<HelloReply>, Status> {
        println!("Got a request: {:?}", request);

        let reply = hello_world::HelloReply {
            message: format!("Hello {}!", request.into_inner().name).into(),
        };

        Ok(Response::new(reply))
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "[::1]:50051".parse()?;
    let greeter = MyGreeter {};

    Server::builder()
        .add_service(GreeterServer::new(greeter))
        .serve(addr)
        .await?;

    Ok(())
}