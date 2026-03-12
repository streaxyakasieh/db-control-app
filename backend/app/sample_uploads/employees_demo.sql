DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS departments;

CREATE TABLE departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

CREATE TABLE employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    position TEXT NOT NULL,
    department_id INTEGER,
    salary INTEGER,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

INSERT INTO departments (name) VALUES
('IT'),
('Finance'),
('HR');

INSERT INTO employees (full_name, position, department_id, salary) VALUES
('Иван Петров', 'Backend Developer', 1, 160000),
('Анна Соколова', 'Accountant', 2, 120000),
('Мария Орлова', 'HR Manager', 3, 110000);