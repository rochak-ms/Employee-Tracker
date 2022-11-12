const mysql = require("mysql2");
// importing chalk
const chalk = require("chalk");
// importing figlet
const figlet = require("figlet");

// connect to database
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "sqluser",
  password: "root",
  database: "employeesDb",
});
console.log(
  chalk.green.bold(
    ".-----------------------------------------------------------------------------------------------."
  )
);
console.log(
  chalk.green.bold(
    "|                                                                                               |"
  )
);
console.log(
  chalk.green.bold(
    "|                                                                                               |"
  )
);
console.log(chalk.red(figlet.textSync(" EMPLOYEE TRACKER ")));
console.log(
  chalk.green.bold(
    "|                                                                                               |"
  )
);
console.log(
  chalk.green.bold(
    "|                                                                                               |"
  )
);
console.log(
  chalk.green.bold(
    "'-----------------------------------------------------------------------------------------------'"
  )
);

module.exports = connection;
