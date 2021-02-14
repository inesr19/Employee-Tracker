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