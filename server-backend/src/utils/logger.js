const pino = require('pino');
const path = require('path');
const fs = require('fs');

const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const requestLogPath = path.join(logDir, 'server_requests.log');
const userActionsLogPath = path.join(logDir, 'user_actions.log');

const requestLogger = pino(
  {
    level: process.env.LOG_LEVEL || 'info'
  },
  pino.destination(requestLogPath)
);

const userActionsLogger = pino(
  {
    level: process.env.LOG_LEVEL || 'info'
  },
  pino.destination(userActionsLogPath)
);

const consoleLogger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname'
    }
  }
});

module.exports = {
  requestLogger,
  userActionsLogger,
  consoleLogger
};