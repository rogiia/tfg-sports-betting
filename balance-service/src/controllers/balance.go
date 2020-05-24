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
		return
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
		log.Println("Error retreiving user balance")
		log.Println(err)
		ctx.JSON(500, gin.H{
			"message": err,
		})
		return
	}
	ctx.Writer.Header().Set("Access-Control-Allow-Origin", "*")
	ctx.JSON(200, gin.H{
		"balance": balance,
	})
	return
}

type addBalancePayload struct {
	Amount float32 `json:"amount"`
}

// AddBalance controller
func AddBalance(ctx *gin.Context) {
	ctx.Writer.Header().Set("Access-Control-Allow-Origin", "*")
	var authorization = ctx.GetHeader("Authorization")
	if authorization == "" {
		ctx.JSON(401, gin.H{
			"message": "Missing authentication",
		})
		return
	}
	var username, parseErr = common.ParseAuthorizationHeader(authorization)
	if parseErr != nil {
		ctx.JSON(403, gin.H{
			"message": "Invalid authentication",
		})
		return
	}
	var payload addBalancePayload
	ctx.BindJSON(&payload)
	var balance, err = models.AddBalance(username, payload.Amount)
	if err != nil {
		log.Println("Error updating user balance")
		log.Println(err)
		ctx.JSON(500, gin.H{
			"message": err,
		})
		return
	}
	ctx.JSON(200, gin.H{
		"balance": balance,
	})
	return
}
