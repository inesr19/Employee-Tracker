const mysql = require('mysql');
const inquirer = require('inquirer');
const { printTable } = require('console-table-printer');

const connection = mysql.createConnection({
    host: 'localhost',

    port: 3306,

    user: 'root',

    password: '',
    database: 'employee_trackerDB',
});

connection.connect((err) => {
    if(err) throw err;
    askQuestion();
});

const askQuestion = () => {
    inquirer
      .prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
          'Add a department',
          'Add a role',
          'Add an employee',
          'View departments',
          'View roles',
          'View employees',
          'Update employee role',
          'Exit',
        ],
      })
      .then((answer) => {
        switch (answer.action) {
          case 'Add a department':
            addDepartment();
            break;
  
          case 'Add a role':
            addRole();
            break;
  
          case 'Add an employee':
            addEmployee();
            break;
                    
          case 'View departments':
            viewDepartment();
            break;
  
          case 'View roles':
            viewRole();
            break;
  
          case 'View employees':
            viewEmployee();
            break;
  
          case 'Update employee role':
            updateEmployee();
            break;
  
          case 'Exit':
            connection.end();
            break;
  
        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
       }
      });
  };

  const addDepartment = () => {
    inquirer
      .prompt({
        name: 'department',
        type: 'input',
        message: 'What is the name of the department?',
      })
      .then((answer) => {
        const query = 'INSERT INTO departments (name) VALUES ( ? )';
        connection.query(query, answer.department, function(err, res) {
        })
        viewDepartment();
      });
  };

  const viewDepartment = () => {
    const query = 'SELECT * FROM departments';
      connection.query(query, function(err, res){
        res.forEach(departments => {
          `${departments.id}, ${departments.name}`;
        })
        printTable(res);
        askQuestion();
      });
  };

  const viewRole = () => {
    const query = 'SELECT * FROM roles';
    connection.query(query, function(err, res){
      res.forEach(roles => {
        `${roles.id}, ${roles.title}, ${roles.salary}, ${roles.department_id}`;
      })
      printTable(res);
      askQuestion();
    });
  };

  const viewEmployee = () => {
    const query = 'SELECT * FROM employees';
    connection.query(query, function(err, res){
      res.forEach(employees => {
        `${employees.id}, ${employees.first_name}, ${employees.last_name}, ${employees.role_id}, ${employees.manager_id}`;
      })
      printTable(res);
      askQuestion();
    });
  };

  const addRole = () => {
    const query = `SELECT * FROM departments`;
  
    connection.query(query, function (err, res){
      if(err) throw err;
      const departmentChoices = res.map(({ id, name }) => ({
        value: id,
        name: `${id} ${name}`
      }));
  
    inquirer
      .prompt([{
        name: 'title',
        type: 'input',
        message: 'What is the title of the role?',
      },
      {
        name: 'salary',
        type: 'input',
        message: 'What is the salary of this role?'
      },
      {
        name: 'department_id',
        type: 'list',
        message: 'What department is this role in?',
        choices: departmentChoices
      },
      ])
      .then((answer) => {
         connection.query(`INSERT INTO roles (title, salary, department_id) VALUES ("${answer.title}", ${answer.salary}, ${answer.department_id})`, (err, res) => {
            if (err) throw err;
  
            
            viewRole();
            askQuestion();
         })
       })
      })
      };