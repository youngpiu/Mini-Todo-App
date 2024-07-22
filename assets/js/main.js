const todos = JSON.parse(localStorage.getItem('todos')) || [];

const todosContainer = document.querySelector('.todos__wrapper');
const addButton = document.querySelector('.form__button');
const todoInput = document.querySelector('.form__input');
let isEditing = false;

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function generateId() {
  return new Date().getTime().toString();
}

function toggleEditMode(todoDiv, editButton, todoContent, isEditMode) {
  const editButtonIcon = editButton.querySelector('.todo__button-icon');
  if (isEditMode) {
    editButton.style.background = '#3d9691';
    editButtonIcon.setAttribute('src', './assets/icons/save.svg');
    todoContent.removeAttribute('readonly');
    todoContent.focus();
  } else {
    editButton.style.background = '#f5728b';
    editButtonIcon.setAttribute('src', './assets/icons/edit.svg');
    todoContent.setAttribute('readonly', true);
  }
}

function editTodoHandler(id) {
  const todoDiv = document.querySelector(`.todo[data-id="${id}"]`);
  if (!todoDiv) return;

  const editButton = todoDiv.querySelector('.todo__button-edit');
  const todoContent = todoDiv.querySelector('.todo__content');

  if (!isEditing) {
    isEditing = true;
    toggleEditMode(todoDiv, editButton, todoContent, true);
  } else {
    const todo = todos.find((todo) => todo.id === id);
    if (todo) {
      todo.content = todoContent.value;
      isEditing = false;
      toggleEditMode(todoDiv, editButton, todoContent, false);
      saveTodos();
      renderTodos();
    }
  }
}

function removeTodoHandler(id) {
  if (isEditing) {
    FuiToast.warning('Please save changes before removing');
    return;
  }
  const index = todos.findIndex((todo) => todo.id === id);
  if (index !== -1) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
  }
}

function completeTodoHandler(id) {
  if (isEditing) {
    FuiToast.warning('Please save changes before completing');
    return;
  }
  const todo = todos.find((todo) => todo.id === id);
  if (todo) {
    todo.done = !todo.done;
    saveTodos();
    renderTodos();
  }
}

addButton.addEventListener('click', (e) => {
  e.preventDefault();
  const todoContent = todoInput.value.trim();
  if (!todoContent) {
    FuiToast.error('Cannot add new task!');
    todoInput.classList.add('error');
    return;
  }
  const newTodo = {
    id: generateId(),
    content: todoContent,
    done: false,
  };
  FuiToast.success('New task added successfully!');
  todos.push(newTodo);
  todoInput.value = '';
  saveTodos();
  renderTodos();
});

todoInput.addEventListener('focus', () => {
  todoInput.classList.remove('error');
});

function renderTodos() {
  todosContainer.innerHTML = '';
  const todosNotification = document.querySelector('.todos__notification');
  if (todos.length === 0) {
    todosNotification.classList.add('show');
    return;
  }
  todosNotification.classList.remove('show');
  todos.forEach((todo) => {
    const todoDiv = document.createElement('div');
    todoDiv.className = 'todo';
    todoDiv.dataset.id = todo.id;

    const todoInput = document.createElement('input');
    todoInput.type = 'text';
    todoInput.name = 'todo';
    todoInput.className = 'todo__content';
    todoInput.value = todo.content;
    todoInput.readOnly = true;
    if (todo.done) {
      todoInput.classList.add('done');
    }

    const editButton = document.createElement('button');
    editButton.className = 'todo__button todo__button-edit';
    editButton.innerHTML = '<img src="./assets/icons/edit.svg" alt="" class="todo__button-icon"/>';

    const removeButton = document.createElement('button');
    removeButton.className = 'todo__button todo__button-remove';
    removeButton.innerHTML =
      '<img src="./assets/icons/trash.svg" alt="" class="todo__button-icon"/>';

    todoDiv.appendChild(todoInput);
    todoDiv.appendChild(editButton);
    todoDiv.appendChild(removeButton);

    todosContainer.appendChild(todoDiv);
  });
}

todosContainer.addEventListener('click', (e) => {
  const todoDiv = e.target.closest('.todo');
  if (todoDiv) {
    const todoId = todoDiv.dataset.id;

    if (e.target.closest('.todo__button-edit')) {
      editTodoHandler(todoId);
    } else if (e.target.closest('.todo__button-remove')) {
      removeTodoHandler(todoId);
    } else if (e.target.closest('.todo__content')) {
      completeTodoHandler(todoId);
    }
  }
});

renderTodos();
