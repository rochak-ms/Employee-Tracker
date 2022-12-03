const connection = require("./config/connection");
// importing inquirer
const inquirer = require("inquirer");
// importing express
const express = require("express");
// importing console.table
const cTable = require("console.table");
// importing chalk
const chalk = require("chalk");

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
const startPrompt = () => {
  inquirer
    .prompt({
      type: "list",
      name: "menu",
      message: chalk.green.bold("What would you like to do?"),
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add a Department",
        "Add a Role",
        "Add a Employee",
        "Update an Employee Role",
        "Update an Employee Manager",
        "View employees by Manager",
        "View employees by Department",
        "Delete a Department",
        "Delete a Role",
        "Delete an Employee",
        "View Department Budgets",
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
        case "Add a Employee":
          addEmployee();
          break;
        case "Update an Employee Role":
          updateEmployeeRole();
          break;
        case "Update an Employee Manager":
          updateEmployeeManager();
          break;
        case "View employees by Manager":
          viewEmpByManager();
          break;
        case "View employees by Department":
          viewEmpByDepartment();
          break;
        case "Delete a Department":
          deleteDepartment();
          break;
        case "Delete a Role":
          deleteRole();
          break;
        case "Delete an Employee":
          deleteEmployee();
          break;
        case "View Department Budgets":
          viewDepBudget();
          break;
        case "Exit Menu":
          console.log(chalk.blue.bold("See you Next time. Bye Bye!"));
          connection.end();
          break;
      }
    });
};

// function to view all departments
const viewAllDepartments = () => {
  console.log(chalk.greenBright.bold("------------------------------------"));
  console.log(chalk.greenBright.bold("      Showing all departments      "));
  console.log(chalk.greenBright.bold("------------------------------------"));
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
const viewAllRoles = () => {
  console.log(chalk.greenBright.bold("------------------------------------"));
  console.log(chalk.greenBright.bold("         Showing all Roles          "));
  console.log(chalk.greenBright.bold("------------------------------------"));
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
const viewAllEmployees = () => {
  console.log(chalk.greenBright.bold("------------------------------------"));
  console.log(chalk.greenBright.bold("       Showing all Employees        "));
  console.log(chalk.greenBright.bold("------------------------------------"));
  const sql = `SELECT employee.id,
                employee.first_name,
                employee.last_name,
                role.title AS job_title,
                department.department_name,
                role.salary,
                CONCAT(manager.first_name, ' ' ,manager.last_name) AS manager
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
const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department_name",
        message: chalk.blue.bold(
          "Please enter the name of the department you want to add."
        ),
      },
    ])
    .then((answer) => {
      const sql = `INSERT INTO department (department_name)
              VALUES (?)`;
      const params = [answer.department_name];
      connection.query(sql, params, (err, result) => {
        if (err) throw err;
        console.log(
          "----------------------------------------------------------"
        );
        console.log(
          chalk.green.bold(
            "Added " + answer.department_name + " department to the database."
          )
        );
        console.log(
          "----------------------------------------------------------"
        );

        connection.query(`SELECT * FROM department`, (err, result) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          console.table(result);
          startPrompt();
        });
      });
    });
};

// Add a role
const addRole = () => {
  const sql = "SELECT * FROM department";
  connection.query(sql, (err, response) => {
    if (err) throw err;
    // Logic to add new dept for the new role...
    let deptNamesArray = [];
    response.forEach((department) => {
      deptNamesArray.push(department.department_name);
    });
    deptNamesArray.push("Create Department");
    inquirer
      .prompt([
        {
          name: "departmentName",
          type: "list",
          message: chalk.blue.bold(
            "Which department will you add this role to?"
          ),
          choices: deptNamesArray,
        },
      ])
      .then((response) => {
        if (response.departmentName === "Create Department") {
          this.addDepartment();
        } else {
          addRoleResume(response);
        }
      });

    const addRoleResume = (departmentData) => {
      inquirer
        .prompt([
          {
            name: "newRole",
            type: "input",
            message: chalk.blue.bold("What is the name of your new role?"),
          },
          {
            name: "salary",
            type: "input",
            message: chalk.blue.bold("What is the salary of this new role?"),
          },
        ])
        .then((answer) => {
          let createdRole = answer.newRole;
          let departmentId;

          response.forEach((department) => {
            if (departmentData.departmentName === department.department_name) {
              departmentId = department.id;
            }
          });

          let sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
          let ans = [createdRole, answer.salary, departmentId];

          connection.query(sql, ans, (error) => {
            if (error) throw error;
            console.log(
              "------------------------------------------------------------------"
            );
            console.log(
              chalk.green.bold("Added " + createdRole + " role to the database")
            );
            console.log(
              "------------------------------------------------------------------"
            );
            viewAllRoles();
          });
        });
    };
  });
};

// Add employees
const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: chalk.blue.bold("What is the employee's first name?"),
      },
      {
        type: "input",
        name: "lastName",
        message: chalk.blue.bold("What is the employee's last name?"),
      },
    ])
    .then((response) => {
      const ans = [response.firstName, response.lastName];
      const roleSql = `SELECT role.id, role.title FROM role`;
      connection.query(roleSql, (error, data) => {
        if (error) throw error;
        const roles = data.map(({ id, title }) => ({ name: title, value: id }));
        inquirer
          .prompt([
            {
              type: "list",
              name: "role",
              message: chalk.blue.bold("What is the employee's role?"),
              choices: roles,
            },
          ])
          .then((roleChoice) => {
            const role = roleChoice.role;
            ans.push(role);
            const managerSql = `SELECT * FROM employee`;
            connection.query(managerSql, (error, data) => {
              if (error) throw error;
              const managers = data.map(({ id, first_name, last_name }) => ({
                name: first_name + " " + last_name,
                value: id,
              }));
              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "manager",
                    message: chalk.blue.bold("Who is the employee's manager?"),
                    choices: managers,
                  },
                ])
                .then((managerChoice) => {
                  const manager = managerChoice.manager;
                  ans.push(manager);
                  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                  VALUES (?, ?, ?, ?)`;
                  connection.query(sql, ans, (error) => {
                    if (error) throw error;
                    console.log(
                      "------------------------------------------------------------------"
                    );
                    console.log(
                      chalk.green.bold(
                        "Added new Employee, " +
                          response.firstName +
                          " " +
                          response.lastName +
                          " to the database."
                      )
                    );
                    console.log(
                      "------------------------------------------------------------------"
                    );
                    viewAllEmployees();
                  });
                });
            });
          });
      });
    });
};

