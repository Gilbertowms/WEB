const fs = require('fs');

var employees = [];
var departments = [];

//Initialize function 
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

/*This function returns all the information in the employees.json file*/
module.exports.getAllEmployees = function(){
    return new Promise(function(resolve, reject){
        if(employees.length == 0){
            reject("No results returned");
        }else{
            resolve(employees);
        }
    });
}

/*This function gets the information in the employees.json file, check each one has the isManager = true
and returns an array that contains all the employees that are managers*/
module.exports.Managers = function(){
    var manager = [];
    return new Promise(function(resolve, reject){
        if(employees.length == 0){
            reject("No results returned");
        }else{
            for(var i = 0; i< employees.length; ++i){
                if(employees[i].isManager == true)
                {
                manager.push(employees[i]);
                }
            }
            resolve(manager);
        }
    });
} 

/*This function returns all the information in the departments.json file*/
module.exports.getDepartments = function(){
    return new Promise(function(resolve, reject){
        if(employees.length == 0){
            reject("No results returned");
        }else{
            resolve(departments);
        }
    });
}


/*This function add an employee in the employees.json file*/
module.exports.addEmployee = function(employeeData){
    return new Promise((resolve, reject) =>{
        if(employees.length == 0){
            reject("No results returned");
        }
        else{
           if(employeeData.isManager == undefined){
               employeeData.isManager == false;
            }
            else{
                employeeData.isManager == true;
            }
            employeeData.employeeNum = employeeData.length + 1;
            employees.push(employeeData);
            resolve(employees);
        }        
    });
}

/*This function receives a employee´s status("Full Time" or "Part Time") 
and return an array that holds all the employees that has that specific status*/
module.exports.getEmployeesByStatus = (status)=>{
    var employeesData = [];
    return new Promise((resolve, reject) =>{
        if(employees.length == 0){
            reject("No results returned");
        }
        else{
            for(let i = 0 ; i < employees.length; ++i){
                if(employees[i].status == status){
                    employeesData.push(employees[i]);
                }
            }
            resolve(employeesData);
        }
    })
}


/*This function receives a department number and returns an array with all the employees that 
work on this department*/
module.exports.getEmployeesByDepartment = (department)=>{
    var departmentData = [];
    return new Promise((resolve, reject) =>{
        if(employees.length == 0){
            reject("No results returned");
        }
        else{
            for(let i = 0 ; i < employees.length; ++i){
                if(employees[i].department == department){
                    departmentData.push(employees[i]);
                }
            }
        resolve(departmentData);
        }
    })
}

/* This function receives an employeeNum that belongs to a manager and return all the employees
that work for the manager that holds this employeeNum */
module.exports.getEmployeesByManager = (manager)=>{
    var managerData = [];
    return new Promise((resolve, reject) =>{
        if(employees.length == 0){
            reject("No results returned");
        }
        else{
            for(let i = 0 ; i < employees.length; ++i){
                if(employees[i].employeeManagerNum == manager){
                    managerData.push(employees[i]);
                }
            }
        resolve(managerData);
        }
    })
}

/*This function find a specific employee by his employeeNum and return an object with all its data*/
module.exports.getEmployeeByNum = (num)=>{
    var empNumData = [];
    return new Promise((resolve, reject) =>{
        if(employees.length == 0){
            reject("No results returned");
        }
        else{
            for(let i = 0 ; i < employees.length; ++i){
                if(employees[i].employeeNum == num){
                    empNumData.push(employees[i]);
                }
            }
        resolve(empNumData);
        }
    })
}

/*This function receives an employeeData, through the employeeData.employeeNum search. 
Once its found, overwrites with the new employeeData passed */
module.exports.updateEmployee = (employeeData) =>{
    return new Promise((resolve, reject) =>{
        if(employees.length == 0){
            reject("No results returned");
        }
        else{
            for(let i = 0 ; i < employees.length; ++i){
                if(employees[i].employeeNum == employeeData.employeeNum){
                    employees[i].firstName = employeeData.firstName;
                    employees[i].lastName = employeeData.lastName;
                    employees[i].email = employeeData.email;
                    employees[i].addressStreet = employeeData.addressStreet;
                    employees[i].addresCity = employeeData.addresCity;
                    employees[i].addressState = employeeData.addressState;
                    employees[i].addressPostal = employeeData.addressPostal;
                    employees[i].isManager = employeeData.isManager;
                    employees[i].employeeManagerNum = employeeData.employeeManagerNum;
                    employees[i].status = employeeData.status;
                    employees[i].department = employeeData.department;
                }
            }
        resolve();
        }
    })
}
