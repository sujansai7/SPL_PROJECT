package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

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

type Book struct {
	Room string `json:"room" bson:"room"`
	Date string `json:"date" bson:"date"`
	Time string `json:"time" bson:"time"`
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

func bookTwo(response http.ResponseWriter, request *http.Request) {
	var book Book
	response.Header().Set("Content-Type", "application/json")
	json.NewDecoder(request.Body).Decode(&book)
	collection := client.Database("Student").Collection("Rooms")
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	result, _ := collection.InsertOne(ctx, book)
	response.WriteHeader(http.StatusOK)
	fmt.Println(result.InsertedID)
	response.Write([]byte(`{"message":"Booking Confirmed"}`))

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

func bookOne(response http.ResponseWriter, request *http.Request) {
	var book Book
	response.Header().Set("Content-Type", "application/json")
	json.NewDecoder(request.Body).Decode(&book)
	collection := client.Database("Student").Collection("Rooms")
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)

	// return time of all documents where date is equal to the date and room is equal to the room
	cursor, err := collection.Find(ctx, bson.M{"date": book.Date, "room": book.Room})
	if err != nil {
		log.Fatal(err)
	}
	defer cursor.Close(ctx)

	var times []string
	for cursor.Next(ctx) {
		var result Book
		err := cursor.Decode(&result)
		if err != nil {
			log.Fatal(err)
		}
		times = append(times, result.Time)
	}
	if err := cursor.Err(); err != nil {
		log.Fatal(err)
	}
	fmt.Println(times)
	json.NewEncoder(response).Encode(times)

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
	router.HandleFunc("/bookOne", bookOne).Methods("POST")
	router.HandleFunc("/bookTwo", bookTwo).Methods("POST")

	log.Fatal(http.ListenAndServe(":8001", c.Handler(router)))
}
