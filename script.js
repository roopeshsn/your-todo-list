// Selectors

const form = document.querySelector('#new-todo-form')
const todoInput = document.querySelector('#todo-input')
const list = document.querySelector('#list')
const template = document.querySelector('#list-item-template')
const LOCAL_STORAGE_PREFIX = 'ADVANCED_TODO_LIST'
const TODOS_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-todos`
const update = document.querySelector('.update')
const saveButton = document.querySelector('#save-button')
let todos = loadTodos()
todos.forEach(renderTodo)

// Event Listeners

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
