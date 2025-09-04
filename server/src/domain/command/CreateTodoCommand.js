import Todo from '../entity/Todo.js';
import db from '../../infrastructure/db/index.js';
import { v4 as uuidv4 } from 'uuid';

class CreateTodoCommand {
  static async execute({ task }) {
    // GWT validation: "Given a client wants to create a new todo, when the task is longer than 40 characters, then the task should not be created."
    if (task && task.length > 40) {
      throw new Error('Task cannot be longer than 40 characters.');
    }

    const id = uuidv4();
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt; // For creation, createdAt and updatedAt are initially the same

    const todo = new Todo({ id, task, createdAt, updatedAt });
    await db.insert('Todo', todo.toJSON());
    return todo.toJSON();
  }
}

export default CreateTodoCommand;