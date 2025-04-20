const { rateLimiter } = require('../utils/redis');
const { APIError } = require('../utils/errors');

const rateLimitMiddleware = async (req, res, next) => {
  try {
    // Use IP address if no user ID available
    const identifier = req.user?.id || req.ip;
    
    // Different limits for different endpoints
    const limits = {
      '/api/keywords/analyze': 100,
      '/api/keywords/suggestions': 200,
      default: 1000
    };

    const limit = limits[req.path] || limits.default;
    const current = await rateLimiter.checkRateLimit(identifier, limit);
    
    // Add rate limit headers
    res.set({
      'X-RateLimit-Limit': limit,
      'X-RateLimit-Remaining': Math.max(0, limit - current)
    });
    
    next();
  } catch (error) {
    if (error instanceof APIError && error.status === 429) {
      res.status(429).json({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded',
        resetIn: error.resetIn
      });
    } else {
      next(error);
    }
  }
};

module.exports = rateLimitMiddleware; 