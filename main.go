package main

import (
	"canopas-website/contact"
	"embed"
	"log"
	"os"

	"github.com/apex/gateway"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

//go:embed templates/email-template.html
var tmplFS embed.FS

func main() {
	router := gin.Default()

	router.Use(cors.New(corsConfig()))

	contactRepo := contact.New(tmplFS)

	router.POST("/api/send-contact-mail", contactRepo.SendContactMail)

	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Pong",
		})
	})

	if inLambda() {
		log.Fatal(gateway.ListenAndServe(":8080", router))
	} else {
		router.Run()
	}
}

func inLambda() bool {
	if lambdaTaskRoot := os.Getenv("LAMBDA_TASK_ROOT"); lambdaTaskRoot != "" {
		return true
	}
	return false
}

func corsConfig() cors.Config {
	defaultCors := cors.DefaultConfig()
	defaultCors.AllowAllOrigins = true
	return defaultCors
}