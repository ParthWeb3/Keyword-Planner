// backend/controllers/keywordController.js
const Keyword = require('../models/Keyword');

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
    
    const suggestions = await Keyword.find({
      term: { $regex: term, $options: 'i' }
    }).limit(10);
    
    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
