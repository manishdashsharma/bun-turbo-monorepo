import logger from '../utils/logger.js';
import { errorObject } from '../utils/response.js';

const errorHandler = (err, req, res, _next) => {
  logger.error(`Error ${req.method} ${req.originalUrl}`, {
    error: err.message,
    stack: err.stack,
    requestId: req.requestId,
  });

  const statusCode = err.type === 'entity.parse.failed' ? 400 : err.statusCode || err.status || 500;
  const errorObj = errorObject(err, req, statusCode);
  return res.status(errorObj.statusCode).json(errorObj);
};

const notFoundHandler = (req, res, _next) => {
  const message = `Route ${req.originalUrl} not found`;
  logger.warn(`404 - ${message}`, { requestId: req.requestId });

  const errorObj = errorObject(new Error(message), req, 404);
  return res.status(404).json(errorObj);
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export { errorHandler, notFoundHandler, asyncHandler };
