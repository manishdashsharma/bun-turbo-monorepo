import { checkDatabaseHealth } from '../../../config/databases.js';
import { httpResponse, httpError, responseMessage, asyncHandler } from '../../../shared/index.js';
import config from '../../../config/index.js';

const healthCheck = asyncHandler(async (req, res) => {
  return httpResponse(req, res, 200, responseMessage.SUCCESS.HEALTH_CHECK, {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.env,
  });
});

const readyCheck = asyncHandler(async (req, res) => {
  const databases = await checkDatabaseHealth();
  const isReady = databases.postgresql.write && databases.postgresql.read;

  if (!isReady) {
    return httpError(req, res, new Error('Service is not ready'), 503);
  }

  return httpResponse(req, res, 200, responseMessage.SUCCESS.READY, {
    status: 'ready',
    databases,
  });
});

export { healthCheck, readyCheck };
