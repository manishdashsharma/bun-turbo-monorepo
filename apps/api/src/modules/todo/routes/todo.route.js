import express from 'express';
import { validateRequest } from '../../../shared/index.js';
import { listTodos, createTodo, toggleTodo, deleteTodo } from '../controllers/todo.controller.js';
import {
  createTodoSchema,
  listTodosSchema,
  todoParamsSchema,
} from '../validations/todo.schema.js';

const router = express.Router();

router.get('/', validateRequest(listTodosSchema, 'query'), listTodos);
router.post('/', validateRequest(createTodoSchema, 'body'), createTodo);
router.post('/:id/toggle', validateRequest(todoParamsSchema, 'params'), toggleTodo);
router.post('/:id/delete', validateRequest(todoParamsSchema, 'params'), deleteTodo);

export default router;
