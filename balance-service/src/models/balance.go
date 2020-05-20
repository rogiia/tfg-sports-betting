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
	balance float64
}

// GetBalance : Get user balance
func GetBalance(userID string) (float64, error) {
	sessionCopy := persistence.Database.MgDbSession.Copy()
	defer sessionCopy.Close()

	// Get a collection to execute query against.
	collection := sessionCopy.DB(persistence.Database.Databasename).C(COLLECTION)

	var balance = Balance{userID: userID}
	err := collection.Find(bson.M{}).One(&balance)
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
