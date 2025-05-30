const rateLimit = require('express-rate-limit');

/**
 * Rate limiting middleware to prevent abuse.
 * Adjust windowMs and max as needed.
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = limiter;