const fs = require('fs');
const path = require('path');

// get file name from the command line argument
const fileName = process.argv[2];
const logFilePath = path.join(__dirname, '..', 'logs', fileName);

fs.readFileSync(logFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error(`Failed to read ${fileName} log file:`, err);
    return;
  }

  const logLines = data.trim().split('\n');

  logLines.forEach((line) => {
    try {
      const log = JSON.parse(line);
      const level = pino.levels.labels[log.level] || 'UNKNOWN';
      const timestamp = new Date(log.time).toISOString();
      console.log(`[${timestamp}] ${level}: ${log.msg}`, log);
    } catch (error) {
      console.error('Failed to parse log line:', error);
    }
  });
});