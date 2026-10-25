import 'dotenv/config';

import app from './app.js';
import config from './config/index.js';
import { logger } from './shared/index.js';
import { connectDatabases, disconnectDatabases } from './config/databases.js';

const startServer = async () => {
  try {
    logger.startup('Starting Todo API...');
    await connectDatabases();

    const server = app.listen(config.port, () => {
      logger.success(`Server running on port ${config.port}`);
      logger.info(`🔍 Health Check: http://localhost:${config.port}/${config.apiVersion}/health`);
      logger.info(`🌍 Environment: ${config.env}`);
    });

    server.on('error', (error) => {
      const message = error.code === 'EADDRINUSE'
        ? `Port ${config.port} is already in use`
        : `Server error: ${error.message}`;
      logger.error(message);
      process.exit(1);
    });

    const gracefulShutdown = (signal) => {
      logger.warn(`🛑 Received ${signal}, shutting down gracefully...`);

      server.close(async () => {
        try {
          await disconnectDatabases();
        } catch (error) {
          logger.error(`Error during database disconnect: ${error.message}`);
        }
        logger.success('Process terminated gracefully');
        process.exit(0);
      });

      setTimeout(() => {
        logger.error('⚠️ Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server', { error: error.message, stack: error.stack });
    process.exit(1);
  }
};

startServer();
