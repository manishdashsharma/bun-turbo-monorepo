import winston from 'winston';
import config from '../../config/index.js';
import { EApplicationEnvironment } from '../constant/application.js';

const isProduction = config.env === EApplicationEnvironment.PRODUCTION;

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'cyan',
  http: 'magenta',
  debug: 'white',
});

const developmentFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...meta } = info;
    const extra = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} ${level}: ${message}${extra}`;
  })
);

const productionFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const transports = [
  new winston.transports.Console({
    format: isProduction ? productionFormat : developmentFormat,
  }),
];

if (isProduction) {
  transports.push(
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  );
}

const logger = winston.createLogger({
  level: config.logging.level,
  levels,
  format: productionFormat,
  transports,
  exitOnError: false,
});

logger.startup = (message) => logger.info(`🚀 ${message}`);
logger.success = (message) => logger.info(`✅ ${message}`);
logger.request = (req, statusCode, duration) => {
  const level = statusCode >= 400 ? 'warn' : 'info';
  logger[level](`${req.method} ${req.originalUrl} ${statusCode} - ${duration}ms`);
};

export default logger;
