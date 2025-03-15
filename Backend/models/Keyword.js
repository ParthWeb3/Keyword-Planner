// backend/models/Keyword.js
const mongoose = require('mongoose');

const keywordSchema = new mongoose.Schema({
  term: {
    type: String,
    required: true,
    trim: true
  },
  searchVolume: {
    type: Number,
    default: 0
  },
  competition: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  cpc: {
    type: Number,
    default: 0.0
  },
  relatedTerms: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for faster searches
keywordSchema.index({ term: 1 });

module.exports = mongoose.model('Keyword', keywordSchema);
