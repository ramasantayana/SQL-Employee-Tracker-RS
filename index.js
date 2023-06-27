// get the client
const mysql = require('mysql2');
require('dotenv').config();

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password:process.env.password, 
  database: 'ORGANIZATION'
});

const inquirer = require('inquirer');

const choices = [
  { value: '1', name: 'View All Employees' },
  { value: '2', name: 'Add Employee' },
  { value: '3', name: 'Update Employee Role' },
  { value: '4', name: 'View all Roles' },
  { value: '5', name: 'Add Role' },
  { value: '6', name: 'View All Department' },
  { value: '7', name: 'Add Department' },
];

inquirer
  .prompt([
    {
      type: 'list',
      name: 'selectedOption',
      message: 'Select an option:',
      choices: choices,
    },
  ])
  .then((answers) => {
    console.log('Selected option:', answers.selectedOption);
  })
  .catch((error) => {
    console.log('Error occurred:', error);
  });