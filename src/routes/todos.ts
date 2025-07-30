import { Router, Request, Response } from 'express';
import Database, { Todo } from '../../db/database';

const router = Router();
const db = new Database();

// Validation helper
const validateTodoTitle = (title: any): string | null => {
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return 'Title is required and must be a non-empty string';
  }
  return null;
};

// GET /api/todos - Get all todos
router.get('/', async (req: Request, res: Response) => {
  try {
    const todos = await db.getAllTodos();
    res.json(todos);
  } catch (error) {
    console.error('Error getting todos:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/todos - Create a new todo
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, completed } = req.body;

    // Validate title
    const titleError = validateTodoTitle(title);
    if (titleError) {
      return res.status(400).json({ error: titleError });
    }

    // Validate completed (optional, defaults to false)
    const isCompleted = completed === true || completed === 'true';

    const newTodo = await db.createTodo(title.trim(), isCompleted);
    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/todos/:id - Update an existing todo
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { title, completed } = req.body;

    // Validate ID
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid todo ID' });
    }

    // Validate title if provided
    if (title !== undefined) {
      const titleError = validateTodoTitle(title);
      if (titleError) {
        return res.status(400).json({ error: titleError });
      }
    }

    // Validate completed if provided
    let isCompleted: boolean | undefined;
    if (completed !== undefined) {
      isCompleted = completed === true || completed === 'true';
    }

    const updatedTodo = await db.updateTodo(
      id, 
      title ? title.trim() : undefined, 
      isCompleted
    );

    if (!updatedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/todos/:id - Delete a todo
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    // Validate ID
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid todo ID' });
    }

    const deleted = await db.deleteTodo(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(204).send(); // No content response for successful deletion
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;