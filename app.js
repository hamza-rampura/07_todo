//Select DOM
const todoInput = document.querySelector(".todo-input");
const todoDate = document.querySelector(".todo-input-date");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-container");

//Event Listeners
document.addEventListener("DOMContentLoaded", getTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteTodo);

//Functions

function sortByDate (a,b) {
    // console.log("test");
    // console.log(new Date(a.date).getTime(), new Date(b.date).getTime())
    return new Date(a.date).getTime() - new Date(b.date).getTime();
}

function addTodo(e) {
  //Prevent natural behaviour
  e.preventDefault();
    if(todoInput.value == "" || todoDate.value == "") {
        alert("Please fill all the fields");
    } 
    else {    
        // Generate unique ID    
        let unique = new Date().getTime();        
        // Create todo Obj 
        let newTodoObj = {
                uid: unique,
                text: todoInput.value,
                date: todoDate.value
        }
        //Create todo div
        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo");
        todoDiv.setAttribute("id", newTodoObj.uid)
        //Create list
        const newTodo = document.createElement("div");
        newTodo.innerText = todoInput.value;
        //Save to local
        saveLocalTodos(newTodoObj);
        //
        newTodo.classList.add("todo-item");
        todoDiv.appendChild(newTodo);
        todoInput.value = "";
        //Create Completed Button
        const completedButton = document.createElement("button");
        completedButton.innerHTML = `<i class="fas fa-check"></i>`;
        completedButton.classList.add("complete-btn");
        todoDiv.appendChild(completedButton);
        //Create trash button
        const trashButton = document.createElement("button");
        trashButton.innerHTML = `<i class="fas fa-trash"></i>`;
        trashButton.classList.add("trash-btn");
        // trashButton.setAttribute('id',newTodoObj.uid)
        todoDiv.appendChild(trashButton);
        //Create Date Text 
        const newTodoDate = document.createElement("div");
        newTodoDate.classList.add("todo-date");
        newTodoDate.innerText = todoDate.value;
        todoDate.value = "";
        todoDiv.appendChild(newTodoDate);
        //attach final Todo
        todoList.insertBefore(todoDiv, todoList.firstChild);
    }
}

function updateTextTodo(target, value) {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.forEach((ele) => {
        if(ele["uid"] == target) {
            ele["text"] = value;
        }
    })
    todos.sort(sortByDate);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function deleteTodo(e) {
    const item = e.target;
    if (item.classList[0] === "trash-btn") {
        //at the end
        removeLocalTodos(item.parentElement.id);
        item.parentElement.remove();
    }
    else if (item.classList[0] === "complete-btn") {
        const todo = item.parentElement;
        todo.classList.toggle("completed");
        console.log(todo.parentElement.appendChild(todo))
    } 
    else if (item.classList[0] === "todo-item") {
        let html = `<textarea class="editable-div">${item.innerText}</textarea>`;
        item.innerHTML = html;
        // listen for blur on textarea
        let textarea = document.querySelector(".editable-div");
        textarea.focus(); //custom focus method run to avoid glitches, however this leads to teh cursor at the begining
        textarea.addEventListener('blur', () => {
            if(textarea.value == "") {
                alert("Cant leave blank, please add some text");
            } else {
                item.innerHTML = textarea.value;
                updateTextTodo(item.parentElement.id, textarea.value);
            }
        });
    }   
}

function saveLocalTodos(todo) {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.push(todo);
    todos.sort(sortByDate);
    localStorage.setItem("todos", JSON.stringify(todos));
}


function removeLocalTodos(toDeleteIndex) {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.forEach((ele,index) => {
        if(ele["uid"] == toDeleteIndex) {
            toDeleteIndex = index;
        }
    })
    todos.splice(toDeleteIndex, 1);
    todos.sort(sortByDate);
    localStorage.setItem("todos", JSON.stringify(todos));
}



function getTodos() {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.forEach(function(todo) {
        //Create todo div
        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo");
        todoDiv.setAttribute("id", todo["uid"])
        //Create list
        const newTodo = document.createElement("div");
        newTodo.innerText = todo["text"];
        newTodo.classList.add("todo-item");
        todoDiv.appendChild(newTodo);
        //Create Completed Button
        const completedButton = document.createElement("button");
        completedButton.innerHTML = `<i class="fas fa-check"></i>`;
        completedButton.classList.add("complete-btn");
        todoDiv.appendChild(completedButton);
        //Create trash button
        const trashButton = document.createElement("button");
        trashButton.innerHTML = `<i class="fas fa-trash"></i>`;
        trashButton.classList.add("trash-btn");
        todoDiv.appendChild(trashButton);
        //Create Date Text 
        const newTodoDate = document.createElement("div");
        newTodoDate.classList.add("todo-date");
        newTodoDate.innerText = todo["date"];
        todoDiv.appendChild(newTodoDate);
        //attach final Todo        
        todoList.appendChild(todoDiv);
    });
}