// Update employee role
const updateEmployeeRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: chalk.blue.bold(
          "Please enter the first name of the employee you want update."
        ),
      },
      {
        type: "number",
        name: "role_id",
        message: chalk.blue.bold(
          "Please enter the new role number id associated with the employee you want to update."
        ),
      },
    ])
    .then((response) => {
      connection.query(
        "UPDATE employee SET role_id = ? WHERE first_name = ?",
        [response.role_id, response.first_name],
        function (err, data) {
          if (err) throw err;
          console.log(
            chalk.green.bold(
              "The new role entered has been added successfully."
            )
          );

          connection.query(`SELECT * FROM employee`, (err, result) => {
            if (err) {
              res.status(500).json({ error: err.message });
              startPrompt();
            }
            console.table(result);
            startPrompt();
          });
        }
      );
    });
};

// Update employee manager
const updateEmployeeManager = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: chalk.blue.bold(
          "Please enter the first name of the employee you want update"
        ),
      },
      {
        type: "number",
        name: "manager_id",
        message: chalk.blue.bold(
          "Please enter the new manager's id number associated with the employee you want to update."
        ),
      },
    ])
    .then((response) => {
      connection.query(
        "UPDATE employee SET manager_id = ? WHERE first_name = ?",
        [response.manager_id, response.first_name],
        function (err, data) {
          if (err) throw err;
          console.log(
            chalk.green.bold(
              "The new manager's id entered has been added successfully."
            )
          );
          connection.query(`SELECT * FROM employee`, (err, result) => {
            if (err) {
              res.status(500).json({ error: err.message });
              startPrompt();
            }
            console.table(result);
            startPrompt();
          });
        }
      );
    });
};

