const Joi = require('joi');
const { FourierTransform } = require('fourier-transform'); // Placeholder for Fourier transform library
// const Word2Vec = require('word2vec'); // Removed as it's not installed
const redis = require('redis');
const { promisify } = require('util');
const { Transform } = require('stream');

class DataAggregator {
  constructor(providers) {
    this.providers = providers; // Array of DataProvider instances
    this.redisClient = redis.createClient();
    this.redisGet = promisify(this.redisClient.get).bind(this.redisClient);
    this.redisSetex = promisify(this.redisClient.setex).bind(this.redisClient);
    this.memoizedScores = new Map(); // Memoization cache for score calculations
  }

  async fetchAggregatedData(params) {
    const cacheKey = `aggregated:${JSON.stringify(params)}`;
    const cachedData = await this.redisGet(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const results = await Promise.all(
      this.providers.map((provider) => provider.fetchKeywordData(params))
    );

    const mergedResults = this.mergeResults(results.flat());
    const validatedResults = this.validateData(mergedResults);
    const enrichedResults = this.enrichKeywords(validatedResults);

    // Parallelize scoring and trend analysis
    const [scoredResults, trendAnalyzedResults] = await Promise.all([
      this.calculateScores(enrichedResults),
      this.analyzeTrends(enrichedResults),
    ]);

    const unifiedResults = this.transformToUnifiedFormat(scoredResults);
    await this.redisSetex(cacheKey, 7200, JSON.stringify(unifiedResults)); // Cache for 2 hours
    return unifiedResults;
  }

  mergeResults(results) {
    const merged = {};

    results.forEach((result) => {
      const key = result.keyword.toLowerCase();
      if (!merged[key]) {
        merged[key] = { ...result, sources: [result.source] };
      } else {
        merged[key].avgMonthlySearches += result.avgMonthlySearches;
        merged[key].sources.push(result.source);
      }
    });

    return Object.values(merged).map((item) => ({
      ...item,
      avgMonthlySearches: Math.round(item.avgMonthlySearches / item.sources.length),
    }));
  }

  // Stage 1: Data Validation
  validateData(data) {
    const schema = Joi.object({
      keyword: Joi.string().trim().lowercase().required(),
      avgMonthlySearches: Joi.number().min(1000).required(),
      competition: Joi.number().min(0.1).max(0.9).required(),
      avgCPC: Joi.number().optional(),
      relatedKeywords: Joi.array().items(Joi.string()).optional(),
    });

    return data.filter((item) => {
      const { error } = schema.validate(item);
      return !error;
    });
  }

  // Stage 2: Trend Analysis
  analyzeTrends(data) {
    return data.map((item) => {
      const searchVolume = item.searchVolumeTrends || [];
      const movingAverage = this.calculateMovingAverage(searchVolume, 6);
      const trend = this.classifyTrend(searchVolume);

      return {
        ...item,
        movingAverage,
        trend,
      };
    });
  }

  calculateMovingAverage(data, period) {
    if (!Array.isArray(data) || data.length < period) return null;
    return data.slice(-period).reduce((sum, val) => sum + (val.volume || 0), 0) / period;
  }

  classifyTrend(data) {
    if (!Array.isArray(data) || data.length < 2) return 'Stable';
    const lastMonth = data[data.length - 1]?.volume || 0;
    const prevMonth = data[data.length - 2]?.volume || 0;

    if (prevMonth === 0) return 'Stable'; // Avoid division by zero
    const growthRate = ((lastMonth - prevMonth) / prevMonth) * 100;

    if (growthRate > 15) return 'Rising';
    if (growthRate < -15) return 'Declining';
    return 'Stable';
  }

  // Stage 3: Keyword Enrichment
  enrichKeywords(data) {
    return data.map((item) => {
      // const lsiKeywords = this.generateLSIKeywords(item.keyword); // Removed
      const competitors = this.extractCompetitors(item.relatedKeywords);

      return {
        ...item,
        // lsiKeywords, // Removed
        competitors,
      };
    });
  }

  // Removed generateLSIKeywords method as it depends on Word2Vec
  // generateLSIKeywords(keyword) {
  //   return Word2Vec.getSimilarWords(keyword, 5);
  // }

  // Stage 4: Score Calculation
  calculateScores(data) {
    return data.map((item) => {
      const cacheKey = `${item.keyword}:${item.avgMonthlySearches}:${item.competition}:${item.avgCPC}`;
      if (this.memoizedScores.has(cacheKey)) {
        return { ...item, score: this.memoizedScores.get(cacheKey) };
      }

      const score =
        Math.pow(item.avgMonthlySearches, 0.7) *
        (1 - item.competition) *
        Math.pow(item.avgCPC || 1, 0.3);

      const normalizedScore = this.normalizeScore(score, data);
      this.memoizedScores.set(cacheKey, normalizedScore);
      return { ...item, score: normalizedScore };
    });
  }

  normalizeScore(score, data) {
    const scores = data.map((item) => item.score || 0);
    const min = Math.min(...scores);
    const max = Math.max(...scores);

    return ((score - min) / (max - min)) * 100;
  }

  // New method for raw data ingestion
  ingestRawData(rawData) {
    return rawData.map((data) => ({
      keyword: data.keyword,
      avgMonthlySearches: data.metrics.monthly_searches.reduce((a, b) => a + b, 0) / data.metrics.monthly_searches.length,
      avgCPC: data.metrics.avg_cpc,
      competition: data.metrics.competition,
      relatedKeywords: data.metrics.related_keywords,
      source: 'raw',
    }));
  }

  // New method for intelligent filtering
  filterResults(results, filters = {}) {
    const { minSearchVolume = 0, maxCompetition = 1 } = filters; // Provide default values
    return results.filter((result) => {
      const meetsSearchVolume = result.avgMonthlySearches >= minSearchVolume;
      const meetsCompetition = result.competition <= maxCompetition;
      return meetsSearchVolume && meetsCompetition;
    }).filter(Boolean); // Ensure no null or undefined results
  }

  // Transform results to unified format
  transformToUnifiedFormat(data) {
    return data.map((item) => ({
      keyword: item.keyword,
      metrics: {
        search_volume: item.searchVolume,
        difficulty: item.difficulty,
      },
    }));
  }

  // Stream processing for bulk requests
  processBulkRequests(stream, filters) {
    const transformStream = new Transform({
      objectMode: true,
      transform: (chunk, encoding, callback) => {
        const filtered = this.filterResults([chunk], filters);
        callback(null, filtered.length ? filtered[0] : null);
      }
    });

    return stream.pipe(transformStream);
  }

  // Memory management: Ensure request size does not exceed 50MB
  enforceMemoryLimit(data) {
    const sizeInBytes = Buffer.byteLength(JSON.stringify(data));
    if (sizeInBytes > 50 * 1024 * 1024) {
      throw new Error('Request exceeds memory limit of 50MB');
    }
    return data;
  }
}

module.exports = DataAggregator;
