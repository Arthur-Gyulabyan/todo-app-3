import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'create-todo-task-longer-than-40-characters-not-created.feature'));

defineFeature(feature, test => {
  let response;
  const longTask = "This is a very very very very long task description that definitely exceeds forty characters according to the business rules specified in the OpenAPI specification.";

  test(
    'Given a client wants to create a new todo, when the task is longer than 40 characters, then the task should not be created.',
    ({ given, when, then }) => {
      given('a client wants to create a new todo', async () => {
        // No explicit action needed for this given, it sets the context.
      });

      when('the task is longer than 40 characters', async () => {
        response = await request(app)
          .post('/api/v1/create-todo')
          .send({ task: longTask })
          .set('Accept', 'application/json');
      });

      then('the task should not be created', async () => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('message');
        expect(typeof response.body.message).toBe('string');
      });
    }
  );
});