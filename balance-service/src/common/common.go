package common

import (
	"encoding/json"
	"errors"
	"log"
	"os"
	"regexp"

	"github.com/dgrijalva/jwt-go"
)

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
	log.Println("Loading app configuration...")
	Config = &Configuration{
		Port:          os.Getenv("PORT"),
		MongoAddr:     os.Getenv("MONGO_URL"),
		MongoDbName:   os.Getenv("MONGO_DATABASE"),
		MongoUsername: os.Getenv("MONGO_USER"),
		MongoPassword: os.Getenv("MONGO_PASSWORD"),
	}

	log.Println("App configuration loaded.")
	return nil
}

// TokenBody typing
type TokenBody struct {
	username string
}

// ParseAuthorizationHeader : Parse authorization header, extracting user id
func ParseAuthorizationHeader(authorization string) (string, error) {
	re := regexp.MustCompile(`^Bearer .+\.(.+)\..+$`)
	bearer := re.FindSubmatch([]byte(authorization))
	if len(bearer) != 2 {
		return "", errors.New("Missing authorization")
	}
	tokeninfo := string(bearer[1])
	parsed, err := jwt.DecodeSegment(tokeninfo)
	body := TokenBody{}
	err = json.Unmarshal(parsed, &body)
	if err != nil {
		return "", err
	}
	return body.username, nil
}
