const { google } = require('googleapis'); // Import googleapis
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

    this.auth = new google.auth.OAuth2(clientId, clientSecret);
    this.auth.setCredentials({
      refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
    });

    this.apiEndpoint = 'https://googleads.googleapis.com/v13/customers/5212233347/googleAds:search';
  }

  async fetchKeywordData({ keyword }) {
    const cacheKey = `keyword:${keyword}`;
    const cachedData = await this.redisClient.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    try {
      const response = await google.ads({
        version: 'v13',
        auth: this.auth,
      }).customers.googleAds.search({
        customerId: process.env.GOOGLE_ADS_CUSTOMER_ID,
        requestBody: {
          query: `SELECT campaign.id, ad_group.id, metrics.impressions, metrics.clicks, metrics.average_cpc
                  FROM keyword_view
                  WHERE segments.keyword.info.text = '${keyword}'`,
        },
      });

      const formattedData = this.formatApiResponse(response.data);
      await this.redisClient.setex(cacheKey, 3600, JSON.stringify(formattedData)); // Cache for 1 hour
      return formattedData;
    } catch (error) {
      console.error('Error fetching keyword data:', error.message);
      throw new APIError('Failed to fetch keyword data from Google Ads API', 502);
    }
  }

  formatApiResponse(response) {
    return response.results.map((result) => ({
      keyword: result.text,
      avgMonthlySearches: result.metrics.avg_monthly_searches || 0,
      competition: result.metrics.competition_level || 'LOW',
      cpcRange: {
        min: result.metrics.low_top_of_page_bid_micros / 1e6 || 0,
        max: result.metrics.high_top_of_page_bid_micros / 1e6 || 0,
      },
    }));
  }
}

module.exports = GoogleAdsService;
