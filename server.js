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