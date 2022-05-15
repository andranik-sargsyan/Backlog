let backlogTemplate = {
    "to-do": [],
    "in-progress": [],
    "done": []
};
let currentTaskID = 1;
let priorities = {
    0: "white",
    1: "yellow",
    2: "orange",
    3: "red"
};
let elementToEdit;

let txtName = document.getElementById("txt-name");
let txtDescription = document.getElementById("txt-description");
let ddlPriority = document.getElementById("ddl-priority");
let btnAdd = document.getElementById("btn-add");
let btnSave = document.getElementById("btn-save");
let btnCancel = document.getElementById("btn-cancel");
let divBacklog = document.getElementById("backlog");

ddlPriority.addEventListener("change", () => {
    ddlPriority.style.backgroundColor = priorities[ddlPriority.selectedIndex];
});

btnAdd.addEventListener("click", () => {
    if (!txtName.value || !txtDescription.value || ddlPriority.selectedIndex == 0) {
        alert("The form is not valid.");
        return;
    }

    addTask("to-do", txtName.value, txtDescription.value, ddlPriority.value);
    clear();

    saveBacklog();
});

btnSave.addEventListener("click", () => {
    if (!txtName.value || !txtDescription.value || ddlPriority.selectedIndex == 0) {
        alert("The form is not valid.");
        return;
    }

    elementToEdit.querySelector("h5").innerText = txtName.value;
    elementToEdit.querySelector("div").innerText = txtDescription.value;
    elementToEdit.setAttribute("data-priority", ddlPriority.value);

    cancel();

    saveBacklog();
});

btnCancel.addEventListener("click", () => {
    cancel();
});

function addTask(section, name, description, priority) {
    let task = document.createElement("div");

    divBacklog.querySelector(`div.section[data-name=${section}] > div.area`).appendChild(task);

    task.outerHTML = `
        <div class="task" draggable="true" ondragstart="drag(event)" data-priority="${priority}" id="task-${currentTaskID++}">
            <h5>${name}</h5>
            <div>${description}</div>
            <span class="edit" onclick="edit(this.parentElement)">✏️</span>
            <span class="remove" onclick="remove(this.parentElement)">❌</span>
        </div>
    `;
}

function clear() {
    txtName.value = "";
    txtDescription.value = "";
    ddlPriority.selectedIndex = 0;
    ddlPriority.dispatchEvent(new Event('change'));
}

function cancel() {
    clear();

    elementToEdit.querySelector("span.remove").classList.remove("disabled");
    elementToEdit = undefined;

    btnAdd.classList.remove("hidden");
    btnSave.classList.add("hidden");
    btnCancel.classList.add("hidden");
}

function edit(el) {
    txtName.value = el.querySelector("h5").innerText;
    txtDescription.value = el.querySelector("div").innerText;
    ddlPriority.value = el.getAttribute("data-priority");
    ddlPriority.dispatchEvent(new Event('change'));

    el.querySelector("span.remove").classList.add("disabled");
    elementToEdit = el;

    btnAdd.classList.add("hidden");
    btnSave.classList.remove("hidden");
    btnCancel.classList.remove("hidden");
}

function remove(el) {
    if (elementToEdit || !confirm("Are you sure?")) {
        return;
    }

    el.remove();

    saveBacklog();
}

function saveBacklog() {
    let backlog = JSON.parse(JSON.stringify(backlogTemplate));

    let sections = document.querySelectorAll("div.section");

    for (var i = 0; i < sections.length; i++) {
        let section = sections[i];
        let sectionName = sections[i].getAttribute("data-name");
        let tasks = section.querySelectorAll("div.task");

        for (var j = 0; j < tasks.length; j++) {
            let task = tasks[j];

            backlog[sectionName].push({
                name: task.querySelector("h5").innerText,
                description: task.querySelector("div").innerText,
                priority: task.getAttribute("data-priority")
            });
        }
    }

    localStorage.setItem("backlog", JSON.stringify(backlog));
}

function init() {
    let storageItem = localStorage.getItem("backlog");
    if (!storageItem) {
        storageItem = JSON.stringify(backlogTemplate);
        localStorage.setItem("backlog", storageItem);
    }

    let backlog = JSON.parse(storageItem);
    for (section in backlog) {
        let tasks = backlog[section];

        for (var i = 0; i < tasks.length; i++) {
            let task = tasks[i];

            addTask(section, task.name, task.description, task.priority);
        }
    }
}

//Draggable Stuff

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));

    saveBacklog();
}

//Init

init();
