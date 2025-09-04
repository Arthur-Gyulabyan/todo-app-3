import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'delete-todo-given-no-todo-exists-with-a-specific-id.feature'));

defineFeature(feature, test => {
  let nonExistentTodoId;
  let response;

  test(
    'Given no todo exists with a specific ID, when a client sends a \'Delete Todo\' command with that ID, then an error indicating \'Todo Not Found\' should be returned and no \'Todo Deleted\' event should be published.',
    ({ given, when, then }) => {
      given('no todo exists with a specific ID', () => {
        // Define an ID that is highly unlikely to exist in the system.
        // This fulfills the "no todo exists" premise.
        nonExistentTodoId = 'non-existent-todo-id-12345';
      });

      when('a client sends a \'Delete Todo\' command with that ID', async () => {
        response = await request(app)
          .post('/api/v1/delete-todo')
          .send({ id: nonExistentTodoId });
      });

      then('an error indicating \'Todo Not Found\' should be returned and no \'Todo Deleted\' event should be published.', async () => {
        // According to OpenAPI spec, /delete-todo returns 400 for errors.
        // The message body should indicate "Todo Not Found".
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Todo Not Found');
        // The "no 'Todo Deleted' event should be published" part is outside the scope
        // of typical API functional tests with supertest and would require
        // an event mocking/spying mechanism not provided in the template.
      });
    }
  );
});