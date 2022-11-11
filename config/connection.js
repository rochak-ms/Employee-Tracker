const mysql = require("mysql2");

// connect to database
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "sqluser",
  password: "root",
  database: "employee_tracker",
});

module.exports = connection;
