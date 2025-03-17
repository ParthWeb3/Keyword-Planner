const { GoogleAdsApi } = require('@google-ads/api');
const redis = require('redis');
const util = require('util');
const { APIError } = require('./errors');

class GoogleAdsService {
  constructor(clientId, clientSecret, developerToken, redisUrl) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.developerToken = developerToken;
    this.redisClient = redis.createClient({ url: redisUrl });
    this.redisClient.get = util.promisify(this.redisClient.get);
    this.redisClient.setex = util.promisify(this.redisClient.setex);

    this.googleAdsApi = new GoogleAdsApi({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      developer_token: this.developerToken,
    });

    this.failureCount = 0;
    this.circuitBreakerOpen = false;
    this.maxFailures = 3;
    this.resetTimeout = 30000; // 30 seconds
  }

  async fetchKeywordData({ keyword, location, language, searchNetwork }) {
    if (this.circuitBreakerOpen) {
      throw new APIError('Circuit breaker is open. External API unavailable.', 503);
    }

    const cacheKey = `keyword:${keyword}:${location}:${language}:${searchNetwork}`;
    const cachedData = await this.redisClient.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    let attempts = 0;
    while (attempts < 3) {
      try {
        const customer = this.googleAdsApi.Customer({
          customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID,
          refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
        });

        const response = await customer.keywordPlanIdeas({
          keyword_texts: [keyword],
          geo_target_constants: [location],
          language: language,
          network: searchNetwork,
        });

        const formattedData = this.formatApiResponse(response);
        await this.redisClient.setex(cacheKey, 3600, JSON.stringify(formattedData)); // Cache for 1 hour
        this.resetCircuitBreaker();
        return formattedData;
      } catch (error) {
        attempts++;
        console.error(`Attempt ${attempts} failed:`, error.message);
        if (attempts >= 3) {
          this.recordFailure();
          throw new APIError('Failed to fetch keyword data from Google Ads API', 502);
        }
      }
    }
  }

  recordFailure() {
    this.failureCount++;
    if (this.failureCount >= this.maxFailures) {
      this.circuitBreakerOpen = true;
      console.error('Circuit breaker opened. External API calls disabled.');
      setTimeout(() => this.resetCircuitBreaker(), this.resetTimeout);
    }
  }

  resetCircuitBreaker() {
    this.failureCount = 0;
    this.circuitBreakerOpen = false;
    console.log('Circuit breaker reset. External API calls re-enabled.');
  }

  formatApiResponse(response) {
    return response.results.map((result) => ({
      keyword: result.text,
      avgMonthlySearches: result.keyword_idea_metrics.avg_monthly_searches || 0,
      competition: result.keyword_idea_metrics.competition_level || 'LOW',
      cpcRange: {
        min: result.keyword_idea_metrics.low_top_of_page_bid_micros / 1e6 || 0,
        max: result.keyword_idea_metrics.high_top_of_page_bid_micros / 1e6 || 0,
      },
      relatedKeywords: result.keyword_idea_metrics.related_keywords || [],
      source: 'Google Ads',
    }));
  }
}

module.exports = GoogleAdsService;
