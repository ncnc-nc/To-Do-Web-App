document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
  let taskInput = document.getElementById("taskInput");
  let taskDateTime = document.getElementById("taskDateTime");
  let taskText = taskInput.value.trim();
  let taskTime = taskDateTime.value;

  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  let task = { text: taskText, time: taskTime, completed: false };
  saveTask(task);

  renderTasks();

  taskInput.value = "";
  taskDateTime.value = "";
}

function completeTask(index) {
  let tasks = getTasks();
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function editTask(index) {
  let tasks = getTasks();
  let newText = prompt("Edit your task:", tasks[index].text);
  if (newText !== null && newText.trim() !== "") {
    tasks[index].text = newText;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
  }
}

function deleteTask(index) {
  let tasks = getTasks();
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function searchTasks() {
  let query = document.getElementById("searchTask").value.toLowerCase();
  let tasks = document.querySelectorAll("li span");
  tasks.forEach(task => {
    task.parentElement.style.display = task.innerText.toLowerCase().includes(query) ? "flex" : "none";
  });
}

function filterTasks() {
  let filter = document.getElementById("filterTask").value;
  let tasks = getTasks();

  if (filter === "completed") {
    renderTasks(tasks.filter(t => t.completed));
  } else if (filter === "pending") {
    renderTasks(tasks.filter(t => !t.completed));
  } else {
    renderTasks(tasks);
  }
}

/* LocalStorage Functions */
function saveTask(task) {
  let tasks = getTasks();
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function loadTasks() {
  renderTasks();
}

/* Render */
function renderTasks(filteredTasks = null) {
  let taskList = document.getElementById("taskList");
  let completedList = document.getElementById("completedList");
  taskList.innerHTML = "";
  completedList.innerHTML = "";

  let tasks = filteredTasks || getTasks();

  tasks.forEach((task, index) => {
    let li = document.createElement("li");
    li.className = task.completed ? "completed" : "";
    li.innerHTML = `
      <span>${task.text} <small>${task.time ? "(" + task.time + ")" : ""}</small></span>
      <div class="actions">
        <button class="complete" onclick="completeTask(${index})">✔</button>
        <button class="edit" onclick="editTask(${index})">✏</button>
        <button class="delete" onclick="deleteTask(${index})">🗑</button>
      </div>
    `;
    if (task.completed) {
      completedList.appendChild(li);
    } else {
      taskList.appendChild(li);
    }
  });
}
