const maxTasksAmount = 25;

const taskList = [];
const filterDict = { "all": "All Tasks", "done": "Tasks Done", "todo": "Tasks To-Do" };
let currentFilter = "all";

const taskTitleWarnMsg = "Title must be lower than 20 characters including spaces. Only letters and numbers allowed.";
const taskContentWarnMsg = "Content must be lower than 40 characters including spaces. Only letters and numbers allowed.";
const taskAmountWarnMsg = "Too many tasks were created, maximum 25. Delete some to have some!";

const maxTaskTitleLen = 20;
const maxTaskContLen = 40;

const formTitleWarn = document.querySelector('.warn-task-title');
const formContentWarn = document.querySelector('.warn-task-content');
const formTaskWarn = document.querySelector('.warn-task-amount');

const alphaNumRegex = /^[a-zA-Z0-9]*$/;

const taskTitleInput = document.querySelector('.task-title-input');
const taskContentInput = document.querySelector('.task-content-input');

const container = document.querySelector('.flex-container');

const formBtn = document.querySelector('.form-btn');
const filterBtn = document.querySelector('.all-filter');
const removeAllBtn = document.querySelector('.remove-all-btn');

taskTitleInput.addEventListener('input', function(){
    if(!isAlphaNumTextValid(taskTitleInput.value, maxTaskTitleLen))
        formTitleWarn.textContent = taskTitleWarnMsg;
    else
        formTitleWarn.textContent = "";
});

taskContentInput.addEventListener('input', function(){
    if(!isAlphaNumTextValid(taskContentInput.value, maxTaskTitleLen))
        formContentWarn.textContent = taskContentWarnMsg;
    else
        formContentWarn.textContent = "";
});

container.addEventListener('click', function (element){
    if(element.target.matches(".task-remove-btn")){
        deleteTask(element.target.parentNode.parentNode);
    }
});

container.addEventListener('change', function (element){
    if(element.target.matches(".checkbox"))
        changeTaskStatus(element.target.parentNode.parentNode);

    renderAllTasks(currentFilter);
});

filterBtn.addEventListener('click', function(){
    switch(currentFilter){
        case "all":
            currentFilter = "done";
            filterBtn.classList.toggle("all-filter-color");
            filterBtn.classList.toggle("done-filter-color");
            break;
        case "done":
            currentFilter = "todo";
            filterBtn.classList.toggle("done-filter-color");
            filterBtn.classList.toggle("todo-filter-color");
            break;
        case "todo":
        default:
            currentFilter = "all";
            filterBtn.classList.toggle("todo-filter-color");
            filterBtn.classList.toggle("all-filter-color");
            break;
    }

    renderAllTasks(currentFilter);

    filterBtn.textContent = filterDict[currentFilter];
});

removeAllBtn.addEventListener('click', function(){
    container.replaceChildren();
    taskList.length = 0;
});

formBtn.addEventListener('click', function(){
    event.preventDefault();

    let taskId = 0;
    if(taskList.length !== 0)
        taskId = taskList.length;

    const taskTitle = taskTitleInput.value;
    const taskContent = taskContentInput.value;
    const taskStatus = "todo";

    if(!isAlphaNumTextValid(taskTitle) && !isAlphaNumTextValid(taskContent))
        return;

    if(taskList.length >= maxTasksAmount){
        formTaskWarn.textContent = taskAmountWarnMsg;
        return;
    }

    formTaskWarn.textContent = "";

    createTaskElement(taskId, taskTitle, taskContent, taskStatus);
    taskList.push( { id: taskId, content: { title: taskTitle, text: taskContent }, status: taskStatus } );
});

function isAlphaNumTextValid(prop, maxLength)
{
    let valid = true;
    if(prop.length > maxLength || !alphaNumRegex.test(prop)){
        valid = false;
    }
    
    return valid;
}

function createTaskElement(taskId, taskTitle, taskContent, status)
{
    let taskContainer = document.createElement('div');

    if(status === "todo")
        taskContainer.classList.add('task-container', 'task-container-todo');
    else
    taskContainer.classList.add('task-container', 'task-container-done');

    taskContainer.dataset.id = taskId;

    let taskItemTitle = document.createElement('div');
    taskItemTitle.classList.add('task-item-title');
    taskItemTitle.textContent = taskTitle;

    let taskItemContent = document.createElement('div');
    taskItemContent.classList.add('task-item-content');
    taskItemContent.textContent = taskContent;

    let taskItemStatus = document.createElement('div');
    taskItemStatus.classList.add('task-item-status');

    let statusCheckbox = document.createElement('input');
    statusCheckbox.setAttribute('type', 'checkbox');

    if(status === "done")
        statusCheckbox.checked = true;

    statusCheckbox.classList.add('checkbox');
    taskItemStatus.appendChild(statusCheckbox);

    let statusLabel = document.createElement('label');
    statusLabel.textContent = "Done";
    taskItemStatus.appendChild(statusLabel);

    let removeButton = document.createElement('button');
    removeButton.classList.add('task-remove-btn');
    removeButton.textContent = "Remove";
    taskItemStatus.appendChild(removeButton);
    
    taskContainer.appendChild(taskItemTitle);
    taskContainer.appendChild(taskItemContent);
    taskContainer.appendChild(taskItemStatus);

    container.appendChild(taskContainer);
}

function renderAllTasks(targetStatus)
{
    container.replaceChildren();

    let taskListToShow = [];
    if(targetStatus !== "all"){
        taskListToShow = taskList.filter(t => t.status === targetStatus);
    } else{
        taskListToShow = taskList;
    }

    taskListToShow.forEach(t => createTaskElement(t.id, t.content.title, t.content.text, t.status));
}

function changeTaskStatus(task)
{
    setStatus(taskList[task.dataset.id]);

    task.classList.toggle('task-container-todo');
    task.classList.toggle('task-container-done');
}

function deleteTask(task)
{
    taskList.splice(task.dataset.id, 1);
    task.remove();
}

function setStatus(task)
{
    if(task.status === "todo")
        task.status = "done";
    else
        task.status = "todo";
}