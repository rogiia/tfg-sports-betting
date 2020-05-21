package models

import (
	"log"

	"../persistence"
	"gopkg.in/mgo.v2/bson"
)

// COLLECTION of the database table
const (
	COLLECTION = "balance"
)

// Balance model
type Balance struct {
	UserID  string  `json:"userid"`
	Balance float32 `json:"balance"`
}

// GetBalance : Get user balance
func GetBalance(userID string) (float32, error) {
	sessionCopy := persistence.Database.MgDbSession.Copy()
	defer sessionCopy.Close()

	// Get a collection to execute query against.
	collection := sessionCopy.DB(persistence.Database.Databasename).C(COLLECTION)

	var balance Balance
	err := collection.Find(bson.M{"userid": userID}).One(&balance)
	log.Println(balance)
	if balance.UserID == "" {
		var newBalance = Balance{
			UserID:  userID,
			Balance: 0,
		}
		err := collection.Insert(newBalance)
		if err != nil {
			log.Println("Error inserting new balance")
			log.Println(err)
			return 0, err
		}
		return balance.Balance, nil
	}
	return balance.Balance, err
}

// UpdateBalance : Insert adds a new entity into database
func UpdateBalance(balance Balance) error {
	sessionCopy := persistence.Database.MgDbSession.Copy()
	defer sessionCopy.Close()

	// Get a collection to execute the query against.
	collection := sessionCopy.DB(persistence.Database.Databasename).C(COLLECTION)

	err := collection.Update(bson.M{"userid": balance.UserID}, &balance)
	return err
}

// AddBalance : Insert adds a new entity into database
func AddBalance(userID string, amount float32) (float32, error) {
	var currentBalance, err = GetBalance(userID)
	if err != nil {
		log.Println("Cannot find user current balance")
		log.Println(err)
		return 0, err
	}
	var newAmount = currentBalance + amount
	var newBalance = Balance{
		UserID:  userID,
		Balance: newAmount,
	}
	var upsertErr = UpdateBalance(newBalance)
	if upsertErr != nil {
		log.Println("Cannot update user current balance")
		log.Println(upsertErr)
		return currentBalance, upsertErr
	}
	return newAmount, nil
}
