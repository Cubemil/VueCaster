const pino = require('pino');
const path = require('path');
const fs = require('fs');

const logDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const serverRequestsLogPath = path.resolve(logDir, 'server_requests.log');
const userActionsLogPath = path.resolve(logDir, 'user_actions.log');

const isDevelopment = process.env.NODE_ENV === 'development';

const requestLogger = pino(
  {
    level: process.env.LOG_LEVEL || 'info',
    transport: isDevelopment ? {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      }
    } : undefined,
  },
  pino.destination(serverRequestsLogPath)
);

const userActionsLogger = pino(
  {
    level: process.env.LOG_LEVEL || 'info',
    transport: isDevelopment ? {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      }
    } : undefined,
  },
  pino.destination(userActionsLogPath)
);

module.exports = requestLogger, userActionsLogger;