const taskList = [];
const filterDict = { "all": "All Tasks", "done": "Tasks Done", "todo": "Tasks To-Do" };
let currentFilter = "all";

const container = document.querySelector('.flex-container');

const formBtn = document.querySelector('.form-btn');
const filterBtn = document.querySelector('.all-filter');
const removeAllBtn = document.querySelector('.remove-all-btn');

container.addEventListener('click', function (element){
    if(element.target.matches(".task-remove-btn")){
        deleteTask(element.target.parentNode.parentNode);
    }
});

container.addEventListener('change', function (element){
    if(element.target.matches(".checkbox"))
        changeTaskStatus(element.target.parentNode.parentNode);
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

    filterByStatus(currentFilter);

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

    const taskTitle = document.querySelector('#task-title').value;
    const taskContent = document.querySelector('#task-content').value;
    const taskStatus = "todo";

    createTaskElement(taskId, taskTitle, taskContent, taskStatus);
    taskList.push( { id: taskId, content: { title: taskTitle, text: taskContent }, status: taskStatus } );
});

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

function filterByStatus(targetStatus)
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

function setStatus(task)
{
    if(task.status === "todo")
        task.status = "done";
    else
        task.status = "todo";
}