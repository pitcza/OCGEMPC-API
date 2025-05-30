const Joi = require('joi');

/**
 * Middleware for validating request bodies using Joi schemas.
 * @param {Joi.Schema} schema - Joi validation schema.
 * @param {string} property - Request property to validate (default: 'body').
 */
function validate(schema, property = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], { abortEarly: false, stripUnknown: true });
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(d => d.message)
      });
    }
    req[property] = value;
    next();
  };
}

module.exports = validate;