import { Router, Request, Response } from 'express';
import db from '../../db/database';

const router = Router();

// GET /api/todos - Get all todos
router.get('/', (req: Request, res: Response) => {
  const sql = 'SELECT * FROM todos ORDER BY id';
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Convert SQLite boolean (0/1) to JavaScript boolean
    const todos = rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      completed: Boolean(row.completed)
    }));
    
    res.json(todos);
  });
});

// POST /api/todos - Create new todo
router.post('/', (req: Request, res: Response) => {
  const { title } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  const sql = 'INSERT INTO todos (title, completed) VALUES (?, ?)';
  db.run(sql, [title, false], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    res.status(201).json({
      id: this.lastID,
      title,
      completed: false
    });
  });
});

// PUT /api/todos/:id - Update todo
router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  
  const sql = 'UPDATE todos SET title = ?, completed = ? WHERE id = ?';
  db.run(sql, [title, completed, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json({
      id: parseInt(id),
      title,
      completed
    });
  });
});

// DELETE /api/todos/:id - Delete todo
router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  
  const sql = 'DELETE FROM todos WHERE id = ?';
  db.run(sql, [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.status(204).send();
  });
});

export default router;