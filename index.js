// get the client
const mysql = require('mysql2');
const inquirer = require('inquirer');
require('dotenv').config();

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password:process.env.password, 
  database: 'ORGANIZATION'
});



function ViewAllEmployee(){
  connection.query(`select * from employee`, function(err, tables){ 
    console.table(tables);
    showChoice();
});
}


async function AddRoles(){
  const {title}= await inquirer.prompt( {
    type: 'question',
    name: 'title',
  })
  const {salary}= await inquirer.prompt( {
    type: 'question',
    name: 'salary',
  })
  const {department_id}= await inquirer.prompt( {
    type: 'question',
    name: 'department_id',
  })
  connection.query(`insert into role (title,salary,department_id) values ('${title}',${salary},${department_id})`,function(err,tables){
    if(err){
      console.log(err)
    }
    showChoice()
  })
}

function ViewAllRoles(){
  connection.query(`select * from role`, function(err, tables){ 
    console.table(tables);
    showChoice();
  })
}


function AddDepartment(){
  inquirer.prompt( {
    type: 'question',
    name: 'name',

  })
  .then(({name})=>{
    connection.query(`insert into department (name) values ('${name}')`,function(err,tables){
      if(err){
        console.log(err)
      }
      showChoice()
    })
  })
  .catch(err=>console.log(err))
}


function ViewDeprtment(){
    connection.query(`select * from department`, function(err, tables){ 
    console.table(tables);
    showChoice();
});
}



function showChoice(){
  const choices = [
    { value: 1, name: 'View All Employees' },
    { value: 2, name: 'Add Employee' },
    { value: 3, name: 'Update Employee Role' },
    { value: 4, name: 'View all Roles' },
    { value: 5, name: 'Add Role' },
    { value: 6, name: 'View All Department' },
    { value: 7, name: 'Add Department' },
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
    if(answers.selectedOption===1){
       ViewAllEmployee();
    }else if(answers.selectedOption===6){
    ViewDeprtment();
   }else if(answers.selectedOption===7){
    AddDepartment();
 }
  else if(answers.selectedOption===5){
    AddRoles();
 }
  else if(answers.selectedOption===4){
    ViewAllRoles();
 }
    console.log('Selected option:', answers.selectedOption);
  })
  .catch((error) => {
    console.log('Error occurred:', error);
  });
}

showChoice();