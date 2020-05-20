package controllers

import (
	"../common"
	"github.com/gin-gonic/gin"
)

var path = "/api/balance"

// SetupRoutes : setup server routes
func SetupRoutes() {
	r := gin.Default()
	r.GET(path, GetBalance)
	r.Run("0.0.0.0:" + common.Config.Port)
}
