package main

import (
	"net/http"
	"os"

	log "github.com/sirupsen/logrus"

	"github.com/apex/gateway"
	"github.com/gin-gonic/gin"
)

func inLambda() bool {
	if lambdaTaskRoot := os.Getenv("LAMBDA_TASK_ROOT"); lambdaTaskRoot != "" {
		return true
	}
	return false
}

func helloHandler(c *gin.Context) {
	name := c.Param("name")
	c.String(http.StatusOK, "Hello %s", name)
}

func welcomeHandler(c *gin.Context) {
	name := c.Param("name")
	city := c.Param("city")
	c.String(http.StatusOK, "Welcome %v from %v\n", name, city)
}

func pingHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "pong",
	})
}

func rootHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"text": "Welcome to gin lambda server.",
	})
}

func routerEngine() *gin.Engine {
	// set server mode
	gin.SetMode(gin.DebugMode)

	r := gin.New()

	// Global middleware
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	r.GET("/ping", pingHandler)
	r.GET("/welcome/:name/:city", welcomeHandler)
	r.GET("/user/:name", helloHandler)
	r.GET("/", rootHandler)

	return r
}

func main() {
	var addr string
	if addr = ":" + os.Getenv("PORT"); addr != ":" {
		log.Printf("listening on %v", addr)
	} else {
		addr = ":8888"
		log.Printf("listening on %v", addr)
	}
	if inLambda() {
		log.Fatal(gateway.ListenAndServe(addr, routerEngine()))
	} else {
		log.Fatal(http.ListenAndServe(addr, routerEngine()))
	}
}
