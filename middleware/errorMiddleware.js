
function errorHandler(err, req, res, next) {
  // Log error stack for debugging
  console.error('Error:', err.stack || err);

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