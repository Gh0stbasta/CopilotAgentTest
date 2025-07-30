"use strict";
let todos = [];
document.addEventListener('DOMContentLoaded', loadTodos);
document.getElementById('todoInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});
async function loadTodos() {
    try {
        const response = await fetch('/api/todos');
        todos = await response.json();
        renderTodos();
    }
    catch (error) {
        console.error('Error loading todos:', error);
    }
}
async function addTodo() {
    const input = document.getElementById('todoInput');
    const title = input.value.trim();
    if (!title)
        return;
    try {
        const response = await fetch('/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title }),
        });
        if (response.ok) {
            const newTodo = await response.json();
            todos.push(newTodo);
            renderTodos();
            input.value = '';
        }
    }
    catch (error) {
        console.error('Error adding todo:', error);
    }
}
async function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo)
        return;
    try {
        const response = await fetch(`/api/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: todo.title,
                completed: !todo.completed
            }),
        });
        if (response.ok) {
            todo.completed = !todo.completed;
            renderTodos();
        }
    }
    catch (error) {
        console.error('Error toggling todo:', error);
    }
}
async function deleteTodo(id) {
    try {
        const response = await fetch(`/api/todos/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            todos = todos.filter(t => t.id !== id);
            renderTodos();
        }
    }
    catch (error) {
        console.error('Error deleting todo:', error);
    }
}
function renderTodos() {
    const todoList = document.getElementById('todoList');
    if (!todoList)
        return;
    todoList.innerHTML = '';
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" 
                   ${todo.completed ? 'checked' : ''} 
                   onchange="toggleTodo(${todo.id})">
            <span class="todo-text ${todo.completed ? 'completed' : ''}">${escapeHtml(todo.title)}</span>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">Löschen</button>
        `;
        todoList.appendChild(li);
    });
}
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
window.addTodo = addTodo;
window.toggleTodo = toggleTodo;
window.deleteTodo = deleteTodo;
