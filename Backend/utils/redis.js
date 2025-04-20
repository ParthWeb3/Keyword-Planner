const Redis = require('ioredis');
const { APIError } = require('./errors');
const config = require('../config/config');
const logger = require('./logger');

const redisClient = new Redis(config.redisUrl, {
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

redisClient.on('error', (error) => {
  logger.error('Redis Client Error:', error);
});

redisClient.on('connect', () => {
  logger.info('Redis Client Connected');
});

const rateLimiter = {
  async checkRateLimit(userId, limit = config.rateLimits.keywordAnalysis, duration = 3600) {
    try {
      const key = `rate_limit:${userId}`;
      const current = await redisClient.incr(key);
      
      if (current === 1) {
        await redisClient.expire(key, duration);
      }
      
      if (current > limit) {
        throw new APIError('Rate limit exceeded', {
          status: 429,
          resetIn: await redisClient.ttl(key)
        });
      }
      
      return current;
    } catch (error) {
      logger.error('Rate limiting error:', error);
      throw error;
    }
  }
};

module.exports = {
  redisClient,
  rateLimiter
}; 