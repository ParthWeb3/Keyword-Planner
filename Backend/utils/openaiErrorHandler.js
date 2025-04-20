const { APIError } = require('./errors');

const OPENAI_ERROR_CODES = {
  'insufficient_quota': {
    status: 402,
    message: 'OpenAI API quota exceeded'
  },
  'rate_limit_exceeded': {
    status: 429,
    message: 'OpenAI rate limit exceeded'
  },
  'invalid_request_error': {
    status: 400,
    message: 'Invalid request to OpenAI API'
  }
};

const handleOpenAIError = (error) => {
  const errorCode = error.error?.code || 'unknown_error';
  const errorConfig = OPENAI_ERROR_CODES[errorCode] || {
    status: 500,
    message: 'ChatGPT service error'
  };

  throw new APIError(errorConfig.message, {
    status: errorConfig.status,
    cause: error,
    context: {
      errorCode,
      timestamp: new Date().toISOString()
    }
  });
};

module.exports = { handleOpenAIError }; 