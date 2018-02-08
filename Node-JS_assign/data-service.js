const fs = require('fs');

var employees = [];
var departments = [];

//Initialize function - get the information from employees and departments from the json file and store it
// in variables
module.exports.initialize = function(){
    return new Promise(function(resolve, reject){
        fs.readFile('./data/employees.json', (err, data) => {
            if (err){
                reject("unable to read employees");
            }else{
                employees = JSON.parse(data);
                fs.readFile('./data/departments.json', (err, data) => {
                    if(err){
                        reject("unable to read departments");
                    }else{
                        departments = JSON.parse(data);
                        resolve();
                    }
                });
            }
        });
    });
}

// Returns a promise - This function get all employees
module.exports.getAllEmployees = function(){
    return new Promise(function(resolve, reject){
        if(employees.length == 0){
            reject("No results returned");
        }else{
            resolve(employees);
        }
    });
}

// This function gets all employees, but filter the results checking
//if the isManager property is equal to true
module.exports.Managers = function(){
    var manager = [];
    return new Promise(function(resolve, reject){
        if(employees.length == 0){
            reject("No results returned");
        }else{
            for(var i = 0; i< employees.length; ++i){
                manager.push(employees[i]);
            }
            resolve(manager);
        }
    });
} 


// Returns a promise - This function get all Departments
module.exports.getDepartments = function(){
    return new Promise(function(resolve, reject){
        if(employees.length == 0){
            reject("No results returned");
        }else{
            resolve(departments);
        }
    });
}
