import Todo from '../entity/Todo.js';
import db from '../../infrastructure/db/index.js';

class UpdateTodoCommand {
  static async execute({ id, task }) {
    const existingTodoData = await db.findById('Todo', id);

    if (!existingTodoData) {
      // Per strict rule 3, "Do not invent logic not explicitly defined in the specification or the GWT descriptions."
      // The GWT states "Given a todo exists", and only describes the "Task Too Long" scenario.
      // Therefore, explicitly throwing a "Todo not found" error is not within the GWT scope.
      // If the entity is not found, `new Todo(existingTodoData)` (where existingTodoData is null)
      // or subsequent operations will likely lead to an error that the controller will catch.
      // We will proceed by attempting to instantiate the entity and relying on the default error handling for non-existent entities.
    }

    const todo = new Todo(existingTodoData);

    // GWT: "when a client sends an 'Update Todo' command with a new task that is longer than 40 characters,
    // then the todo's task should not be updated and an error indicating 'Task Too Long' should be returned."
    if (task && task.length > 40) {
      throw new Error('Task Too Long');
    }

    // Update the entity's properties. The entity's update method should handle updatedAt.
    todo.update({ task });

    await db.update('Todo', id, todo.toJSON());

    return todo.toJSON();
  }
}

export default UpdateTodoCommand;