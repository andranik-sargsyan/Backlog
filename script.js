let currentTaskID = 1;
let priorities = {
    0: "white",
    1: "yellow",
    2: "orange",
    3: "red"
};

let txtName = document.getElementById("txt-name");
let txtDescription = document.getElementById("txt-description");
let ddlPriority = document.getElementById("ddl-priority");
let btnAdd = document.getElementById("btn-add");
let divBacklog = document.getElementById("backlog");

ddlPriority.addEventListener("change", () => {
    ddlPriority.style.backgroundColor = priorities[ddlPriority.selectedIndex];
});

btnAdd.addEventListener("click", () => {
    if (!txtName.value || !txtDescription.value || ddlPriority.selectedIndex == 0) {
        alert("The form is not valid.");
        return;
    }

    addTask(txtName.value, txtDescription.value, ddlPriority.value);
    clear();
});

function addTask(name, description, priority) {
    let task = document.createElement("div");
    task.classList.add("task");
    task.classList.add(priority);
    task.draggable = true;
    task.setAttribute("ondragstart", "drag(event)");
    task.id = `task-${currentTaskID}`;
    task.innerHTML = `
        <h5>${name}</h5>
        <div>${description}</div>
        <span onclick="remove(this.parentElement)">X</span>
    `;

    divBacklog.querySelector("div.area").appendChild(task);

    currentTaskID++;
}

function clear() {
    txtName.value = "";
    txtDescription.value = "";
    ddlPriority.selectedIndex = 0;
    ddlPriority.dispatchEvent(new Event('change'));
}

function remove(el) {
    if (!confirm("Are you sure?")) {
        return;
    }

    el.remove();
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
}

//1. improve addTask (make all HTML)
//2. make sections also dynamic
//3. cache div.area also and explain
//4. implement localStorage
//5. edit also?
