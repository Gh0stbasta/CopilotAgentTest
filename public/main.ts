// Frontend TypeScript for Todo App
interface Todo {
  id?: number;
  title: string;
  completed: boolean;
}

class TodoApp {
  private apiBase = '/api/todos';
  private todoContainer: HTMLElement | null = null;
  private todoForm: HTMLFormElement | null = null;
  private todoInput: HTMLInputElement | null = null;
  private todos: Todo[] = [];

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    this.setupDOM();
    this.bindEvents();
    await this.loadTodos();
    this.renderTodos();
  }

  private setupDOM(): void {
    this.todoContainer = document.getElementById('todo-list');
    this.todoForm = document.getElementById('todo-form') as HTMLFormElement;
    this.todoInput = document.getElementById('todo-input') as HTMLInputElement;
  }

  private bindEvents(): void {
    if (this.todoForm) {
      this.todoForm.addEventListener('submit', this.handleSubmit.bind(this));
    }
  }

  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    
    if (!this.todoInput) return;
    
    const title = this.todoInput.value.trim();
    if (!title) return;

    try {
      await this.createTodo(title);
      this.todoInput.value = '';
      await this.loadTodos();
      this.renderTodos();
    } catch (error) {
      console.error('Error creating todo:', error);
      alert('Fehler beim Erstellen der Aufgabe');
    }
  }

  private async loadTodos(): Promise<void> {
    try {
      const response = await fetch(this.apiBase);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.todos = await response.json();
    } catch (error) {
      console.error('Error loading todos:', error);
      alert('Fehler beim Laden der Aufgaben');
    }
  }

  private async createTodo(title: string): Promise<void> {
    const response = await fetch(this.apiBase, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, completed: false }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  private async updateTodo(id: number, updates: Partial<Todo>): Promise<void> {
    const response = await fetch(`${this.apiBase}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  private async deleteTodo(id: number): Promise<void> {
    const response = await fetch(`${this.apiBase}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  private renderTodos(): void {
    if (!this.todoContainer) return;

    if (this.todos.length === 0) {
      this.todoContainer.innerHTML = '<p class="no-todos">Keine Aufgaben vorhanden</p>';
      return;
    }

    const todoHtml = this.todos.map(todo => `
      <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
        <div class="todo-content">
          <input 
            type="checkbox" 
            class="todo-checkbox" 
            ${todo.completed ? 'checked' : ''} 
            onchange="todoApp.toggleTodo(${todo.id}, this.checked)"
          >
          <span class="todo-title">${this.escapeHtml(todo.title)}</span>
        </div>
        <div class="todo-actions">
          <button class="edit-btn" onclick="todoApp.editTodo(${todo.id})">✏️</button>
          <button class="delete-btn" onclick="todoApp.deleteTodoHandler(${todo.id})">🗑️</button>
        </div>
      </div>
    `).join('');

    this.todoContainer.innerHTML = todoHtml;
  }

  public async toggleTodo(id: number, completed: boolean): Promise<void> {
    try {
      await this.updateTodo(id, { completed });
      await this.loadTodos();
      this.renderTodos();
    } catch (error) {
      console.error('Error toggling todo:', error);
      alert('Fehler beim Aktualisieren der Aufgabe');
    }
  }

  public async editTodo(id: number): Promise<void> {
    const todo = this.todos.find(t => t.id === id);
    if (!todo) return;

    const newTitle = prompt('Aufgabe bearbeiten:', todo.title);
    if (newTitle === null || newTitle.trim() === '') return;

    try {
      await this.updateTodo(id, { title: newTitle.trim() });
      await this.loadTodos();
      this.renderTodos();
    } catch (error) {
      console.error('Error editing todo:', error);
      alert('Fehler beim Bearbeiten der Aufgabe');
    }
  }

  public async deleteTodoHandler(id: number): Promise<void> {
    if (!confirm('Möchten Sie diese Aufgabe wirklich löschen?')) return;

    try {
      await this.deleteTodo(id);
      await this.loadTodos();
      this.renderTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
      alert('Fehler beim Löschen der Aufgabe');
    }
  }

  private escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

// Global instance for event handlers
let todoApp: TodoApp;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  todoApp = new TodoApp();
});