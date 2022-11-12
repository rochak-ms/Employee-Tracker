const connection = require("./config/connection");
const inquirer = require("inquirer");
const chalk = require("chalk");
const { viewAllRoles } = require("./server");

// Delete role
function deleteRole() {
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
}
exports.deleteRole = deleteRole;
