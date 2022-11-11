DROP DATABASE IF EXISTS employee_tracker;

CREATE DATABASE employee_tracker;

USE employee_tracker;

CREATE TABLE
    department (
        id INTEGER AUTO_INCREMENT PRIMARY KEY,
        department_name VARCHAR(30) NOT NULL,
    );

CREATE TABLE
    role(
        id INTEGER AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(30) NOT NULL,
        salary DECIMAL NOT NULL,
        department_id INTEGER NOT NULL,
        CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
    );

CREATE TABLE
    emoloyee (
        id INTEGER AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(30) NOT NULL,
        last_name VARCHAR(30) NOT NULL,
        role_id INTEGER NOT NULL,
        CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE
        SET
            NULL,
            manager_id INTEGER NOT NULL,
            CONSTRAINT fk_empoyee FOREIGN KEY (manager_id) REFERENCES employee(id)
    );