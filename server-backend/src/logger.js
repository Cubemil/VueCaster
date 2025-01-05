const pino = require('pino');
const path = require('path');
const fs = require('fs');

const logDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
const logFilePath = path.resolve(logDir, 'server.log');

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
}, pino.destination(logFilePath));

module.exports = logger;