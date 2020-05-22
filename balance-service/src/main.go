package main

import (
	"log"

	"./common"
	"./controllers"
	"./grpc"
	"./persistence"
)

func main() {
	log.Println("Bootstraping server")
	var err = common.LoadConfig()
	if err != nil {
		log.Fatal(err)
		return
	}
	persistence.Database.Init()
	defer persistence.Database.Close()
	go grpc.Start()
	controllers.SetupRoutes()
}
