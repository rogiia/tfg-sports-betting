FROM rust:1.31

WORKDIR /usr/src/odds-service
COPY . .

RUN rustup update
RUN rustup toolchain install nightly
RUN rustup component add rustfmt --toolchain nightly
RUN rustup default nightly
RUN cargo install --path .
RUN cargo build --release

CMD ["target/release/odds-service"]