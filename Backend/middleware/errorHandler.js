const logger = require('../utils/logger');
const { APIError, ValidationError } = require('../utils/errors');

const errorHandler = (err, req, res, next) => {
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query
  });

  // Handle specific error types
  if (err instanceof APIError) {
    return res.status(err.status).json({
      error: {
        message: err.message,
        code: err.code,
        context: err.context
      }
    });
  }

  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: {
        message: err.message,
        details: err.details
      }
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: {
        message: 'Validation Error',
        details: err.errors
      }
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: {
        message: 'Invalid token'
      }
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: {
        message: 'Token expired'
      }
    });
  }

  // Default error response
  res.status(500).json({
    error: {
      message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    }
  });
};

module.exports = errorHandler;
