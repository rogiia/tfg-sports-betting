package controllers

import (
	"../common"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

var path = "/api/balance"

// SetupRoutes : setup server routes
func SetupRoutes() {
	r := gin.Default()
	r.GET(path, GetBalance)
	r.POST(path, AddBalance)
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowAllOrigins = true
	corsConfig.AllowHeaders = []string{"Origin", "Authorization"}
	r.Use(cors.New(corsConfig))
	r.Run("0.0.0.0:" + common.Config.Port)
}
