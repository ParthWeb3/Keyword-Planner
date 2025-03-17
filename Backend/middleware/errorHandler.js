const { APIError, ValidationError } = require('../utils/errors');

const errorHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  if (err instanceof APIError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
  });
};

module.exports = errorHandler;
