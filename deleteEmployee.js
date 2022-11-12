const connection = require("./config/connection");
const inquirer = require("inquirer");
const chalk = require("chalk");
const { startPrompt } = require("./server");

// Delete Employee
function deleteEmployee() {
  inquirer
    .prompt([
      {
        type: "number",
        name: "employee_id",
        message: chalk.blue.bold(
          "Please enter the id of the employee you want to delete."
        ),
      },
    ])
    .then(function (response) {
      connection.query(
        "DELETE FROM employee WHERE id = ?",
        [response.employee_id],
        function (err, data) {
          if (err) throw err;
          console.log(
            chalk.red.bold(
              "The employee entered has been deleted successfully."
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
}
exports.deleteEmployee = deleteEmployee;
