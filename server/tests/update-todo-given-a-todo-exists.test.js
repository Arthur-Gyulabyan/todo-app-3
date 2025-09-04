import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'update-todo-given-a-todo-exists.feature'));

defineFeature(feature, test => {
  let todoId;
  let originalTask;
  let originalCreatedAt;
  let originalUpdatedAt;
  let updateResponse;

  test(
    "Given a todo exists, when a client sends an 'Update Todo' command with a new task that is longer than 40 characters, then the todo's task should not be updated and an error indicating 'Task Too Long' should be returned.",
    ({ given, when, then }) => {
      given('a todo exists', async () => {
        const createTodoRequest = {
          task: 'Original task for todo creation'
        };

        const res = await request(app)
          .post('/api/v1/create-todo')
          .send(createTodoRequest);

        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBeDefined();
        expect(res.body.task).toEqual(createTodoRequest.task);

        todoId = res.body.id;
        originalTask = res.body.task;
        originalCreatedAt = res.body.createdAt;
        originalUpdatedAt = res.body.updatedAt;
      });

      when("a client sends an 'Update Todo' command with a new task that is longer than 40 characters", async () => {
        const longTask = 'This is a very very very very very very very very very long task for updating the todo that exceeds the maximum allowed length of 40 characters.'; // Length: 145 chars
        const updateTodoRequest = {
          id: todoId,
          task: longTask
        };

        updateResponse = await request(app)
          .post('/api/v1/update-todo')
          .send(updateTodoRequest);
      });

      then("the todo's task should not be updated and an error indicating 'Task Too Long' should be returned.", async () => {
        expect(updateResponse.statusCode).toBe(400);
        expect(updateResponse.body).toHaveProperty('message');
        // The OpenAPI spec only guarantees a 'message' field on 400.
        // If the implementation provides specific error messages, we can check for them.
        expect(updateResponse.body.message).toMatch(/task too long/i); // More robust check against a specific message, if the implementation provides it.

        // Verify the todo's task was not updated by fetching it again
        const getRes = await request(app)
          .get(`/api/v1/get-todo-by-id/${todoId}`);

        expect(getRes.statusCode).toBe(200);
        expect(getRes.body.id).toEqual(todoId);
        expect(getRes.body.task).toEqual(originalTask); // Task should remain the original one
        expect(getRes.body.createdAt).toEqual(originalCreatedAt);
        expect(getRes.body.updatedAt).toEqual(originalUpdatedAt); // updatedAt should also not change if the update failed
      });
    }
  );
});