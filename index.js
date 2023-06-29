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
  connection.query(`select t1.id,t1.first_name,t1.last_name,t2.title as role,t2.salary,manager.first_name as manager,t3.name from employee as t1 JOIN role as t2 ON t2.id = t1.role_id JOIN department as t3 ON t3.id = t2.department_id  LEFT JOIN employee as manager ON manager.id = t1.manager_id`, function(err, tables){ 
    if(err){
      console.log(err)
    }
    console.table(tables);
    showChoice();
});
}

async function AddEmployee(){
  const {first_name}= await inquirer.prompt( {
    type: 'question',
    name: 'first_name',
  })
  const {last_name}= await inquirer.prompt( {
    type: 'question',
    name: 'last_name',
  })

  let all_employee=await new Promise((resolve,reject)=>{
    connection.query(`select * from employee`, function(err, tables){ 
      resolve(tables)
  });
  })

  let all_roles=await new Promise((resolve,reject)=>{
    connection.query(`select * from role`, function(err, tables){ 
      resolve(tables)
  });
  })

  all_roles=all_roles.map(({id,title})=>({name:title,value:id}))
  all_employee=all_employee.map(({id,first_name})=>({value:id,name:first_name}));
  all_employee.push({value:null,name:"None"})

  let {manager_id}=await inquirer
   .prompt([
    {
      type: 'list',
      name: 'manager_id',
      message: 'select manager for employee',
      choices: all_employee,
    },
  ])

  let {role_id}=await inquirer
   .prompt([
    {
      type: 'list',
      name: 'role_id',
      message: 'select role for employee',
      choices: all_roles,
    },
  ])

  connection.query(`insert into employee  (first_name,last_name,role_id,manager_id) values ('${first_name}','${last_name}',${role_id},${manager_id})`,function(err,tables){
    if(err){
      console.log(err)
    }
    showChoice()
  })
}


async function UpdateEmployee(){
    let all_employee=await new Promise((resolve,reject)=>{
      connection.query(`select * from employee`, function(err, tables){ 
        resolve(tables)
    });
    })
    let all_roles=await new Promise((resolve,reject)=>{
      connection.query(`select * from role`, function(err, tables){ 
        resolve(tables)
    });
    })

    all_roles=all_roles.map(({id,title})=>({name:title,value:id}))
    all_employee=all_employee.map(({id,first_name})=>({value:id,name:first_name}));
    let {employee_id}=await inquirer
     .prompt([
      {
        type: 'list',
        name: 'employee_id',
        message: 'select employee to update role',
        choices: all_employee,
      },
    ])
    let {role_id}=await inquirer
     .prompt([
      {
        type: 'list',
        name: 'role_id',
        message: 'select new role',
        choices: all_roles,
      },
    ])

    connection.query(`UPDATE employee SET role_id=${role_id} where id=${employee_id}`,function(err,table){
      if(err){
        console.log(err)
      }
      showChoice();
    })


    
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
  let all_department=await new Promise((resolve,reject)=>{
    connection.query(`select * from department`, function(err, tables){ 
      resolve(tables)
  });
  })

  all_department=all_department.map(({id,name})=>({name:name,value:id}))

  let {department_id}=await inquirer
  .prompt([
   {
     type: 'list',
     name: 'department_id',
     message: 'select department for role',
     choices: all_department,
   },
 ])

  connection.query(`insert into role (title,salary,department_id) values ('${title}',${salary},${department_id})`,function(err,tables){
    if(err){
      console.log(err)
    }
    showChoice()
  })
}

function ViewAllRoles(){
  connection.query(`select t1.id,t1.title,t1.salary,t2.name as department from role as t1 JOIN department as t2 ON t2.id = t1.department_id`, function(err, tables){ 
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
    }else if(answers.selectedOption===2){
       AddEmployee();
    }else if(answers.selectedOption===3){
      UpdateEmployee();
    }
    else if(answers.selectedOption===4){
      ViewAllRoles();
    }
    else if(answers.selectedOption===5){
      AddRoles();
    }
    else if(answers.selectedOption===6){
       ViewDeprtment();
    }
    else if(answers.selectedOption===7){
       AddDepartment();
    }

    console.log('Selected option:', answers.selectedOption);
  })
  .catch((error) => {
    console.log('Error occurred:', error);
  });
}

showChoice();