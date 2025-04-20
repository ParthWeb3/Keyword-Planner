const express = require('express');
const router = express.Router();
const { redisClient } = require('../utils/redis');

router.get('/metrics', async (req, res) => {
  try {
    const [
      responseTimes,
      errorCount,
      totalRequests
    ] = await Promise.all([
      redisClient.lrange('chatgpt_response_times', 0, -1),
      redisClient.get('chatgpt_error_count'),
      redisClient.get('total_requests')
    ]);

    const times = responseTimes.map(Number);
    const p99 = times.sort((a, b) => a - b)[Math.floor(times.length * 0.99)];

    res.json({
      success: true,
      metrics: {
        totalRequests: Number(totalRequests) || 0,
        errorCount: Number(errorCount) || 0,
        p99ResponseTime: p99 || 0,
        errorRate: (Number(errorCount) / Number(totalRequests) * 100) || 0,
        slaBreaches: times.filter(t => t > 2500).length
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

module.exports = router; 