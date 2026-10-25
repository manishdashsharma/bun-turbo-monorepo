import { getWriteDB, getReadDB, disconnectDB } from '@repo/db';
import logger from '../shared/utils/logger.js';

const connectDatabases = async () => {
  logger.info('Connecting to databases...');

  const writeDB = getWriteDB();
  const readDB = getReadDB();

  await writeDB.$connect();
  logger.success('PostgreSQL (write) connected');

  if (readDB !== writeDB) {
    await readDB.$connect();
    logger.success('PostgreSQL (read) connected');
  }
};

const checkDatabaseHealth = async () => {
  const health = {
    postgresql: { write: false, read: false, writeLatency: null, readLatency: null },
    errors: [],
  };

  try {
    const writeStart = Date.now();
    await getWriteDB().$queryRaw`SELECT 1`;
    health.postgresql.write = true;
    health.postgresql.writeLatency = Date.now() - writeStart;

    const readStart = Date.now();
    await getReadDB().$queryRaw`SELECT 1`;
    health.postgresql.read = true;
    health.postgresql.readLatency = Date.now() - readStart;
  } catch (error) {
    health.errors.push(`PostgreSQL: ${error.message}`);
  }

  return health;
};

const disconnectDatabases = async () => {
  await disconnectDB();
  logger.info('PostgreSQL disconnected');
};

export { connectDatabases, disconnectDatabases, checkDatabaseHealth, getWriteDB, getReadDB };
