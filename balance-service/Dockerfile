FROM golang:latest as builder
RUN apt-get update && apt-get -y install git
RUN mkdir /build 
ADD . /build/
WORKDIR /build 
RUN ./get-dependencies.sh
RUN go build src/main.go

FROM alpine
RUN adduser -S -D -H -h /app appuser
USER appuser
COPY --from=builder /build/main /app/
WORKDIR /app
EXPOSE 8080 50051
CMD ["./main"]