import {
  httpResponse,
  httpError,
  responseMessage,
  asyncHandler,
  logger,
} from '../../../shared/index.js';
import {
  listTodosService,
  createTodoService,
  toggleTodoService,
  deleteTodoService,
} from '../services/todo.service.js';

const listTodos = asyncHandler(async (req, res) => {
  try {
    const result = await listTodosService(req.query);
    return httpResponse(req, res, 200, responseMessage.custom('Todos fetched'), result);
  } catch (error) {
    logger.error('List todos failed', {
      stack: error.stack,
      requestId: req.requestId,
      error: error.message,
    });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const createTodo = asyncHandler(async (req, res) => {
  try {
    const todo = await createTodoService(req.body);
    logger.info('Todo created', { todoId: todo.id, requestId: req.requestId });
    return httpResponse(req, res, 201, responseMessage.custom('Todo created'), { todo });
  } catch (error) {
    logger.error('Create todo failed', {
      stack: error.stack,
      requestId: req.requestId,
      error: error.message,
    });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const toggleTodo = asyncHandler(async (req, res) => {
  try {
    const todo = await toggleTodoService(req.params.id);
    logger.info('Todo toggled', { todoId: todo.id, requestId: req.requestId });
    return httpResponse(req, res, 200, responseMessage.custom('Todo updated'), { todo });
  } catch (error) {
    logger.error('Toggle todo failed', {
      stack: error.stack,
      requestId: req.requestId,
      error: error.message,
    });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const deleteTodo = asyncHandler(async (req, res) => {
  try {
    await deleteTodoService(req.params.id);
    logger.info('Todo deleted', { todoId: req.params.id, requestId: req.requestId });
    return httpResponse(req, res, 200, responseMessage.custom('Todo deleted'));
  } catch (error) {
    logger.error('Delete todo failed', {
      stack: error.stack,
      requestId: req.requestId,
      error: error.message,
    });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

export { listTodos, createTodo, toggleTodo, deleteTodo };
