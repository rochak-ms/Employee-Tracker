const connection = require("./config/connection");
const inquirer = require("inquirer");

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
      }
    });
}
