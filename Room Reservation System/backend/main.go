package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"
	"fmt"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var SECRET_KEY = []byte("gosecretkey")

type Student struct {
	FirstName string `json:"firstname" bson:"firstname"`
	LastName  string `json:"lastname" bson:"lastname"`
	Email     string `json:"email" bson:"email"`
	Password  string `json:"password" bson:"password"`
}

var client *mongo.Client

func studentSignup(response http.ResponseWriter, request *http.Request) {
	response.Header().Set("Content-Type", "application/json")
	var student Student
	json.NewDecoder(request.Body).Decode(&student)
	collection := client.Database("Student").Collection("user")
	// check if email already exists
	var email string = student.Email
	if collection.FindOne(context.Background(), bson.M{"email": email}).Err() == nil {
		response.Write([]byte(`{"message": "Email already exists"}`))
		return
	}




	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	result, _ := collection.InsertOne(ctx, student)
	response.WriteHeader(http.StatusOK)
	// print result in console
	fmt.Println(result.InsertedID)
	response.Write([]byte(`{"message":"Signed Up Successfully"}`))
}

func studentLogin(response http.ResponseWriter, request *http.Request) {
	var student Student
	var dbStudent Student

	response.Header().Set("Content-Type", "application/json")

	json.NewDecoder(request.Body).Decode(&student)
	collection := client.Database("Student").Collection("user")
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	err := collection.FindOne(ctx, bson.M{"email": student.Email}).Decode(&dbStudent)

	if dbStudent.Password != student.Password {
		response.Write([]byte(`{"message": "Invalid Credentials"}`))
		return
	}

	if err != nil {
		response.Write([]byte(`{"message": "Invalid Credentials"}`))
		return
	}

	response.Write([]byte(`{"message": "Logged In Successfully"}`))

}

func main() {

	// enable cors for all origins
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"*"},
	})

	// connect to mongo db
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	client, _ = mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017"))

	router := mux.NewRouter()

	router.HandleFunc("/signup", studentSignup).Methods("POST")
	router.HandleFunc("/login", studentLogin).Methods("POST")

	log.Fatal(http.ListenAndServe(":8001", c.Handler(router)))
}