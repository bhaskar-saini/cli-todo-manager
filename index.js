const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer').default;
const chalk = require('chalk');
const tasksPath = path.join(__dirname, 'tasks.json');

//CRUD Operations

//Read Tasks
function readTasks(){
    try{
        const data = fs.readFileSync(tasksPath, 'utf-8');//read the file synchronously and utf tells to read file as text not binary
        return JSON.parse(data);//convert json into javascript array or object
    }
    catch (error){
        return [];
    }
}

//save tasks
function saveTasks(tasks){
    fs.writeFileSync(tasksPath, JSON.stringify(tasks, null, 2));
}

//add task
async function addTask(){
    const answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'task',
            message: 'Enter a new task:',
        },
    ]);
    const tasks = readTasks();
    tasks.push({
        id: Date.now().toString(),
        text: answer.task,
        completed: false
    });
    saveTasks(tasks);
    console.log(chalk.green('Task added!'));
}

//List Tasks - see all tasks with status
function listTasks(){
    const tasks = readTasks();
    if(tasks.length == 0){
        console.log(chalk.yellow('No task found!'));
    }
    else{
        tasks.forEach((task,index)=>{
            const status = task.completed ? chalk.green('✓') : chalk.red('✗');
            console.log(`${index+1}. [${status}] ${task.text}`);
        });
    }
}
//complete task
async function completeTask(){
    const tasks = readTasks();
    const choices = tasks.map((task)=>({
        name: task.text,
        value: task.id,
    }));
    const answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'taskId',
            message: 'select a taskId to mark as complete:',
            choices,
        },
    ]);
    const task = tasks.find((t) => t.id === answer.taskId);
    task.completed = true;
    saveTasks(tasks);
    console.log(chalk.green('Task mark complete!'));
}

//Delete task
async function deleteTask(){
    const tasks = readTasks();
    const choices = tasks.map((task)=>({
        name: task.text,
        value: task.id,
    }));
    const answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'taskId',
            message: 'Select a task to delete:',
            choices,
        },
    ]);
    const filteredTasks = tasks.filter((t)=> t.id !== answer.taskId);
    saveTasks(filteredTasks);
    console.log(chalk.green('Task Deleted!'));
}

//Main Menu
async function mainMenu(){
    const answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'what would you like to do?',
            choices:[
                'Add Task',
                'List Tasks',
                'Complete Task',
                'Delete Task',
                'Exit',
            ],
        },
    ]);

    switch (answer.action){
        case 'Add Task':
            await addTask();
            break;
        case 'List Tasks':
            listTasks();
            break;
        case 'Complete Task':
            await completeTask();
            break;
        case 'Delete Task':
            await deleteTask();
            break;
        case 'Exit':
            console.log(chalk.blue('GoodBye!'));
            process.exit();
    }
    mainMenu();
}

console.log(chalk.cyan.bold('Welcome to CLI Todo Manager!'));
mainMenu();