//Inserting nodes
var path = require("path");
var express = require("express");
var dataService = require("./data-service.js");
var app = express();


//Setting the local host port
var HTTP_PORT = process.env.PORT || 8080;

function onHttpStart(){
    console.log("Express http server listenin on port " + HTTP_PORT);
}



app.use(express.static('public'));

//Home
app.get("/", function(req, res) {
    res.sendFile(path.join( __dirname, "/views/home.html"));
});

//About
app.get("/about", function(req, res) {
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

//Managers
app.get("/managers", function(req, res){
    dataService.Managers().then(function(data){
        res.json(data);
    }).catch(function(err){
    res.json({ message: err})})});

//Employees
app.get("/employees", function(req, res){
    dataService.getAllEmployees().then(function(data){
        res.json(data);
    }).catch(function(err){
    res.json({ message: err})})});

//Departments
app.get("/departments", function(req, res){
    dataService.getDepartments().then(function(data){
        res.json(data);
    }).catch(function(err)
    { message: err})});

app.use(function(req,res){
    res.status(404).send("Page Not Found")
});

// setup http server to listen on HTTP_PORT
dataService.initialize().then(function(){
    app.listen(HTTP_PORT, onHttpStart);
}).catch(function(err){
    console.log("FAILED: " + err);
});
