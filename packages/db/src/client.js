import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

let writeClient;
let readClient;

const createClient = (connectionString) =>
  new PrismaClient({
    adapter: new PrismaPg({
      connectionString,
      max: parseInt(process.env.DATABASE_POOL_MAX, 10) || 10,
    }),
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

const getWriteDB = () => {
  if (!writeClient) {
    writeClient = createClient(process.env.DATABASE_URL);
  }
  return writeClient;
};

const getReadDB = () => {
  if (!process.env.DATABASE_READ_URL) {
    return getWriteDB();
  }
  if (!readClient) {
    readClient = createClient(process.env.DATABASE_READ_URL);
  }
  return readClient;
};

const disconnectDB = async () => {
  await Promise.all([writeClient?.$disconnect(), readClient?.$disconnect()]);
};

export { getWriteDB, getReadDB, disconnectDB };
