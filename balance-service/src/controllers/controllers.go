package controllers

import (
	"time"

	"../common"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

var path = "/api/balance"

// SetupRoutes : setup server routes
func SetupRoutes() {
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Authorization"},
		AllowCredentials: false,
		MaxAge:           12 * time.Hour,
	}))
	r.GET(path, GetBalance)
	r.Run("0.0.0.0:" + common.Config.Port)
}
