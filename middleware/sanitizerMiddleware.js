const { sanitizeBody } = require('express-validator');

const { body, query, param, validationResult } = require('express-validator');

const sanitize = [
  body('*').trim().escape(),
  query('*').trim().escape(),
  param('*').trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Sanitization error', details: errors.array() });
    }
    next();
  }
];

module.exports = sanitize;