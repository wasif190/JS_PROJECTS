const inputForm = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
const todoList = document.querySelector('#todo-list');
const emptyState = document.querySelector('#empty-state');

// Load tasks 
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateEmptyState() {
    if (tasks.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
    }
}

function addTask(e) {
    e.preventDefault(); // stops default action of the event

    let taskText = input.value.trim();
    if (!taskText) return;

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    }

    tasks.push(newTask);
    saveTasks();

    // Render the new task in UI
    renderTask(newTask);

    input.value = "";
    updateEmptyState();
}

function renderTask(task) {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    const textSpan =  document.createElement('span');

    li.dataset.id = task.id;

    li.className =
    'flex items-center justify-between bg-slate-100 border border-slate-200 rounded px-3 py-2 text-sm';

    if (task.completed) {
        li.classList.add('line-through', 'opacity-60');
    }

    // text span
    textSpan.textContent = task.text;
    textSpan.className = 'flex-1 cursor-pointer select-none';

    // delete btn
    btn.textContent = 'X';
    btn.className =
    'ml-3 text-xs bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-semibold px-2 py-1 rounded transition';

    // events
    textSpan.addEventListener('click', () => toggleComplete(task.id));
    btn.addEventListener('click', () => deleteTask(task.id));

    li.appendChild(textSpan);
    li.appendChild(btn);
    todoList.appendChild(li);
}

function loadTasksOnLoad() {
    tasks.forEach(task => renderTask(task));
    updateEmptyState();
}

// delete task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();

    const li = todoList.querySelector(`li[data-id="${id}"]`);
    if(li) {
        if (confirm("Are you sure?")) {
            li.remove()
        }
    }

    updateEmptyState();
}

// toggle complete\
function toggleComplete(id) {
    tasks = tasks.map(task =>
        task.id === id
            ? { ...task, completed: !task.completed }
            : task
    );

    saveTasks();

    const li = todoList.querySelector(`li[data-id="${id}"]`);
    if (li) {
        li.classList.toggle('line-through');
        li.classList.toggle('opacity-60');
    }
}


inputForm.addEventListener('submit', addTask);
document.addEventListener('DOMContentLoaded', loadTasksOnLoad);