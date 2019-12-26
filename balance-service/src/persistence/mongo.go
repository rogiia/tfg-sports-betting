package persistence

import (
	"time"

	"../common"
	mgo "gopkg.in/mgo.v2"
)

// MongoDB manages MongoDB connection
type MongoDB struct {
	MgDbSession  *mgo.Session
	Databasename string
}

// Init initializes mongo database
func (db *MongoDB) Init() error {
	db.Databasename = common.Config.MongoDbName

	// DialInfo holds options for establishing a session with a MongoDB cluster.
	dialInfo := &mgo.DialInfo{
		Addrs:    []string{common.Config.MongoAddr}, // Get HOST + PORT
		Timeout:  60 * time.Second,
		Database: db.Databasename,             // Database name
		Username: common.Config.MongoUsername, // Username
		Password: common.Config.MongoPassword, // Password
	}

	// Create a session which maintains a pool of socket connections
	// to the DB MongoDB database.
	var err error
	db.MgDbSession, err = mgo.DialWithInfo(dialInfo)

	if err != nil {
		panic(err)
	}

	return err
}

// Close the existing connection
func (db *MongoDB) Close() {
	if db.MgDbSession != nil {
		db.MgDbSession.Close()
	}
}
