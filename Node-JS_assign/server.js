/*****************************************************************************************************
* WEB322 – Assignment 04 
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students. 
* 
* Name: Gilberto Silva Student ID: 139.236.160 Date: 03/12/2018 
* 
* Online (Heroku) Link: https://stark-reef-58952.herokuapp.com/
******************************************************************************************************/


//Inserting nodes
const exphbs = require("express-handlebars");
const multer = require("multer");
const path = require("path");
const express = require("express");
const dataService = require("./data-service.js");
const fs = require('fs');
const bodyParser = require("body-parser");
var app = express();

//Setting the server to know how to handle with HTML files that are formated using handlebars
app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        navLink: function(url, options){
                return '<li' +
            ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
            '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
                if (lvalue != rvalue) {
                    return options.inverse(this);
                } else {
                    return options.fn(this);
                }
        }
    }
}));
app.set('view engine', '.hbs');

//Setting the middleware for "urlencoded" form data(normal HTTP Post data)
app.use(bodyParser.urlencoded({extended: true}));

//Setting the local host port
var HTTP_PORT = process.env.PORT || 8080;

function onHttpStart(){
    console.log("Express http server listenin on port " + HTTP_PORT);
}


//Setting the storage name for the uploaded images.
const storage = multer.diskStorage({
    destination:"./public/images/uploaded/",
    filename: function(req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

//This function tells multer to use DiskStorage for naming files instead of the default.
const upload = multer({storage: storage});

app.use(express.static('./public/'));

//This middleware add the property "activeRoute" to "app.locals" whenever the route changes
app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
    });



//Route of the Home
app.get("/", (req, res) => {
    res.render('home');
});

//route of the About section
app.get("/about", (req, res) => {
    res.render('about');
});

//Routes of the form to add an employee
app.get("/employees/add", (req, res) =>{
    res.render('AddEmployees');
})

app.post("/employees/add",(req, res)=> {
    dataService.addEmployee(req.body).then(function(data) {
        res.redirect("/employees");
    }).catch(function(err) {
        res.json({ message: err })
    })  
})


//Route of the form to upload a image
app.get("/images/add", (req, res) =>{
     res.render('AddImages');
})    

 
app.post("/images/add", upload.single("imageFile"), (req, res) =>{
    res.redirect("/images");
})


//Route to show all images uploaded
app.get("/images", (req, res) => {
    fs.readdir('./public/images/uploaded', (err, data) => {
        if (err) {
            console.log("Unable to read the files!");
        } else {
            res.render("images.hbs", {images : data });
        }
    })
});


//Route to show Employees (All employees or filtered by a specific parameter)
app.get("/employees", (req, res) => {
    const status = req.query.status;
    const department = req.query.department;
    const manager = req.query.manager;


    //Filtering employees by status "Full Time" or "Part Time"
    if(status != null){
        dataService.getEmployeesByStatus(status).then(function(data) {
            res.render("employees",{employees: data});
        }).catch(function(err) {
            res.render({message: "no results"});
        })                
    }
    
    //Filtering employees by department number from 1 to 7
    if(department != null){
        dataService.getEmployeesByDepartment(department).then(function(data) {
            res.render("employees",{employees: data});
        }).catch(function(err) {
            res.render({message: "no results"});
        })                
    }

    //Filtering employees by its manager´s employeeNum that has values from 1 to 30    
    if(manager != null){
        dataService.getEmployeesByManager(manager).then(function(data) {
            res.render("employees",{employees: data});
        }).catch(function(err) {
            res.render({message: "no results"});
        })                
    }

    //If there is no value to filter, it will show the full list of employees
    if(status == null && department == null && manager == null){
        dataService.getAllEmployees().then(function(data) {
            res.render("employees",{employees: data});
        }).catch(function(err) {
            res.render({message: "no results"});
        })
    }
});

//Route to select only one specific employee by his employeeNum placed in value
app.get("/employee/:value", (req, res) => { 
    const value = req.params.value
        dataService.getEmployeeByNum(value).then(function(data) {
            res.render('employee', { employee: data[0] });
        }).catch(function(err) {
            res.render('employee', { message:"no results" });
        })
});

app.post("/employee/update", (req, res) => { 
    dataService.updateEmployee(req.body).then(function() {
        res.redirect("/employees");
    }).catch(function(err) {
        res.json({ message: err })
    })  
})

/* This route is not being used anymore
//Managers
app.get("/managers", (req, res) => {
    dataService.Managers().then(function(data) {
        res.json(data);
    }).catch(function(err) {
        res.json({
            message: err
        })
    })
});
*/

//Departments
app.get("/departments", (req, res)=> {
    dataService.getDepartments().then(function(data) {
        res.render("departments", {departments: data});
    }).catch(function(err) {
        message: err
    })
});

//Page nor found
app.use(function(req,res){
    res.status(404).send("Page Not Found")
});


// setup http server to listen on HTTP_PORT
dataService.initialize().then(function(){
    app.listen(HTTP_PORT, onHttpStart);
}).catch(function(err){
    console.log("FAILED: " + err);
});

