const maxTasksAmount = 25;

const taskList = [];
const filterDict = { "all": "All Tasks", "done": "Tasks Done", "todo": "Tasks To-Do" };
let currentFilter = "all";

const taskTitleWarnMsg = "Title must be lower than 20 characters including spaces. Only letters and numbers allowed.";
const taskTitleEmptyMsg = "Title must be at least 3 alphanumeric characters.";

const taskContentWarnMsg = "Content must be lower than 40 characters including spaces. Only letters and numbers allowed.";
const taskContentEmptyMsg = "Content must be at least 2 alphanumeric characters.";

const taskAmountWarnMsg = "Too many tasks were created, maximum 25. Delete some to have some!";

const minTaskTitleLen = 3;
const maxTaskTitleLen = 20;

const minTaskContLen = 2;
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
    if(!isAlphaNumTextValid(taskTitleInput.value.trim(), maxTaskTitleLen))
        formTitleWarn.textContent = taskTitleWarnMsg;
    else if(!isFormTextLenValid(taskTitleInput.value, minTaskTitleLen))
        formTitleWarn.textContent = taskTitleEmptyMsg;
    else
        formTitleWarn.textContent = "";
});

taskContentInput.addEventListener('input', function(){
    if(!isAlphaNumTextValid(taskContentInput.value, maxTaskTitleLen))
        formContentWarn.textContent = taskContentWarnMsg;
    else if(!isFormTextLenValid(taskContentInput.value, minTaskContLen))
        formContentWarn.textContent = taskContentEmptyMsg;
    else
        formContentWarn.textContent = "";
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

    renderTasksByStatus(currentFilter);

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

    let isTextFormatValid = isAlphaNumTextValid(taskTitleInput.value) && isAlphaNumTextValid(taskContentInput.value);
    let isTextLenValid = isFormTextLenValid(taskTitleInput.value, minTaskTitleLen) && isFormTextLenValid(taskContentInput.value, minTaskContLen);

    if(!isTextFormatValid || !isTextLenValid)
        return;

    const taskTitle = taskTitleInput.value.trim();
    const taskContent = taskContentInput.value.trim();
    const taskStatus = "todo";

    if(taskList.length >= maxTasksAmount){
        formTaskWarn.textContent = taskAmountWarnMsg;
        return;
    }

    formTaskWarn.textContent = "";

    taskList.push( { id: taskId, content: { title: taskTitle, text: taskContent }, status: taskStatus } );

    if(currentFilter === "all")
        renderAllTasks();
    else
        renderTasksByStatus(currentStatus);
});

function sortTaskList()
{
    taskList.sort((t, tNext) => {
        if(t.status === tNext.status)
            return 0;
        return t.status === "todo" ? -1 : 1;
    });
}

function isAlphaNumTextValid(prop, maxLength)
{
    let valid = true;
    if(prop.length > maxLength || !alphaNumRegex.test(prop)){
        valid = false;
    }
    
    return valid;
}

function isFormTextLenValid(value, minLen)
{
    return value != null && value.trim().length > minLen;
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
    statusCheckbox.setAttribute('name', 'status-check');
    statusCheckbox.id = "status-check";

    if(status === "done")
        statusCheckbox.checked = true;

    statusCheckbox.classList.add('checkbox');
    taskItemStatus.appendChild(statusCheckbox);

    let statusLabel = document.createElement('label');
    statusLabel.setAttribute("for", "status-check");
    statusLabel.textContent = "Done";
    taskItemStatus.appendChild(statusLabel);

    let removeButton = document.createElement('button');
    removeButton.classList.add('task-remove-btn');
    removeButton.textContent = "Remove";
    taskItemStatus.appendChild(removeButton);
    
    taskContainer.appendChild(taskItemTitle);
    taskContainer.appendChild(taskItemContent);
    taskContainer.appendChild(taskItemStatus);

    removeButton.addEventListener('click', () => deleteTask(taskContainer));

    statusCheckbox.addEventListener('change',  () => setTaskStatus(taskContainer));

    container.appendChild(taskContainer);
}

function setTaskStatus(task)
{
    let taskObject = taskList.find(t => t.id === parseInt(task.dataset.id));
    setStatus(taskObject);

    if(currentFilter === "all")
        renderAllTasks();
    else
        renderTasksByStatus(currentStatus);
}

function renderAllTasks()
{
    container.replaceChildren();

    sortTaskList();

    taskList.forEach(t => createTaskElement(t.id, t.content.title, t.content.text, t.status));
}

function renderTasksByStatus(status)
{
    container.replaceChildren();

    let taskListToShow = [];
    if(status !== "all"){
        taskListToShow = taskList.filter(t => t.status === status);
    } else{
        taskListToShow = taskList;
    }

    taskListToShow.forEach(t => createTaskElement(t.id, t.content.title, t.content.text, t.status));
}

function deleteTask(task)
{
    taskList.splice(task.dataset.id, 1);
    task.remove();

    if(currentFilter === "all")
        renderAllTasks();
    else
        renderTasksByStatus(currentStatus);
}

function setStatus(task)
{
    if(task.status === "todo")
        task.status = "done";
    else
        task.status = "todo";
}