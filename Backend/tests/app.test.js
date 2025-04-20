const request = require('supertest');
const app = require('../app');
const { redisClient } = require('../utils/redis');
const mongoose = require('mongoose');

describe('API Endpoints', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await redisClient.quit();
  });

  describe('GET /', () => {
    it('should return welcome message', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Welcome to the Keyword Planner API');
    });
  });
}); 