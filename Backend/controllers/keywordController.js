// backend/controllers/keywordController.js
const Keyword = require('../models/Keyword');
const { z } = require('zod');
const GoogleAdsService = require('../utils/googleApi');
const {
  GoogleAdsProvider,
  GoogleTrendsProvider,
  SEMrushProvider,
} = require('../utils/dataProvider');
const DataAggregator = require('../utils/aggregator');
const { ValidationError } = require('../utils/errors');
const Autocomplete = require('../utils/autocomplete');

// Initialize GoogleAdsService
const googleAdsService = new GoogleAdsService(
  process.env.GOOGLE_ADS_CLIENT_ID,
  process.env.GOOGLE_ADS_CLIENT_SECRET,
  process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
  process.env.REDIS_URL
);

// Initialize providers and aggregator
const googleAdsProvider = new GoogleAdsProvider(googleAdsService);
const googleTrendsProvider = new GoogleTrendsProvider(); // Placeholder
const semrushProvider = new SEMrushProvider(); // Placeholder
const dataAggregator = new DataAggregator([googleAdsProvider, googleTrendsProvider, semrushProvider]);

// Zod schema for input validation
const keywordSchema = z.object({
  keyword: z.string().min(1, 'Keyword is required'),
  location: z.string().default('US'),
  language: z.string().default('en-US'),
  searchNetwork: z.string().default('GOOGLE_SEARCH'),
});

// Initialize Autocomplete
const autocomplete = new Autocomplete();

// Preload keywords into the Trie (this can be replaced with a database fetch)
Keyword.find().then((keywords) => {
  keywords.forEach((keyword) => {
    autocomplete.addKeyword(keyword.keyword, keyword.searchVolume);
  });
});

// Get all keywords
exports.getKeywords = async (req, res) => {
  try {
    const keywords = await Keyword.find();
    res.status(200).json(keywords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single keyword
exports.getKeyword = async (req, res) => {
  try {
    const keyword = await Keyword.findOne({ term: req.params.term });
    if (!keyword) {
      return res.status(404).json({ message: 'Keyword not found' });
    }
    res.status(200).json(keyword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new keyword
exports.createKeyword = async (req, res) => {
  try {
    const keyword = new Keyword(req.body);
    const savedKeyword = await keyword.save();
    res.status(201).json(savedKeyword);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a keyword
exports.updateKeyword = async (req, res) => {
  try {
    const keyword = await Keyword.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!keyword) {
      return res.status(404).json({ message: 'Keyword not found' });
    }
    res.status(200).json(keyword);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a keyword
exports.deleteKeyword = async (req, res) => {
  try {
    const keyword = await Keyword.findByIdAndDelete(req.params.id);
    if (!keyword) {
      return res.status(404).json({ message: 'Keyword not found' });
    }
    res.status(200).json({ message: 'Keyword deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search for keyword suggestions
exports.findSuggestions = async (req, res) => {
  try {
    const { term } = req.query;
    if (!term) {
      return res.status(400).json({ message: 'Search term is required' });
    }

    const suggestions = autocomplete.getSuggestions(term);
    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.analyzeKeyword = async (req, res, next) => {
  try {
    // Validate and sanitize inputs
    const params = keywordSchema.parse(req.query);

    // Fetch aggregated data from multiple sources
    const unifiedData = await dataAggregator.fetchAggregatedData(params);

    // Enforce memory limit
    dataAggregator.enforceMemoryLimit(unifiedData);

    // Apply intelligent filtering
    const filters = {
      minSearchVolume: req.query.minSearchVolume ? parseInt(req.query.minSearchVolume) : null,
      maxCompetition: req.query.maxCompetition ? parseFloat(req.query.maxCompetition) : null,
    };

    // Stream processing for bulk requests
    if (req.body.bulkData) {
      const bulkStream = dataAggregator.processBulkRequests(req.body.bulkData, filters);
      bulkStream.pipe(res);
      return;
    }

    const filteredData = dataAggregator.filterResults(unifiedData, filters);

    // Pagination logic
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const paginatedSuggestions = filteredData.slice(startIndex, startIndex + limit);

    // Standardized response format
    const response = {
      success: true,
      data: {
        keywordSuggestions: paginatedSuggestions.map((item) => item.keyword),
        searchVolume: {
          current: params.keyword,
          historical: filteredData.map((item) => item.metrics.search_volume.current),
        },
        cpc: {
          min: Math.min(...filteredData.map((item) => item.metrics.cpc.min)),
          max: Math.max(...filteredData.map((item) => item.metrics.cpc.max)),
        },
        trends: {
          trend: filteredData[0]?.metrics.search_volume.trend || 'stable',
        },
      },
    };

    res.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new ValidationError('Invalid input parameters'));
    }
    next(error);
  }
};
