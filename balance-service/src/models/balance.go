package models

import (
	"../persistence"
	"gopkg.in/mgo.v2/bson"
)

// COLLECTION of the database table
const (
	COLLECTION = "balance"
)

// Balance model
type Balance struct {
	userID  string
	balance float32
}

// GetBalance : Get user balance
func GetBalance(userID string) (float32, error) {
	sessionCopy := persistence.Database.MgDbSession.Copy()
	defer sessionCopy.Close()

	// Get a collection to execute query against.
	collection := sessionCopy.DB(persistence.Database.Databasename).C(COLLECTION)

	var balance Balance
	err := collection.Find(bson.M{userID: userID}).One(&balance)
	if balance.userID == "" {
		balance = Balance{
			userID:  userID,
			balance: 0,
		}
		err := collection.Insert(balance)
		if err != nil {
			return 0, err
		}
		return balance.balance, nil
	}
	return balance.balance, err
}

// UpsertBalance : Insert adds a new entity into database
func UpsertBalance(balance Balance) error {
	sessionCopy := persistence.Database.MgDbSession.Copy()
	defer sessionCopy.Close()

	// Get a collection to execute the query against.
	collection := sessionCopy.DB(persistence.Database.Databasename).C(COLLECTION)

	_, err := collection.Upsert(balance.userID, &balance)
	return err
}
