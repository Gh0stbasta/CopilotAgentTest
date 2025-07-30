// Frontend TypeScript for Todo App
interface Todo {
    id: number;
    title: string;
    completed: boolean;
}

let todos: Todo[] = [];

// Load todos when page loads
document.addEventListener('DOMContentLoaded', loadTodos);

// Add event listener for Enter key in input field
document.getElementById('todoInput')?.addEventListener('keypress', (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

async function loadTodos(): Promise<void> {
    try {
        const response = await fetch('/api/todos');
        todos = await response.json() as Todo[];
        renderTodos();
    } catch (error) {
        console.error('Error loading todos:', error);
    }
}

async function addTodo(): Promise<void> {
    const input = document.getElementById('todoInput') as HTMLInputElement;
    const title = input.value.trim();
    
    if (!title) return;
    
    try {
        const response = await fetch('/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title }),
        });
        
        if (response.ok) {
            const newTodo = await response.json() as Todo;
            todos.push(newTodo);
            renderTodos();
            input.value = '';
        }
    } catch (error) {
        console.error('Error adding todo:', error);
    }
}

async function toggleTodo(id: number): Promise<void> {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    
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
    } catch (error) {
        console.error('Error toggling todo:', error);
    }
}

async function deleteTodo(id: number): Promise<void> {
    try {
        const response = await fetch(`/api/todos/${id}`, {
            method: 'DELETE',
        });
        
        if (response.ok) {
            todos = todos.filter(t => t.id !== id);
            renderTodos();
        }
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
}

function renderTodos(): void {
    const todoList = document.getElementById('todoList');
    if (!todoList) return;
    
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

function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make functions available globally for onclick handlers
(window as any).addTodo = addTodo;
(window as any).toggleTodo = toggleTodo;
(window as any).deleteTodo = deleteTodo;