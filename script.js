// Selectors
// Todo Selectors
const form = document.querySelector('#new-todo-form')
const todoInput = document.querySelector('#todo-input')
const list = document.querySelector('#list')
const template = document.querySelector('#list-item-template')
const LOCAL_STORAGE_PREFIX = 'ADVANCED_TODO_LIST'
const TODOS_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-todos`
const update = document.querySelector('.update')
const saveButton = document.querySelector('#save-button')

// Date and Time Selectors
const dayElement = document.querySelector('#day')
const monthElement = document.querySelector('#month')
const dateElement = document.querySelector('#date')
const yearElement = document.querySelector('#year')
let date = new Date()
let day = date.getDay()
let month = date.getUTCMonth()
let newDate = date.getDate()

// Greetings Selectors
let nameDiv = document.querySelector('#name-div')
const USER_NAME = 'MAJOR'
const TODOS_NAME_KEY = `${USER_NAME}-name`

// Modal Popup Selectors
const closeModalButtons = document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('overlay')
const modal = document.querySelector('#modal')
const yesButton = document.querySelector('#yes-button')
const noButton = document.querySelector('#no-button')
const doneButton = document.querySelector('#done-button')

// if condition to check whether the username is stored in local storage or not.
if (operationName()) {
  setTimeout(function () {
    openModal()
  }, 3000)
}

//To load the username
loadName()

//To load the todos
let todos = loadTodos()
todos.forEach(renderTodo)

// Event Listeners
// Todo Event Listeners
list.addEventListener('change', (e) => {
  if (!e.target.matches('[data-list-item-checkbox]')) return
  const parent = e.target.closest('.list-item')
  const todoId = parent.dataset.todoId
  const todo = todos.find((t) => t.id === todoId)
  todo.complete = e.target.checked
  saveTodos()
})

list.addEventListener('click', (e) => {
  if (!e.target.matches('[data-button-delete]')) return
  const parent = e.target.closest('.list-item')
  const todoId = parent.dataset.todoId
  parent.remove()
  todos = todos.filter((todo) => todo.id !== todoId)
  saveTodos()
})

form.addEventListener('submit', (e) => {
  e.preventDefault()

  const todoName = todoInput.value
  if (todoName === '') return
  const newTodo = {
    name: todoName,
    complete: false,
    id: new Date().valueOf().toString(),
  }
  todos.push(newTodo)
  renderTodo(newTodo)
  saveTodos()
  todoInput.value = ''
})

list.addEventListener('click', (e) => {
  if (!e.target.matches('[data-button-update]')) return
  update.classList.add('open')
  const updateParent = e.target.closest('.list-item')
  const todoUpdateId = updateParent.dataset.todoId
  updateTodo(todos, todoUpdateId)
})

update.addEventListener('click', (e) => {
  if (!e.target.matches('[data-button-save]')) return
  const updateSaveInput = document.querySelector('[data-update-input]')
  const todoUpdateId = updateSaveInput.parentElement.dataset.todoId
  const updateValue = updateSaveInput.value
  updateSaveTodo(todos, todoUpdateId, updateValue)
  update.classList.remove('open')
})

// Functions
// Rendering Todos
function renderTodo(todo) {
  const templateClone = template.content.cloneNode(true)
  const listItem = templateClone.querySelector('.list-item')
  listItem.dataset.todoId = todo.id
  const textElement = templateClone.querySelector('[data-list-item-text]')
  textElement.innerText = todo.name
  const checkbox = templateClone.querySelector('[data-list-item-checkbox]')
  checkbox.checked = todo.complete
  list.appendChild(templateClone)
}

// Loading Todos from local storage
function loadTodos() {
  const todosString = localStorage.getItem(TODOS_STORAGE_KEY)
  return JSON.parse(todosString) || []
}

// Saving Todos to local storage
function saveTodos() {
  localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos))
}

// Updating Todos to local Storage
function updateTodo(todos, todoId) {
  const updateInput = document.querySelector('[data-update-input]')
  const todo = todos.find((t) => t.id == todoId)
  updateInput.value = todo.name
  const inputData = updateInput.parentElement
  inputData.dataset.todoId = todo.id
}

function updateSaveTodo(todos, todoId, Input) {
  const todoData = todos.find((todo) => todo.id === todoId)
  todoData.name = Input
  saveTodos()
  loadTodos()
  location.reload()
}

// Date and Time Functions
function operationDay(day) {
  if (day === 1) {
    return 'Monday'
  } else if (day === 2) {
    return 'Tuesday'
  } else if (day === 3) {
    return 'Wednesday'
  } else if (day === 4) {
    return 'Thursday'
  } else if (day === 5) {
    return 'Friday'
  } else if (day === 6) {
    return 'Saturday'
  } else if (day === 7) {
    return 'Sunday'
  } else {
    return
  }
}

let operationMonth = function (month) {
  if (month === 0) {
    return 'Jan'
  } else if (month === 1) {
    return 'Feb'
  } else if (month === 2) {
    return 'Mar'
  } else if (month === 3) {
    return 'Apr'
  } else if (month === 4) {
    return 'May'
  } else if (month === 5) {
    return 'Jun'
  } else if (month === 6) {
    return 'Jul'
  } else if (month === 7) {
    return 'Aug'
  } else if (month === 8) {
    return 'Sep'
  } else if (month === 9) {
    return 'Oct'
  } else if (month === 10) {
    return 'Nov'
  } else if (month === 11) {
    return 'Dec'
  } else {
    return
  }
}

dayElement.innerHTML = operationDay(day)
monthElement.innerHTML = operationMonth(month)
dateElement.innerHTML = newDate
yearElement.innerHTML = date.getFullYear()

// Modal (popup) Event Listeners
yesButton.addEventListener('click', (e) => {
  nameDiv.classList.add('open')
})

noButton.addEventListener('click', (e) => {
  autoName()
  closeModal()
  loadName()
})

doneButton.addEventListener('click', (e) => {
  const input = document.querySelector('#name-input')
  const usernameField = document.querySelector('#username')
  const username = input.value
  usernameField.innerHTML = username
  saveName(username)
  closeModal()
})

// Modal (popup) Functions
closeModalButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal')
    closeModal(modal)
  })
})

function openModal() {
  modal.classList.add('active') // if (modal == null) return
  overlay.classList.add('active')
}

function closeModal() {
  modal.classList.remove('active') //if (modal == null) return
  overlay.classList.remove('active')
}

function saveName(name) {
  localStorage.setItem(TODOS_NAME_KEY, JSON.stringify(name))
  const username = document.querySelector('#username')
  username.dataset.nameId = name
}

function loadName() {
  const name = localStorage.getItem(TODOS_NAME_KEY)
  const userField = document.querySelector('#username')
  userField.innerHTML = JSON.parse(name)
}

function operationName() {
  const name = localStorage.getItem(TODOS_NAME_KEY)
  //console.log(name)
  if (name == null) {
    return true
  } else {
    return false
  }
}

function autoName() {
  const name = 'Major'
  localStorage.setItem(TODOS_NAME_KEY, JSON.stringify(name))
}