// view employees by manager
const viewEmpByManager = () => {
  console.log(
    chalk.greenBright.bold("------------------------------------------")
  );
  console.log(
    chalk.greenBright.bold("       Showing employees by Manager       ")
  );
  console.log(
    chalk.greenBright.bold("------------------------------------------")
  );
  const sql = `SELECT 
                CONCAT(manager.first_name, ' ' ,manager.last_name) AS manager,
                employee.id, 
                employee.first_name, 
                employee.last_name,  
                role.title AS Title,
                department.department_name, 
                role.salary
                FROM employee 
                JOIN role ON employee.role_id = role.id
                JOIN department ON role.department_id = department.id
                LEFT JOIN  employee AS manager ON employee.manager_id = manager.id
                ORDER BY manager`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    console.table(result);
    startPrompt();
  });
};

// view employees by department
const viewEmpByDepartment = () => {
  console.log(
    chalk.greenBright.bold("---------------------------------------------")
  );
  console.log(
    chalk.greenBright.bold("       Showing employees by Department       ")
  );
  console.log(
    chalk.greenBright.bold("---------------------------------------------")
  );
  const sql = `SELECT 
              employee.first_name, employee.last_name,
              department_name AS department
              FROM employee
              LEFT JOIN role ON employee.role_id = role.id
              LEFT JOIN department ON role.department_id = department.id`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    console.table(result);
    startPrompt();
  });
};

// function to delete department
const deleteDepartment = () => {
  const deptSql = `SELECT * FROM department`;

  connection.query(deptSql, (err, data) => {
    if (err) throw err;

    const dept = data.map(({ department_name, id }) => ({
      name: department_name,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "dept",
          message: chalk.blue.bold("What department do you want to delete?"),
          choices: dept,
        },
      ])
      .then((deptChoice) => {
        const dept = deptChoice.dept;
        const sql = `DELETE FROM department WHERE id = ?`;

        connection.query(sql, dept, (err, result) => {
          if (err) throw err;
          console.log(
            chalk.red.bold(
              "The selected department had been deleted successfully!"
            )
          );
          viewAllDepartments();
        });
      });
  });
};

// Delete role
const deleteRole = () => {
  const roleSql = `SELECT * FROM role`;
  connection.query(roleSql, (err, data) => {
    if (err) throw err;

    const role = data.map(({ title, id }) => ({ name: title, value: id }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "role",
          message: chalk.blue.bold("Please select a role you want to delete."),
          choices: role,
        },
      ])
      .then((rolechoice) => {
        const role = rolechoice.role;
        const sql = `DELETE FROM role WHERE id = ?`;

        connection.query(sql, role, (err, result) => {
          if (err) throw err;
          console.log(
            chalk.red.bold("The selected role has been deleted successfully.")
          );
          viewAllRoles();
        });
      });
  });
};

// Delete Employee
const deleteEmployee = () => {
  const employeeSql = `SELECT * FROM employee`;

  connection.query(employeeSql, (err, data) => {
    if (err) throw err;

    const employees = data.map(({ id, first_name, last_name }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "name",
          message: chalk.blue.bold(
            "Please select the employee you want to delete."
          ),
          choices: employees,
        },
      ])
      .then((empChoice) => {
        const employee = empChoice.name;

        const sql = `DELETE FROM employee WHERE id = ?`;

        connection.query(sql, employee, (err, result) => {
          if (err) throw err;
          console.log(
            chalk.red.bold(
              "The selected employee has been deleted successfully."
            )
          );
          viewAllEmployees();
        });
      });
  });
};

// view department budget
const viewDepBudget = () => {
  console.log(
    chalk.greenBright.bold("------------------------------------------")
  );
  console.log(
    chalk.greenBright.bold("       Showing budget by Department       ")
  );
  console.log(
    chalk.greenBright.bold("------------------------------------------")
  );

  connection.query(
    `SELECT department_id AS id, 
    department_name AS department,
    SUM(salary) AS budget
FROM role  
JOIN department ON role.department_id = department.id GROUP BY department_id`,
    (err, result) => {
      if (err) throw err;
      console.table(result);
      startPrompt();
    }
  );
};

// call to start
startPrompt();
