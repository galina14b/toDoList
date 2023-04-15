"use strict";

// Variables
const STORAGE_KEY = "tasks";

// DOM variables
const form = document.querySelector(".create-task-form");
const taskInput = document.querySelector(".task-input");
const filterInput = document.querySelector(".filter-input");
const taskList = document.querySelector(".collection");
const clearButton = document.querySelector(".clear-tasks");


// "storage" functions
const getTasksFromLocalStorage = () => {
  const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  return tasks;
};

const storeTaskInLocalStorage = (task) => {
  const tasks = getTasksFromLocalStorage();
  tasks.push(task);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const removeTaskFromLocalStorage = (deletedTask) => {
  const tasks = getTasksFromLocalStorage();
  // other variant .filter
  const deletedIndex = tasks.findIndex((task) => task.id === deletedTask);
  tasks.splice(deletedIndex, 1);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const clearTasksFromLocalStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
};

const changeTaskInLocalStorage = (task, editedTask) => {
  const tasks = getTasksFromLocalStorage();

  const edit = tasks.find((task) => task.id === editedTask);
  edit.value = task.value;
  console.log(edit, tasks);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// "tasks" functions
const getTasks = () => {
  const tasks = getTasksFromLocalStorage();

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "collection-item";
    li.textContent = task.value;
    li.dataset.id = task.id;

    const taskText = document.createElement("span");
    taskText.className = "delete-item";
    taskText.innerHTML = '<i class="fa fa-remove"></i><i class="fa fa-edit"></i>';
    li.append(taskText);

    // Append li to ul
    taskList.append(li);
  });
};

const addTask = (event) => {
  event.preventDefault();

  // Пусте значення або пробіли
  if (taskInput.value.trim() === "") {
    return;
  }

  // Create and add LI element
  const li = document.createElement("li");
  li.className = "collection-item";
  li.textContent = taskInput.value; // значення яке ввів користувач
  li.dataset.id = Math.random();

  const taskText = document.createElement("span");
  taskText.className = "delete-item";
  taskText.innerHTML = '<i class="fa fa-remove"></i><i class="fa fa-edit"></i>';
  li.append(taskText);

  taskList.append(li);

  // Save to storage
  let taskToStorage = {id: li.dataset.id, value: taskInput.value}
  storeTaskInLocalStorage(taskToStorage);

  // Clear input value
  taskInput.value = "";
};

const removeTask = (event) => {
  const isDeleteIcon = event.target.classList.contains("fa-remove");

  if (isDeleteIcon) {
    const isApproved = confirm("Ви впевнені що хочете видалити це завдання?");

    if (isApproved) {
      // remove from DOM
      // console.log(event.target.parentElement.parentElement);
      const deletedLi = event.target.closest("li");
      deletedLi.remove();

      removeTaskFromLocalStorage(deletedLi.dataset.id);
    }
  }
};

const clearTasks = () => {
  taskList.innerHTML = "";
  clearTasksFromLocalStorage();
};

const filterTasks = (event) => {
  const text = event.target.value.toLowerCase();
  const list = document.querySelectorAll(".collection-item");

  list.forEach((task) => {
    const item = task.firstChild.textContent.toLowerCase();

    if (item.includes(text)) {
      // task.style.display = "block"; // task.hidden = true
      task.style.display = "list-item";
    } else {
      task.style.display = "none";
    }
  });
};

const editTask = (event) => {
  let text = prompt('');
  const isEditIcon = event.target.classList.contains("fa-edit");

  if (!text) {
    return
  }

  if (isEditIcon) {
    const editedLi = event.target.closest("li");
    const taskText = document.createElement("span");
    taskText.className = "delete-item";
    taskText.innerHTML = '<i class="fa fa-remove"></i><i class="fa fa-edit"></i>';
    editedLi.textContent = text;
    editedLi.append(taskText);


    let taskToStorage = { id: editedLi.dataset.id, value: text };
    changeTaskInLocalStorage(taskToStorage, editedLi.dataset.id)
  }
}

// init
getTasks();

// Event listeners

// document.addEventListener("DOMContentLoaded", () => {
//   getTasks();
// });

form.addEventListener("submit", addTask);

taskList.addEventListener("click", removeTask);

clearButton.addEventListener("click", clearTasks);

filterInput.addEventListener("input", filterTasks);

taskList.addEventListener('click', editTask);

