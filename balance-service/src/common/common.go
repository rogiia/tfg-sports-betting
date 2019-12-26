package common

import "os"

// Configuration stores setting values
type Configuration struct {
	Port string

	MongoAddr     string
	MongoDbName   string
	MongoUsername string
	MongoPassword string

	//AuthAddr          string `json:"authAddr"`
	//JwtSecretPassword string `json:"jwtSecretPassword"`
	//Issuer            string `json:"issuer"`
}

// Config shares the global configuration
var (
	Config *Configuration
)

// LoadConfig loads configuration from the config file
func LoadConfig() error {
	Config = &Configuration{
		Port:          os.Getenv("PORT"),
		MongoAddr:     os.Getenv("MONGO_URL"),
		MongoDbName:   os.Getenv("MONGO_DATABASE"),
		MongoUsername: os.Getenv("MONGO_USER"),
		MongoPassword: os.Getenv("MONGO_PASSWORD"),
	}

	return nil
}
