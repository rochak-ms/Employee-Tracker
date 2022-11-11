const connection = require("./config/connection");
// importing inquirer
const inquirer = require("inquirer");
// importing express
const express = require("express");
// importing console.table
const cTable = require("console.table");
// importing chalk
const Chalk = require("chalk");
// importing figlet
const figlet = require("figlet");
//importing mysql2
const mysql = require("mysql2");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Default response to any other request = not found
app.use((req, res) => {
  res.status(404).end();
});

// Start server after Database Connection
connection.connect((err) => {
  if (err) throw err;
  app.listenerCount(PORT, () => {});
});

// prompt function
function startPrompt() {
  inquirer
    .prompt({
      type: "list",
      name: "menu",
      message: "What would you like to do?",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add a Department",
        "Add a Role",
        "Add a Employee",
        "Update an Employee Role",
        "Update an Employee Manager",
        "Delete a Department",
        "Delete a Role",
        "Delete an Employee",
        "Exit Menu",
      ],
    })
    .then((answer) => {
      switch (answer.menu) {
        case "View All Departments":
          viewAllDepartments();
          break;
        case "View All Roles":
          viewAllRoles();
          break;
        case "View All Employees":
          viewAllEmployees();
          break;
        case "Add a Department":
          addDepartment();
          break;
        case "Add a Role":
          addRole();
          break;
        case "Add an Employee":
          addEmployee();
          break;
        case "Update an Employee Role":
          updateEmployeeRole();
          break;
        case "Update an Employee Manager":
          updateEmployeeManager();
          break;
        case "Delete a Department":
          deleteDeparment();
          break;
        case "Delete a Role":
          deleteRole();
          break;
        case "Delete an Employee":
          deleteEmployee();
          break;
        case "Exit Menu":
          connection.end();
          break;
      }
    });
}

// function to view all departments
funtion viewAllDepartments() {
  const sql = `SELECT * FROM department`;
  connection.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    console.table(result);
    startPrompt();
  });
};

// function to view all roles
funtion viewAllRoles() {
  const sql = `SELECT * FROM role`;
  connection.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    console.table(result);
    startPrompt();
  });
};

// function to view all employees
funtion viewAllEmployees() {
  const sql = `SELECT employee.id,
              employee.first_name,
              employee.last_name,
              role.title AS job_title,
              department.department_name,
              role.salary,
              CONCAT(manager.first_name, " " ,manager.last_name) AS manager
              FROM employee
              LEFT JOIN role ON employee.role_id = role.id
              LEFT JOIN department ON role.department_id = department.id
              LEFT JOIN employee AS manager ON employee.manager_id = manager.id
              ORDER By employee.id`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    console.table(result);
    startPrompt();
  });
};

// Add departments
function addDepartment() {
  inquirer.prompt([
      {   
          type: "input",
          name: "department_name",
          message: "Please enter the name of the department you want to add."
      }
  ]).then((answer) => {

  const sql = `INSERT INTO department (department_name)
              VALUES (?)`;
  const params = [answer.department_name];
      connection.query(sql, params, (err, result) => {
          if (err) throw err;
          console.log('The new department entered has been added successfully.');

      connection.query(`SELECT * FROM department`, (err, result) => {
          if (err) {
              res.status(500).json({ error: err.message })
              return;
          }
          console.table(result);
          startPrompt();
      });
  });
});
};

// Add a role
function addRole() {
  inquirer.prompt([
      {
          type: "input",  
          name: "title",
          message: "Please enter the title of role you want to add."
      },
      {
          type: "input",
          name: "salary",
          message: "Please enter the salary associated with the role you want to add."
      },
      {
          type: "number",
          name: "department_id",
          message: "Please enter the department's id associated with the role you want to add."
      }
  ]).then(function (response) {
          connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [response.title, response.salary, response.department_id], function (err, data) {
              if (err) throw err;
              console.log('The new role entered has been added successfully to the database.');

          connection.query(`SELECT * FROM role`, (err, result) => {
              if (err) {
                  res.status(500).json({ error: err.message })
                  startPrompt();
              }
              console.table(result);
              startPrompt();
          });
      })
});
};

