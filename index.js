// Add required npm packages
const mysql = require('mysql');
const inquirer = require('inquirer');
const { printTable } = require('console-table-printer');

// Create connection to workbench
const connection = mysql.createConnection({
    host: 'localhost',

    port: 3306,

    user: 'root',

    password: '',
    database: 'employee_trackerDB',
});

// Connection with inquirer
connection.connect((err) => {
    if(err) throw err;
    askQuestion();
});

// Prompts for options of what user can do with the database
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

// Add new department to database
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

// Views list of added departments and prints table
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

// Views added roles and prints a table in terminal
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

// Views existing employees in a table
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

// Adds new roles with prompted questions and generates table. (map to call on previous function)
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

// Adds new employees with prompted questions and generates table to view all employees. (map to call on previous functions).
      const addEmployee = () => {
        const query = `SELECT * FROM roles`;
        
        connection.query(query, function (err, res) {
          if(err) throw err;
          const roleChoices = res.map(({ id, title }) => ({
            value: id,
            name: `${id} ${title}`
          }));
  
          const managerQuery = `SELECT * FROM employees`;
  
          connection.query(managerQuery, function (err, res) {
            if(err) throw err;
            const managerChoices = res.map(({ id, first_name, last_name }) => ({
              value: id,
              name: `${id} ${first_name} ${last_name}`
            }));
        
        inquirer
          .prompt([{
            name: 'first_name',
            type: 'input',
            message: 'What is the first name of the employee?',
          },
          {
            name: 'last_name',
            type: 'input',
            message: 'What is the last name of the employee?'
          },
          {
            name: 'role_id',
            type: 'list',
            message: 'What is the role of the employee?',
            choices: roleChoices
          },
          {
            name: 'manager_id',
            type: 'list',
            message: 'Who is the manager?',
            choices: managerChoices
          },
          ])
          .then((answer) => {
             connection.query(`INSERT INTO employees (first_name, last_name, role_id,  manager_id) VALUES ("${answer.first_name}", "${answer.last_name}", ${answer.role_id}, ${answer.manager_id})`, (err, res) => {
                if (err) throw err;
      
                
                viewEmployee();
                askQuestion();
             })
           })
          })
          })
          };

// Update employee roles 
const updateEmployee = () => {
  
    const query = `SELECT * FROM employees`;
  
    connection.query(query, function (err, res) {
      if(err) throw err;
      const employeeChoices = res.map(({ id, first_name, last_name }) => ({
        value: id,
        name: `${id} ${first_name} ${last_name}`
      }));
  
    inquirer
      .prompt([{
        name: 'updateOption',
        type: 'list',
        message: 'What employee would you like to update?',
        choices: employeeChoices
      },
      {
        name: 'update',
        type: 'list',
        message: 'What would like to change?',
        choices: [`${first_name}, ${last_name}, ${role_id}, ${manager_id}`]
      },
    ])
    .then((answer) => {
      connection.query(`UPDATE employeees SET (??) = (?) WHERE (??) = (?)`)
    })
    })
  
  }