// /middleware/requestLogger.js

const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

// Ensure logs directory exists
const logDir = path.join(__dirname, '../logs');

// Configure winston transports
const transport = new winston.transports.DailyRotateFile({
  dirname: logDir,
  filename: 'request-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d', // Keep logs for 14 days
  level: 'info',
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, level, message }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`
    )
  ),
  transports: [
    transport,
    new winston.transports.Console()
  ],
});

function requestLogger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logEntry = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;
    logger.info(logEntry);
  });
  next();
}

module.exports = requestLogger;