INSERT INTO
    department (department_name)
VALUES ('IT'), ('Marketing & Sales'), ('Finance'), ('Operations'), ('HR');

INSERT INTO
    role (title, salary, department_id)
VALUES (
        'Full Stack Developer',
        105000,
        1
    ), ('Software Engineer', 110000, 1), ('Sales Lead', 85000, 2), ('Accountant', 95000, 3), ('Project Manager', 115000, 4), ('Operation Manager', 115000, 4);

INSERT INTO
    employee (
        first_name,
        last_name,
        role_id,
        manager_id
    )
VALUES ('Kate', 'Lee', 1, 1), ('John', 'Morgan', 1, 2), ('Tom', 'Hardy', 2, 2), ('Jimmy', 'Logan', 3, 1), ('Courtney', 'Woolf', 4, 3), ('Emelie', 'Hudson', 4, 4);