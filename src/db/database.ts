import sqlite3 from 'sqlite3';
import { promisify } from 'util';

export interface Todo {
  id?: number;
  title: string;
  completed: boolean;
}

class Database {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database('todos.db', (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
      } else {
        console.log('Connected to SQLite database');
        this.initTables();
      }
    });
  }

  private initTables(): void {
    const createTodosTable = `
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed BOOLEAN DEFAULT 0
      )
    `;

    this.db.run(createTodosTable, (err) => {
      if (err) {
        console.error('Error creating todos table:', err.message);
      } else {
        console.log('Todos table ready');
      }
    });
  }

  // Get all todos
  async getAllTodos(): Promise<Todo[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM todos ORDER BY id DESC', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          // Convert Boolean values from SQLite (0/1) to actual booleans
          const todos = (rows as any[]).map(row => ({
            ...row,
            completed: Boolean(row.completed)
          }));
          resolve(todos);
        }
      });
    });
  }

  // Create a new todo
  async createTodo(title: string, completed: boolean = false): Promise<Todo> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare('INSERT INTO todos (title, completed) VALUES (?, ?)');
      stmt.run([title, completed ? 1 : 0], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: this.lastID,
            title,
            completed
          });
        }
      });
      stmt.finalize();
    });
  }

  // Update a todo
  async updateTodo(id: number, title?: string, completed?: boolean): Promise<Todo | null> {
    return new Promise((resolve, reject) => {
      // First check if todo exists
      this.db.get('SELECT * FROM todos WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (!row) {
          resolve(null);
          return;
        }

        const existingTodo = row as any;
        const updatedTitle = title !== undefined ? title : existingTodo.title;
        const updatedCompleted = completed !== undefined ? completed : Boolean(existingTodo.completed);

        const stmt = this.db.prepare('UPDATE todos SET title = ?, completed = ? WHERE id = ?');
        stmt.run([updatedTitle, updatedCompleted ? 1 : 0, id], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              id,
              title: updatedTitle,
              completed: updatedCompleted
            });
          }
        });
        stmt.finalize();
      });
    });
  }

  // Delete a todo
  async deleteTodo(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare('DELETE FROM todos WHERE id = ?');
      stmt.run([id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
      stmt.finalize();
    });
  }

  // Close database connection
  close(): void {
    this.db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed');
      }
    });
  }
}

export default Database;