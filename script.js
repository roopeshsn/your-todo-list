// Selectors
// Todo Selectors
const form = document.querySelector('#new-todo-form');
const todoInput = document.querySelector('#todo-input');
const list = document.querySelector('#list');
const template = document.querySelector('#list-item-template');
const LOCAL_STORAGE_PREFIX = 'ADVANCED_TODO_LIST';
const TODOS_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-todos`;
const update = document.querySelector('.update');
const saveButton = document.querySelector('#save-button');

// Date and Time Selectors
const date = document.querySelector('.date');

// Greetings Selectors
let nameDiv = document.querySelector('#name-div');
const USER_NAME = 'MAJOR';
const TODOS_NAME_KEY = `${USER_NAME}-name`;

// Modal Popup Selectors
const closeModalButtons = document.querySelectorAll('[data-close-button]');
const overlay = document.getElementById('overlay');
const modal = document.querySelector('#modal');
const yesButton = document.querySelector('#yes-button');
const noButton = document.querySelector('#no-button');
const doneButton = document.querySelector('#done-button');

// if condition to check whether the username is stored in local storage or not.
if (operationName()) {
  setTimeout(function () {
    openModal();
  }, 3000);
}

// To load the username
loadName();

// To load the todos
let todos = loadTodos();
todos.forEach(renderTodo);

// To load current date and time
setInterval(() => {
  handlingDateFormat();
}, 1000);

// Event Listeners
// Todo Event Listeners
list.addEventListener('change', (e) => {
  if (!e.target.matches('[data-list-item-checkbox]')) return;
  const parent = e.target.closest('.list-item');
  const todoId = parent.dataset.todoId;
  const todo = todos.find((t) => t.id === todoId);
  todo.complete = e.target.checked;
  saveTodos();
});

list.addEventListener('click', (e) => {
  if (!e.target.matches('[data-button-delete]')) return;
  const parent = e.target.closest('.list-item');
  const todoId = parent.dataset.todoId;
  parent.remove();
  todos = todos.filter((todo) => todo.id !== todoId);
  saveTodos();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const todoName = todoInput.value;
  if (todoName === '') return;
  const newTodo = {
    name: todoName,
    complete: false,
    id: new Date().valueOf().toString(),
  };
  todos.push(newTodo);
  renderTodo(newTodo);
  saveTodos();
  todoInput.value = '';
});

list.addEventListener('click', (e) => {
  if (!e.target.matches('[data-button-update]')) return;
  update.classList.add('open');
  const updateParent = e.target.closest('.list-item');
  const todoUpdateId = updateParent.dataset.todoId;
  updateTodo(todos, todoUpdateId);
});

update.addEventListener('click', (e) => {
  if (!e.target.matches('[data-button-save]')) return;
  const updateSaveInput = document.querySelector('[data-update-input]');
  const todoUpdateId = updateSaveInput.parentElement.dataset.todoId;
  const updateValue = updateSaveInput.value;
  updateSaveTodo(todos, todoUpdateId, updateValue);
  update.classList.remove('open');
});

// Functions

// handling date and time
function handlingDateFormat() {
  const now = new Date();
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    weekday: 'long',
    month: 'short',
    year: 'numeric',
  };
  date.textContent = new Intl.DateTimeFormat(navigator.language, options).format(now);
}

// Rendering Todos
function renderTodo(todo) {
  const templateClone = template.content.cloneNode(true);
  const listItem = templateClone.querySelector('.list-item');
  listItem.dataset.todoId = todo.id;
  const textElement = templateClone.querySelector('[data-list-item-text]');
  textElement.innerText = todo.name;
  const checkbox = templateClone.querySelector('[data-list-item-checkbox]');
  checkbox.checked = todo.complete;
  list.appendChild(templateClone);
}

// Loading Todos from local storage
function loadTodos() {
  const todosString = localStorage.getItem(TODOS_STORAGE_KEY);
  return JSON.parse(todosString) || [];
}

// Saving Todos to local storage
function saveTodos() {
  localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
}

// Updating Todos to local Storage
function updateTodo(todos, todoId) {
  const updateInput = document.querySelector('[data-update-input]');
  const todo = todos.find((t) => t.id == todoId);
  updateInput.value = todo.name;
  const inputData = updateInput.parentElement;
  inputData.dataset.todoId = todo.id;
  updateInput.focus();
}

function updateSaveTodo(todos, todoId, Input) {
  const todoData = todos.find((todo) => todo.id === todoId);
  if (Input == '') return;
  todoData.name = Input;
  saveTodos();
  loadTodos();
  location.reload();
}

// Modal (popup) Event Listeners
yesButton.addEventListener('click', (e) => {
  nameDiv.classList.add('open');
});

noButton.addEventListener('click', (e) => {
  autoName();
  closeModal();
  loadName();
});

doneButton.addEventListener('click', (e) => {
  const input = document.querySelector('#name-input');
  const usernameField = document.querySelector('#username');
  const username = input.value;
  usernameField.innerHTML = username;
  saveName(username);
  closeModal();
});

// Modal (popup) Functions
closeModalButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal');
    closeModal(modal);
  });
});

function openModal() {
  modal.classList.add('active'); // if (modal == null) return
  overlay.classList.add('active');
}

function closeModal() {
  modal.classList.remove('active'); //if (modal == null) return
  overlay.classList.remove('active');
}

function saveName(name) {
  localStorage.setItem(TODOS_NAME_KEY, JSON.stringify(name));
  const username = document.querySelector('#username');
  username.dataset.nameId = name;
}

function loadName() {
  const name = localStorage.getItem(TODOS_NAME_KEY);
  const userField = document.querySelector('#username');
  userField.innerHTML = JSON.parse(name);
}

function operationName() {
  const name = localStorage.getItem(TODOS_NAME_KEY);
  //console.log(name)
  if (name == null) {
    return true;
  } else {
    return false;
  }
}

function autoName() {
  const name = 'Major';
  localStorage.setItem(TODOS_NAME_KEY, JSON.stringify(name));
}
