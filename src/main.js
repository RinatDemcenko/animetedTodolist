import './style.css';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

const canvas = document.querySelector(".particles");
const ctx = canvas.getContext("2d");
const particles = [];
let maxDistance = (window.innerWidth + window.innerHeight) / 6;

// Частицы на фоне
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.r = 255;
    this.g = 255;
    this.b = 255;
    this.color = `rgba(${this.r}, ${this.g}, ${this.b}, 0.7)`;
    this.animate();
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }

  changeColor(r, g, b) {
    gsap.to(this, {
      r: r,
      g: g,
      b: b,
      duration: 1,
      onComplete: () => {
        this.color = `rgba(${Math.round(this.r)}, ${Math.round(this.g)}, ${Math.round(this.b)}, 0.7)`;
      },
    });
  }

  getRandomTarget() {
    return {
      x: Math.min(Math.max(this.x + (Math.random() - 0.5) * maxDistance, 0), canvas.width),
      y: Math.min(Math.max(this.y + (Math.random() - 0.5) * maxDistance, 0), canvas.height),
    };
  }

  animate() {
    const target = this.getRandomTarget();
    gsap.to(this, {
      x: target.x,
      y: target.y,
      duration: 1 + Math.random() * 2,
      ease: "sine.inOut",
      onComplete: () => this.animate(),
    });
  }
}

for (let i = 0; i < (window.innerWidth + window.innerHeight) / 9; i++) {
  particles.push(new Particle());
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(particle => {
    particle.draw();
  });
  requestAnimationFrame(animate);
}

animate();

// Смена цветов
const bgcolorSwitcher = document.querySelector("#bg-color");
const particleColorSwitcher = document.querySelector("#particle-color");
const applyColorButton = document.querySelector(".apply");

applyColorButton.addEventListener("click", () => {
  const bg = bgcolorSwitcher.value;
  document.body.style.backgroundColor = bg;
  const hex = particleColorSwitcher.value;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  particles.forEach(particle => particle.changeColor(r, g, b));
});

const viewPresets = document.querySelector(".view");
console.log(viewPresets);
const PresetsContainer = document.querySelector(".presets");

viewPresets.addEventListener("click", () => {
  PresetsContainer.classList.toggle("active");
});

// Переворот карточек
let todos = document.querySelectorAll(".todo");

function rotate(element) {
  gsap.to(element, {
    height: 220,
    duration: 0.3,
    onComplete: () => {
      gsap.to(element, {
        rotateY: 180,
        duration: 0.6,
        ease: "back.out(1.7)",
      });
    },
  });
}

function rotateBack(element) {
  gsap.to(element, {
    rotateY: 0,
    duration: 0.6,
    ease: "back.out(1.7)",
    onComplete: () => {
      gsap.to(element, {
        height: 175,
        duration: 0.3,
      });
    },
  });
}

// Функции для работы с localStorage
function getLastTodoId() {
  const lastId = localStorage.getItem("lastTodoId");
  return lastId ? parseInt(lastId, 10) : 0;
}

function updateLastTodoId(newId) {
  localStorage.setItem("lastTodoId", newId.toString());
}

function loadTodosFromStorage() {
  const todosData = localStorage.getItem("todos");
  return todosData ? JSON.parse(todosData) : [];
}

function saveTodosToStorage(todosData) {
  localStorage.setItem("todos", JSON.stringify(todosData));
}

function getTodoData(todo) {
  return {
    id: parseInt(todo.dataset.id, 10),
    name: todo.querySelector(".todo-name h2").innerText,
    description: todo.querySelector(".description p").innerText,
    due: todo.querySelector(".date-priority .due p").innerText,
    priority: todo.querySelector(".date-priority .priority p").innerText,
    column: todo.getAttribute("card-column"),
  };
}

// Основной функционал
const newTodosContainer = document.querySelector(".new-todos .todo-container");
const inProcessContainer = document.querySelector(".in-process .todo-container");

