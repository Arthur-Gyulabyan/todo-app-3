import db from '../../infrastructure/db/index.js';

class DeleteTodoCommand {
  static async execute({ id }) {
    const todo = await db.findById('Todo', id);

    if (!todo) {
      throw new Error('Todo Not Found');
    }

    await db.remove('Todo', id);
    return todo;
  }
}

export default DeleteTodoCommand;