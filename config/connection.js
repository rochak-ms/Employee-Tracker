const mysql = require("mysql2");

// connect to database
const connection = mysql.createConnection(
  {
    host: "localhost",
    port: 3306,
    user: "sqluser",
    password: "root",
    database: "employeesDb",
  },
  console.log("Connected to the employeeTracker database.")
);

module.exports = connection;
