import Database from 'sqlite3';
import { Database as DatabaseType } from 'sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '..', 'todos.db');

export const db: DatabaseType = new Database.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    
    // Create the todos table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed BOOLEAN DEFAULT 0
      )
    `, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Todos table ready.');
      }
    });
  }
});

export default db;