const OpenAI = require('openai');
const { APIError } = require('../utils/errors');
const { resilientAPICall } = require('../utils/apiUtils');
const { validateKeywordResponse } = require('../utils/validationSchemas');
const { rateLimiter } = require('../utils/redis');
const { handleOpenAIError } = require('../utils/openaiErrorHandler');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 10000,
  maxRetries: 3
});

const parseChatGPTResponse = (response) => {
  try {
    const content = response.choices[0].message.content;
    const parsedData = JSON.parse(content);
    
    // Validate the response format
    const validatedData = validateKeywordResponse(parsedData);
    return validatedData.keywords;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new APIError('Invalid ChatGPT response format', error);
    }
    throw new APIError('Failed to parse ChatGPT response', error);
  }
};

async function getKeywordSuggestions(seedKeyword, userId) {
  const startTime = Date.now();
  try {
    await rateLimiter.checkRateLimit(`chatgpt:${userId}`, 50);
    
    const response = await resilientAPICall(async () => {
      return await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{
          role: "user",
          content: `Generate 10 SEO keywords related to "${seedKeyword}" in JSON format with the following structure:
          {
            "keywords": [
              {
                "keyword": "the keyword",
                "searchVolume": "estimated monthly searches (a number between 100-10000)",
                "competition": "a number between 0-1",
                "cpc": "estimated cost per click (a number between 0.1-10)"
              }
            ]
          }`
        }],
        temperature: 0.7,
        response_format: { type: "json_object" }
      });
    });

    const responseTime = Date.now() - startTime;
    await redisClient.lpush('chatgpt_response_times', responseTime);
    await redisClient.ltrim('chatgpt_response_times', 0, 999); // Keep last 1000 times

    return parseChatGPTResponse(response);
  } catch (error) {
    const responseTime = Date.now() - startTime;
    await redisClient.incr('chatgpt_error_count');
    await redisClient.lpush('chatgpt_error_times', responseTime);
    
    handleOpenAIError(error);
  }
}

module.exports = {
  getKeywordSuggestions,
  parseChatGPTResponse // Export for testing
}; 