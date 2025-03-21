const OpenAI = require('openai');
const redis = require('redis');
const util = require('util');
const { APIError } = require('./errors');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use only the ChatGPT API key
  timeout: 10000,
  maxRetries: 3,
});

class GoogleAdsService {
  constructor(redisUrl) {
    this.redisClient = redis.createClient({ url: redisUrl });
    this.redisClient.get = util.promisify(this.redisClient.get);
    this.redisClient.setex = util.promisify(this.redisClient.setex);
  }

  async fetchKeywordData({ keyword }) {
    const cacheKey = `keyword:${keyword}`;
    try {
      const cachedData = await this.redisClient.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
    } catch (error) {
      console.error('Error fetching data from Redis:', error.message);
    }

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "user",
            content: `Generate 10 SEO keywords related to ${keyword} with search volume estimates in JSON format`,
          },
        ],
        temperature: 0.7,
        stream: true, // Enable streaming for faster response
      });

      let result = '';
      for await (const chunk of response) {
        result += chunk.choices[0].delta.content || '';
      }

      const jsonMatch = result.match(/```json([\s\S]*?)```/);
      if (!jsonMatch) throw new Error("ChatGPT response format error");
      const formattedData = JSON.parse(jsonMatch[1]);

      try {
        await this.redisClient.setex(cacheKey, 3600, JSON.stringify(formattedData)); // Cache for 1 hour
      } catch (error) {
        console.error('Error saving data to Redis:', error.message);
      }

      return formattedData;
    } catch (error) {
      console.error("Error fetching keyword suggestions from ChatGPT API:", error.message);
      throw new APIError('Failed to fetch keyword suggestions from ChatGPT API', 502);
    }
  }
}

module.exports = GoogleAdsService;
