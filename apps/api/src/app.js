import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { randomUUID } from 'crypto';

import config from './config/index.js';
import { logger, errorHandler, notFoundHandler, httpResponse } from './shared/index.js';
import router from './router/index.js';

const app = express();

app.set('trust proxy', 1);

app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = config.cors.origins;
      const allowed = !origin
        || allowedOrigins.includes('*')
        || allowedOrigins.includes(origin);
      callback(null, allowed);
    },
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use((req, res, next) => {
  req.requestId = randomUUID();
  res.setHeader('X-Request-ID', req.requestId);
  next();
});

app.use((req, res, next) => {
  const startTime = Date.now();
  res.on('finish', () => logger.request(req, res.statusCode, Date.now() - startTime));
  next();
});

app.get('/', (req, res) => {
  return httpResponse(req, res, 200, 'Todo API', {
    name: 'Todo API',
    version: config.apiVersion,
    environment: config.env,
    health: `/${config.apiVersion}/health`,
  });
});

app.use(`/${config.apiVersion}`, router);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
