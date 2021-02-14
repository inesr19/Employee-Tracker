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