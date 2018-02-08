const fs = require('fs');

var employees = [];
var departments = [];

//Initialize function - sta
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


module.exports.getAllEmployees = function(){
    return new Promise(function(resolve, reject){
        if(employees.length == 0){
            reject("No results returned");
        }else{
            resolve(employees);
        }
    });
}


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


module.exports.getDepartments = function(){
    return new Promise(function(resolve, reject){
        if(employees.length == 0){
            reject("No results returned");
        }else{
            resolve(departments);
        }
    });
}