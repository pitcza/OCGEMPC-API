const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

// Configure Winston for error logging with daily rotation
const logDir = path.join(__dirname, '../logs');
const errorTransport = new winston.transports.DailyRotateFile({
  dirname: logDir,
  filename: 'error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d', // Keep error logs for 30 days
  level: 'error',
});

const errorLogger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.printf(
      ({ timestamp, level, message, stack }) =>
        `[${timestamp}] ${level.toUpperCase()}: ${message}${stack ? `\n${stack}` : ''}`
    )
  ),
  transports: [
    errorTransport,
    new winston.transports.Console()
  ],
});

function errorHandler(err, req, res, next) {
  // Log error details with Winston
  errorLogger.error(
    `${req.method} ${req.originalUrl} - ${err.message}`,
    { stack: err.stack }
  );

  // Handle Joi validation errors
  if (err.isJoi) {
    return res.status(400).json({
      error: 'Validation error',
      details: err.details.map(d => d.message)
    });
  }

  // Handle custom errors with status
  if (err.status) {
    return res.status(err.status).json({
      error: err.message || 'Error',
      details: err.details || undefined
    });
  }

  // Fallback for unhandled errors
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'Something broke!'
  });
}

module.exports = errorHandler;