function updateTodoList() {
  todos.forEach(todo => {
    const todoName = todo.querySelector(".todo-name h2");
    const todoDescription = todo.querySelector(".description p");
    const todoDue = todo.querySelector(".date-priority .due p");
    const todoPriority = todo.querySelector(".date-priority .priority p");

    const editTodoName = todo.querySelector(".edit-todo-name");
    const editDescription = todo.querySelector(".edit-description");
    const editPriority = todo.querySelector(".edit-priority select");
    const editDue = todo.querySelector(".edit-due");

    const finishButton = todo.querySelector(".finish");
    const startButton = todo.querySelector(".start");
    const editButton = todo.querySelector(".edit");
    const failButton = todo.querySelector(".fail");
    const saveButton = todo.querySelector(".save");
    const deleteButton = todo.querySelector(".delete");
    const cancelButton = todo.querySelector(".cancel");

    editTodoName.value = todoName.innerText;
    editDescription.value = todoDescription.innerText;
    editPriority.value = todoPriority.innerText;
    editDue.value = todoDue.innerText;

    let newName = todoName.innerText,
        newDescription = todoDescription.innerText,
        newPriority = todoPriority.innerText,
        newDue = todoDue.innerText;

    editTodoName.addEventListener("input", () => {
      newName = editTodoName.value;
    });
    editDescription.addEventListener("input", () => {
      newDescription = editDescription.value;
    });
    editPriority.addEventListener("input", () => {
      newPriority = editPriority.value;
    });
    editDue.addEventListener("input", () => {
      newDue = editDue.value;
    });

    startButton.addEventListener("click", () => {
      inProcessContainer.appendChild(todo);
      todo.setAttribute("card-column", "in-process");

      const todosData = loadTodosFromStorage();
      const todoData = todosData.find(t => t.id === parseInt(todo.dataset.id, 10));
      if (todoData) {
        todoData.column = "in-process";
        saveTodosToStorage(todosData);
      }
    });

    editButton.addEventListener("click", () => {
      rotate(todo);
    });

    cancelButton.addEventListener("click", () => {
      rotateBack(todo);
    });

    deleteButton.addEventListener("click", () => {
      todo.remove();
      todos = document.querySelectorAll(".todo");

      const todosData = loadTodosFromStorage();
      const updatedTodosData = todosData.filter(t => t.id !== parseInt(todo.dataset.id, 10));
      saveTodosToStorage(updatedTodosData);

      updateTodoList();
    });

    finishButton.addEventListener("click", () => {
      todo.remove();
      todos = document.querySelectorAll(".todo");

      const todosData = loadTodosFromStorage();
      const updatedTodosData = todosData.filter(t => t.id !== parseInt(todo.dataset.id, 10));
      saveTodosToStorage(updatedTodosData);

      updateTodoList();
    });

    failButton.addEventListener("click", () => {
      todo.remove();
      todos = document.querySelectorAll(".todo");

      const todosData = loadTodosFromStorage();
      const updatedTodosData = todosData.filter(t => t.id !== parseInt(todo.dataset.id, 10));
      saveTodosToStorage(updatedTodosData);

      updateTodoList();
    });

    saveButton.addEventListener("click", () => {
      rotateBack(todo);
      todoName.innerText = newName;
      todoDescription.innerText = newDescription;
      todoPriority.innerText = newPriority;
      todoDue.innerText = newDue;

      const todosData = loadTodosFromStorage();
      const todoData = todosData.find(t => t.id === parseInt(todo.dataset.id, 10));
      if (todoData) {
        todoData.name = newName;
        todoData.description = newDescription;
        todoData.priority = newPriority;
        todoData.due = newDue;
        saveTodosToStorage(todosData);
      }
    });
  });
}

const initialTodoHtml = (data = {}) => {
  const { name = "Название", description = "Описание", due = "2025-10-10", priority = "5", column = "new-todos" } = data;
  return `
    <div class="front-side">
      <div class="todo-name">
        <h2>${name}</h2>
      </div>
      <div class="description">
        <p>${description}</p>
      </div>
      <div class="front-buttons">
        <button class="fail"><img src="/close.png" alt=""></button>
        <button class="edit"><img src="/edit.png" alt=""></button>
        <button class="finish"><img src="/success.png" alt=""></button>
        <button class="start"><img src="/start.png" alt=""></button>
      </div>
      <div class="date-priority">
        <div class="due">
          <p>${due}</p>
        </div>
        <div class="priority">
          <p>${priority}</p>
        </div>
      </div>
    </div>
    <div class="back-side">
      <input type="text" class="edit-todo-name" placeholder="Todo name...">
      <textarea name="" id="" class="edit-description" placeholder="Todo description..."></textarea>
      <div class="edit-priority">
        <label for="priority">Приор.</label>
        <select name="priority" id="priority">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
        <label for="due">Срок</label>
        <input type="text" name="due" class="edit-due">
      </div>
      <div class="edit-buttons">
        <button class="delete"><img src="/bin.png" alt=""></button>
        <button class="save"><img src="/check-mark.png" alt=""></button>
        <button class="cancel"><img src="/close.png" alt=""></button>
      </div>
    </div>
  `;
};

const addButton = document.querySelector(".add-todo");

function addTodo() {
  const lastId = getLastTodoId();
  const newId = lastId + 1;

  const todoData = {
    id: newId,
    name: "Название",
    description: "Описание",
    due: "2025-10-10",
    priority: "5",
    column: "new-todos",
  };

  const todo = document.createElement("div");
  todo.classList.add("todo");
  todo.setAttribute("card-column", todoData.column);
  todo.setAttribute("data-id", todoData.id);
  todo.innerHTML = initialTodoHtml(todoData);
  document.querySelector(".new-todos .todo-container").appendChild(todo);

  todos = document.querySelectorAll(".todo");

  const todosData = loadTodosFromStorage();
  todosData.push(todoData);
  saveTodosToStorage(todosData);

  updateLastTodoId(newId);

  updateTodoList();
}

addButton.addEventListener("click", () => {
  addTodo();
  updateTodoList();
});

// Инициализация тудушек из localStorage
function initializeTodos() {
  const todosData = loadTodosFromStorage();
  todosData.forEach(todoData => {
    const todo = document.createElement("div");
    todo.classList.add("todo");
    todo.setAttribute("card-column", todoData.column);
    todo.setAttribute("data-id", todoData.id);
    todo.innerHTML = initialTodoHtml(todoData);
    const container = todoData.column === "new-todos" ? newTodosContainer : inProcessContainer;
    container.appendChild(todo);
  });

  todos = document.querySelectorAll(".todo");
  updateTodoList();
}

initializeTodos();