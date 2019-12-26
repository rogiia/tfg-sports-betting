package main

import (
	"fmt"
	"html"
	"log"
	"net/http"

	"./persistence"
)

const port = "8080"

func main() {
	persistence.Database.Init()
	defer persistence.Database.Close()
	http.HandleFunc("/bar", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello, %q", html.EscapeString(r.URL.Path))
	})

	fmt.Printf("Listening on port %q", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
