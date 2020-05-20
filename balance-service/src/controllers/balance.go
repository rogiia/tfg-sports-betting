package controllers

import (
	"log"

	"../common"
	"../models"
	"github.com/gin-gonic/gin"
)

// GetBalance controller
func GetBalance(ctx *gin.Context) {
	var authorization = ctx.GetHeader("Authorization")
	if authorization == "" {
		ctx.JSON(401, gin.H{
			"message": "Missing authentication",
		})
	}
	var username, parseErr = common.ParseAuthorizationHeader(authorization)
	if parseErr != nil {
		ctx.JSON(403, gin.H{
			"message": "Invalid authentication",
		})
		return
	}
	var balance, err = models.GetBalance(username)
	if err != nil {
		log.Fatal(err)
		ctx.JSON(500, gin.H{
			"message": err,
		})
		return
	}
	ctx.JSON(200, gin.H{
		"balance": balance,
	})
}
