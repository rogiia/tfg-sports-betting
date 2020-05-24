# select build image
FROM rust:1.23 as build

# create a new empty shell project
RUN USER=root cargo new --bin odds-service
WORKDIR /odds-service

# copy over your manifests
COPY ./Cargo.lock ./Cargo.lock
COPY ./Cargo.toml ./Cargo.toml

# this build step will cache your dependencies
RUN cargo build --release
RUN rm src/*.rs

# copy your source tree
COPY ./src ./src

# build for release
RUN rm ./target/release/deps/odds-service*
RUN cargo build --release

# our final base
FROM rust:1.23

# copy the build artifact from the build stage
COPY --from=build /odds-service/target/release/odds-service .

# set the startup command to run your binary
CMD ["./odds-service"]