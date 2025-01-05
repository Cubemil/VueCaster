const logger = require('../logger');

const logRequest = (req, res, next) => {
  const start = Date.now();

  // listen for response to finish
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, originalUrl } = req;
    const { statusCode } = res;

    logger.info({
      method,
      url: originalUrl,
      statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    }, 'Request completed');
  });
  
  next();
}

module.exports = { logRequest };