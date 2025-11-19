function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
function loadTasks() {
  return JSON.parse(localStorage.getItem('tasks') || "[]");
}

function showSnackbar(message) {
  var x = document.getElementById("snackbar");
  x.innerText = message;
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2500);
}

function updateList() {
  let tasks = loadTasks();
  let list = document.getElementById("list-container");
  list.innerHTML = "";
  let unfinished = 0;
  tasks.forEach((task, i) => {
    let li = document.createElement("li");
    li.textContent = task.text;
    if (task.done) li.classList.add("checked");
    else unfinished++;

    li.onclick = function() {
      tasks[i].done = !tasks[i].done;
      saveTasks(tasks);
      updateList();
    };

    li.ondblclick = function(e) {
      e.stopPropagation();
      let newText = prompt("Edit task:", task.text);
      if (newText !== null && newText.trim() !== "") {
        tasks[i].text = newText.trim();
        saveTasks(tasks);
        showSnackbar("Task edited!");
        updateList();
      }
    };

    let span = document.createElement("span");
    span.textContent = "×";
    span.className = "close";
    span.onclick = function(e) {
      e.stopPropagation();
      tasks.splice(i, 1);
      saveTasks(tasks);
      showSnackbar("Task deleted!");
      updateList();
    };
    li.appendChild(span);

    list.appendChild(li);
  });
  document.getElementById("empty-message").style.display = tasks.length ? "none" : "block";
  document.getElementById("task-counter").innerText =
    tasks.length ? (unfinished + " tasks left") : "";
}

function addTask() {
  let input = document.getElementById("input-box");
  let val = input.value.trim();
  if (val === "") {
    showSnackbar("Write something!");
    return;
  }
  let tasks = loadTasks();
  tasks.push({text: val, done: false});
  saveTasks(tasks);
  input.value = "";
  updateList();
  showSnackbar("Task added!");
}

var inputBox = document.getElementById("input-box");
if (inputBox) {
  inputBox.addEventListener("keypress", function(e) {
    if (e.key === "Enter") addTask();
  });
}

updateList();
