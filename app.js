const formBtn = document.querySelector('.form-btn');

formBtn.addEventListener('click', function(){
    event.preventDefault();

    const container = document.querySelector('.flex-container');

    const taskTitle = document.querySelector('#task-title').value;
    const taskContent = document.querySelector('#task-content').value;

    console.log(taskTitle);
    console.log(taskContent);

    let taskContainer = document.createElement('div');
    taskContainer.classList.add('task-container');

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

    removeButton.addEventListener('click', () => deleteTask(removeButton));
});

function deleteTask(btn)
{
    btn.removeEventListener('click', () => deleteTask(btn));

    const btnParent = btn.parentNode;
    const container = btnParent.parentNode;

    container.remove();
}