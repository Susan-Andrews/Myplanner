// Dark theme toggle
var icon = document.getElementById('icon');
icon.onclick = function () {
    document.body.classList.toggle("dark-theme");
    icon.src = document.body.classList.contains("dark-theme") ? "src/sunn.png" : "src/moon.png";
}

// On app load, retrieve tasks from local storage
window.onload = loadTasks();

// Get references to form elements
var taskForm = document.getElementById("task-form");
var taskInput = document.getElementById("title");

// Add event listener for form submission
taskForm.addEventListener("submit", function (e) {
    e.preventDefault();
    addTask();
});

// Load tasks from local storage and populate the list
function loadTasks() {
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    var list = document.getElementById("task-list");
    var noTasksMessage = document.getElementById("no-tasks-message");

    if (tasks.length === 0) {
        // Display a message when there are no tasks
        noTasksMessage.textContent = "No tasks found. Add tasks using the form above.";
    } else {
        // Hide the message when tasks are present
        noTasksMessage.textContent = "";
    }

    list.innerHTML = ""; // Clear the existing task list

    tasks.forEach(function (task) {
        var listItem = createTaskListItem(task.task, task.completed);
        list.appendChild(listItem);
    });
}

// Create a new task list item
function createTaskListItem(taskText, completed) {
    var listItem = document.createElement("li");
    listItem.className = "list-group-item";

    var taskDiv = document.createElement("div");
    taskDiv.className = "d-flex justify-content-between align-items-center";

    var taskCheckbox = document.createElement("input");
    taskCheckbox.type = "checkbox";
    taskCheckbox.className = "form-check-input";
    taskCheckbox.checked = completed;
    taskCheckbox.addEventListener("change", function () {
        taskComplete(this);
    });

    var taskLabel = document.createElement("label");
    taskLabel.className = "form-check-label";
    taskLabel.contentEditable = true;
    taskLabel.textContent = taskText;
    taskLabel.addEventListener("blur", function () {
        editTask(this);
    });

    var deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "btn btn-danger btn-sm";
    deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
    deleteButton.addEventListener("click", function () {
        removeTask(this);
    });

    taskDiv.appendChild(taskCheckbox);
    taskDiv.appendChild(taskLabel);
    taskDiv.appendChild(deleteButton);

    listItem.appendChild(taskDiv);

    return listItem;
}

// Mark a task as complete
function taskComplete(checkbox) {
    var listItem = checkbox.closest("li");
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach(function (task) {
        if (task.task === listItem.querySelector("label").textContent) {
            task.completed = checkbox.checked;
        }
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
    listItem.classList.toggle("completed", checkbox.checked);
}

// Function to delete a task
function removeTask(button) {
    var listItem = button.closest("li");
    var taskText = listItem.querySelector("label").textContent;
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks = tasks.filter(function (task) {
        return task.task !== taskText;
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
    listItem.remove();

    // Update the message display
    loadTasks();
}

// Edit a task
function editTask(label) {
    var listItem = label.closest("li");
    var taskText = label.textContent.trim();
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    if (taskText === "") {
        alert("Task is empty!");
        label.textContent = currentTask;
        return;
    }

    // Check for duplicate task
    var isDuplicate = tasks.some(function (task) {
        return task.task === taskText;
    });

    if (isDuplicate) {
        alert("Task already exists!");
        label.textContent = currentTask;
        return;
    }

    tasks.forEach(function (task) {
        if (task.task === currentTask) {
            task.task = taskText;
        }
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to delete all tasks
document.getElementById("delete-all").addEventListener("click", function () {
    var taskList = document.getElementById("task-list");
    taskList.innerHTML = ""; // Clear the task list

    localStorage.removeItem("tasks"); // Remove all tasks from local storage
    loadTasks();
});

// Initialize the current task variable
var currentTask = null;

// Function to get the current task being edited
function getcurrenttask(input) {
    currentTask = input.textContent.trim();
}

// Function to add a new task
function addTask() {
    let taskInput = document.getElementById("title");
    let taskText = taskInput.value.trim();
    let taskList = document.getElementById("task-list");

    if (taskText === "") {
        alert("Please add a task!");
        return;
    }

    // Check for duplicate task
    if (isTaskDuplicate(taskText)) {
        alert("Task already exists!");
        return;
    }

    // Create a new task list item
    let listItem = createTaskListItem(taskText, false);
    taskList.appendChild(listItem);

    // Clear the input field
    taskInput.value = "";

    // Save the updated tasks to local storage
    saveTasksToLocalStorage();

    // Update the message display
    loadTasks();
}

// Function to check if a task is a duplicate
function isTaskDuplicate(taskText) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    return tasks.some(function (task) {
        return task.task === taskText;
    });
}

// Function to save tasks to local storage
function saveTasksToLocalStorage() {
    let tasks = [];
    let taskList = document.getElementById("task-list");

    taskList.querySelectorAll(".list-group-item").forEach(function (item) {
        let taskText = item.querySelector("label").textContent;
        let completed = item.querySelector("input[type='checkbox']").checked;

        tasks.push({ task: taskText, completed: completed });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}
