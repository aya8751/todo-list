const inpTask = document.querySelector('.new-task');
const taskBox = document.querySelector('.task-box');
const clearBtn = document.querySelector('.clear-btn');
const filterItems = document.querySelectorAll('.filter li');

// use JSON.parse to convert the result from a string to an object
let todoList = JSON.parse(localStorage.getItem('todo-list'));

function updateDom(filterItem){
    let listItem = "";
    if(todoList){
        todoList.forEach((task, index) => {
            const checked = task.status ==="completed" ? "checked" : "";
            if(filterItem == task.status || filterItem == "all"){
                listItem += `
                <li class="task">
                    <label for="${index}">
                        <input id="${index}" type="checkbox" ${checked} onclick="changeStatus(this)">
                        <p class="${checked}">${task.name}</p>
                    </label>
                    <div class="setting">
                        <i class="uil uil-ellipsis-h" onclick="showMenu(this)"></i>
                        <ul class="task-menu">
                            <li class="edit" onclick="editTask(${index}, '${task.name}')">
                                <i class="uil uil-pen"></i>
                                Edit
                            </li>
                            <li class="delete" onclick="deleteTask(${index})" >
                                <i class="uil uil-trash-alt"></i>
                                Delete
                            </li>
                        </ul>
                    </div>
                </li>`
            }
        });
    }
    taskBox.innerHTML = '' ;
    // no task to display
    taskBox.insertAdjacentHTML('afterbegin', listItem || `<p class='empty'>You don't have any task here</p>`);
}
updateDom("all");

function changeStatus(selectedTask){
    const p = selectedTask.parentElement.querySelector('p');
    const taskId = selectedTask.id;

    selectedTask.checked ? p.classList.add("checked") : p.classList.remove("checked");

    todoList[taskId].status = selectedTask.checked ? "completed" : "pending";

    // update local storage
    localStorage.setItem('todo-list', JSON.stringify(todoList));
}

// handel showing and hideing edit and delete menu
function showMenu(selectedTask){
    const taskMenu = selectedTask.parentElement.querySelector('.task-menu');
    taskMenu.classList.add('show');

    // clicking any where else make menu disapear
    document.addEventListener('click', e =>{
        if(e.target != selectedTask && e.target.tagName != "I"){
            taskMenu.classList.remove('show');
        }
    })
    
}

let editingCase = false;
let editTaskId;

function creatNewTask(e){
    const newTask = e.target.value.trim();
    if(newTask && e.key === "Enter"){
        if(!editingCase){
            // to prevent pushing to null
            if(!todoList){
                todoList = [];
            }

            const taskObj = {
                name: newTask,
                status:"pending"
            }
            todoList.push(taskObj);
        } else{
            editingCase = false;
            todoList[editTaskId].name = newTask;
        }
        
        // JSON.stringify() convert an array or an object into a string
        localStorage.setItem('todo-list', JSON.stringify(todoList));
        inpTask.value = "";
        updateDom("all");
    }
}

function deleteTask(taskId){
    todoList.splice(taskId, 1);
    localStorage.setItem('todo-list', JSON.stringify(todoList));
    updateDom("all");
}

function editTask(taskId, task){
    inpTask.value = task;
    editTaskId = taskId;
    editingCase = true;
}

// clear todoList and updating dom
function clearTodo(){
    todoList.splice(0, todoList.length);
    localStorage.setItem('todo-list', JSON.stringify(todoList));
    updateDom("all");
}

// event delegation
filterItems.forEach((btn) => {
    btn.addEventListener('click', function(){
        let activeBtn = document.querySelector('.active');
        activeBtn.classList.remove('active');
        btn.classList.add('active');
        updateDom(btn.id);
    })
})

// event handler
inpTask.addEventListener('keyup', (event) => creatNewTask(event))
clearBtn.addEventListener('click', clearTodo);
