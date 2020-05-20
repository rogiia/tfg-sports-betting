package main

import (
	"log"

	"./common"
	"./controllers"
	"./persistence"
)

func main() {
	var err = common.LoadConfig()
	if err != nil {
		log.Fatal(err)
		return
	}
	persistence.Database.Init()
	defer persistence.Database.Close()
	controllers.SetupRoutes()
}
