// backend/controllers/keywordController.js
const Keyword = require('../models/Keyword');
const { z } = require('zod');
const KeywordService = require('../utils/chatGapi');
const { getKeywordSuggestions } = require('../services/chatgpt-service');
const { ValidationError } = require('../utils/errors');
const Autocomplete = require('../utils/autocomplete');

// Initialize KeywordService (no params needed now)
const keywordService = new KeywordService();

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
    console.error('Error fetching keywords:', error.message);
    res.status(500).json({ message: 'Failed to fetch keywords' });
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
    console.error('Error fetching keyword:', error.message);
    res.status(500).json({ message: 'Failed to fetch keyword' });
  }
};

// Create a new keyword
exports.createKeyword = async (req, res) => {
  try {
    const keyword = new Keyword(req.body);
    const savedKeyword = await keyword.save();
    res.status(201).json(savedKeyword);
  } catch (error) {
    console.error('Error creating keyword:', error.message);
    res.status(400).json({ message: 'Failed to create keyword' });
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
    console.error('Error updating keyword:', error.message);
    res.status(400).json({ message: 'Failed to update keyword' });
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
    console.error('Error deleting keyword:', error.message);
    res.status(500).json({ message: 'Failed to delete keyword' });
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
    const { keyword } = keywordSchema.parse(req.query);
    const keywordData = await keywordService.getKeywordData(keyword);
    const relatedKeywords = await keywordService.getRelatedKeywords(keyword);
    
    const response = {
      success: true,
      data: {
        mainKeyword: keywordData,
        relatedKeywords: relatedKeywords
      }
    };

    res.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new ValidationError('Invalid input parameters'));
    }
    next(error);
  }
};

// Add a new endpoint for related keywords only
exports.getRelatedKeywords = async (req, res, next) => {
  try {
    const { keyword } = keywordSchema.parse(req.query);
    const relatedKeywords = await keywordService.getRelatedKeywords(keyword);
    
    res.json({
      success: true,
      data: relatedKeywords
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new ValidationError('Invalid input parameters'));
    }
    next(error);
  }
};

exports.getKeywordTrends = async (req, res) => {
  try {
    const { id } = req.params;
    const keyword = await Keyword.findById(id);
    if (!keyword) {
      return res.status(404).json({ message: 'Keyword not found' });
    }
    res.status(200).json(keyword.searchVolumeTrends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
