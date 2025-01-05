const pino = require('pino');
const path = require('path');
const fs = require('fs');

const logDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const serverRequestsLogPath = path.resolve(logDir, 'server_requests.log');
const userActionsLogPath = path.resolve(logDir, 'user_actions.log');

const requestLogger = pino({
  level: process.env.LOG_LEVEL || 'info',
}, pino.destination(serverRequestsLogPath));

const userActionsLogger = pino({
  level: process.env.LOG_LEVEL || 'info',
}, pino.destination(userActionsLogPath));

module.exports = { requestLogger, userActionsLogger };