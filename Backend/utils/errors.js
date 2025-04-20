class APIError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = 'APIError';
    this.status = options.status || 500;
    this.cause = options.cause;
    this.context = options.context;
  }
}

class ValidationError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

module.exports = {
  APIError,
  ValidationError
};
