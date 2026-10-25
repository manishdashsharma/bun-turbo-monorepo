import logger from './logger.js';
import config from '../../config/index.js';
import { EApplicationEnvironment } from '../constant/application.js';

export const responseMessage = {
  ERROR: {
    SOMETHING_WENT_WRONG: 'Something went wrong',
    NOT_FOUND: 'Route not found',
    BAD_REQUEST: 'Bad request',
    VALIDATION_ERROR: 'Validation failed',
    INTERNAL_SERVER_ERROR: 'Internal server error',
  },
  SUCCESS: {
    DEFAULT: 'Success',
    CREATED: 'Resource created successfully',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',
    FETCHED: 'Resource fetched successfully',
    HEALTH_CHECK: 'Health check passed successfully',
    READY: 'Application is ready',
  },
  custom: (message) => message,
};

const UNEXPECTED_ERROR_MESSAGE = 'Something went wrong on our side. Please try again.';

const DATABASE_ERRORS = {
  P2000: [400, 'One of the values is too long.'],
  P2002: [409, 'This already exists.'],
  P2025: [404, 'This item no longer exists. Refresh and try again.'],
};

const isProduction = () => config.env === EApplicationEnvironment.PRODUCTION;

export const publicError = (err, statusCode = 500) => {
  const database = DATABASE_ERRORS[err?.code];
  if (database && !err.statusCode) {
    return { statusCode: database[0], message: database[1] };
  }
  const message = err instanceof Error ? err.message : '';
  const intended = statusCode < 500 || err?.statusCode >= 500 || err?.expose === true;
  if (message && intended) {
    return { statusCode, message };
  }
  return { statusCode: statusCode >= 500 ? statusCode : 500, message: UNEXPECTED_ERROR_MESSAGE };
};

export const httpResponse = (req, res, responseStatusCode, message, data = null) => {
  const response = {
    success: true,
    statusCode: responseStatusCode,
    request: {
      ip: req.ip || null,
      method: req.method,
      url: req.originalUrl,
    },
    message,
    data,
  };

  logger.info('CONTROLLER_RESPONSE', { meta: response, requestId: req.requestId });

  if (isProduction()) {
    delete response.request.ip;
  }

  return res.status(responseStatusCode).json(response);
};

export const errorObject = (err, req, errorStatusCode = 500) => {
  const { statusCode, message } = publicError(err, errorStatusCode);

  const errorObj = {
    success: false,
    statusCode,
    request: {
      ip: req.ip || null,
      method: req.method,
      url: req.originalUrl,
    },
    message,
    data: statusCode < 500 && err?.data ? err.data : null,
  };

  if (isProduction()) {
    delete errorObj.request.ip;
  } else if (err instanceof Error) {
    errorObj.trace = { error: err.stack };
  }

  return errorObj;
};

export const httpError = (req, res, err, errorStatusCode = 500) => {
  const errorObj = errorObject(err, req, errorStatusCode);

  logger.error('CONTROLLER_ERROR', {
    meta: errorObj,
    cause: err instanceof Error ? err.message : String(err),
    requestId: req.requestId,
  });

  return res.status(errorObj.statusCode).json(errorObj);
};
