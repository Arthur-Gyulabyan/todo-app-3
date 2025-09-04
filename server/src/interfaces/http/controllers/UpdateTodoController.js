import express from 'express';
import UpdateTodoCommand from '../../../domain/command/UpdateTodoCommand.js';

const router = express.Router();
const routeBase = '/update-todo';

router.post('/', async (req, res) => {
  try {
    const { id, task } = req.body; // Extract id and task from request body as per OpenAPI
    const result = await UpdateTodoCommand.execute({ id, task });
    res.status(200).json(result); // OpenAPI specifies 200 for success
  } catch (err) {
    res.status(400).json({ message: err.message }); // OpenAPI specifies 400 for bad request
  }
});

export default {
  routeBase,
  router,
};