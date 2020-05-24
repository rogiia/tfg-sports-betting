FROM openjdk:12
RUN mkdir -p /opt/entity-service/ 
COPY ./target/entityservice-0.0.1-SNAPSHOT.jar /opt/entity-service/
WORKDIR /opt/entity-service/
EXPOSE 8080
CMD ["java", "-jar", "entityservice-0.0.1-SNAPSHOT.jar"]
