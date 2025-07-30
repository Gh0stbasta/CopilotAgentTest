"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = __importDefault(require("sqlite3"));
class Database {
    constructor() {
        this.db = new sqlite3_1.default.Database('todos.db', (err) => {
            if (err) {
                console.error('Error opening database:', err.message);
            }
            else {
                console.log('Connected to SQLite database');
                this.initTables();
            }
        });
    }
    initTables() {
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
            }
            else {
                console.log('Todos table ready');
            }
        });
    }
    // Get all todos
    async getAllTodos() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM todos ORDER BY id DESC', (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    // Convert Boolean values from SQLite (0/1) to actual booleans
                    const todos = rows.map(row => ({
                        ...row,
                        completed: Boolean(row.completed)
                    }));
                    resolve(todos);
                }
            });
        });
    }
    // Create a new todo
    async createTodo(title, completed = false) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare('INSERT INTO todos (title, completed) VALUES (?, ?)');
            stmt.run([title, completed ? 1 : 0], function (err) {
                if (err) {
                    reject(err);
                }
                else {
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
    async updateTodo(id, title, completed) {
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
                const existingTodo = row;
                const updatedTitle = title !== undefined ? title : existingTodo.title;
                const updatedCompleted = completed !== undefined ? completed : Boolean(existingTodo.completed);
                const stmt = this.db.prepare('UPDATE todos SET title = ?, completed = ? WHERE id = ?');
                stmt.run([updatedTitle, updatedCompleted ? 1 : 0, id], function (err) {
                    if (err) {
                        reject(err);
                    }
                    else {
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
    async deleteTodo(id) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare('DELETE FROM todos WHERE id = ?');
            stmt.run([id], function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(this.changes > 0);
                }
            });
            stmt.finalize();
        });
    }
    // Close database connection
    close() {
        this.db.close((err) => {
            if (err) {
                console.error('Error closing database:', err.message);
            }
            else {
                console.log('Database connection closed');
            }
        });
    }
}
exports.default = Database;
//# sourceMappingURL=database.js.map