// Add employees
function addEmployee() {
  inquirer.prompt([
      {
          type: "input",
          name: "first_name",
          message: "Please enter the first name of the employee you want to add."
      },
      {
          type: "input",
          name: "last_name",
          message: "Please enter the last name of the employee you want to add."
      },
      { 
          type: "number",
          name: "role_id",
          message: "Please enter the role id number associated with the employee you want to add."
      },
      {
          name: "manager_id",
          type: "number",
          message: "Please enter the manager's id number associated with the employee you want to add."
      }

  ]).then(function (response) {
          connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [response.first_name, response.last_name, response.role_id, response.manager_id], function (err, data) {
              if (err) throw err;
              console.log('The new employee entered has been added successfully to the database.');

          connection.query(`SELECT * FROM employee`, (err, result) => {
              if (err) {
                  res.status(500).json({ error: err.message })
                  startPrompt();
              }
              console.table(result);
              startPrompt();
          });
      })
});
};

// Update employee role
function updateEmployeeRole() {
  inquirer.prompt([
      {   
          type: "input",
          name: "first_name",
          message: "Please enter the first name of the employee you want update."
      },
      {   
          type: "number",
          name: "role_id",
          message: "Please enter the new role number id associated with the employee you want to update."
      }
  ]).then(function (response) {
          connection.query("UPDATE employee SET role_id = ? WHERE first_name = ?", [response.role_id, response.first_name], function (err, data) {
              if (err) throw err;
              console.log('The new role entered has been added successfully to the database.');

          connection.query(`SELECT * FROM employee`, (err, result) => {
              if (err) {
                  res.status(500).json({ error: err.message })
                  startPrompt();
              }
              console.table(result);
              startPrompt();
          });
      })
});
};

// Update employee manager
function updateEmployeeManager() {
  inquirer.prompt([
      {
          type: "input",
          name: "first_name",
          message: "Please enter the first name of the employee you want update"
      },
      {
          type: "number",
          name: "manager_id",
          message: "Please enter the new manager's id number associated with the employee you want to update."
      }
  ]).then(function (response) {
          connection.query("UPDATE employee SET manager_id = ? WHERE first_name = ?", [response.manager_id, response.first_name], function (err, data) {
              if (err) throw err;
              console.log("The new manager's id entered has been added successfully to the database.");

          connection.query(`SELECT * FROM employee`, (err, result) => {
              if (err) {
                  res.status(500).json({ error: err.message })
                  startPrompt();
              }
              console.table(result);
              startPrompt();
          });
      })
});
};

// Delete department
function deleteDepartment() {
  inquirer.prompt([
      {
          type: "number",
          name: "department_id",
          message: "Please enter the id of the department you want to delete."
      }
  ]).then(function (response) {
          connection.query("DELETE FROM department WHERE id = ?", [response.department_id], function (err, data) {
              if (err) throw err;
              console.log("The department entered has been deleted successfully from the database.");

          connection.query(`SELECT * FROM department`, (err, result) => {
              if (err) {
                  res.status(500).json({ error: err.message })
                  startPrompt();
              }
              console.table(result);
              startPrompt();
          });
      })
});
};

// Delete role
function deleteRole() {
  inquirer.prompt([
      {
          type: "number",
          name: "role_id",
          message: "Please enter the id of the role you want to delete."
      }
  ]).then(function (response) {
          connection.query("DELETE FROM role WHERE id = ?", [response.role_id], function (err, data) {
              if (err) throw err;
              console.log("The role entered has been deleted successfully from the database.");

          connection.query(`SELECT * FROM role`, (err, result) => {
              if (err) {
                  res.status(500).json({ error: err.message })
                  startPrompt();
              }
              console.table(result);
              startPrompt();
          });
      })
});
};

// Delete Employee
function deleteEmployee() {
  inquirer.prompt([
      {
          type: "number",
          name: "employee_id",
          message: "Please enter the id of the employee you want to delete."
      }
  ]).then(function (response) {
          connection.query("DELETE FROM employee WHERE id = ?", [response.employee_id], function (err, data) {
              if (err) throw err;
              console.log("The employee entered has been deleted successfully from the database.");

          connection.query(`SELECT * FROM employee`, (err, result) => {
              if (err) {
                  res.status(500).json({ error: err.message })
                  startPrompt();
              }
              console.table(result);
              startPrompt();
          });
      })
});
};


// call to start
startPrompt();