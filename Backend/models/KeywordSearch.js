const mongoose = require('mongoose');

const keywordSearchSchema = new mongoose.Schema({
  keyword: { type: String, required: true },
  searchTimestamp: { type: Date, default: Date.now },
  searchResults: {
    metrics: {
      searchVolume: { type: Number, required: true },
      cpc: { type: Number, required: true },
      competition: { type: String, required: true },
    },
    relatedKeywords: { type: [String], default: [] },
  },
});

module.exports = mongoose.model('KeywordSearch', keywordSearchSchema);
