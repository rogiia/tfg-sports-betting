FROM golang:latest
WORKDIR /usr/src/app
ENV PORT 8080
COPY get-dependencies.sh .
RUN chmod u+x get-dependencies.sh
RUN ./get-dependencies.sh
COPY src ./src
RUN go build src/main.go
COPY protos ./protos
EXPOSE 8080 50051
CMD [ "./main" ]