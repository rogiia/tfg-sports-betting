FROM rust

WORKDIR /usr/src/odds-service
COPY . .

RUN rustup update
RUN rustup toolchain install nightly
RUN rustup component add rustfmt --toolchain nightly
RUN rustup default nightly
RUN cargo build

CMD ["odds-service"]