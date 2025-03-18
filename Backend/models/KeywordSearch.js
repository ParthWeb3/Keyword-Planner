const mongoose = require('mongoose');

const keywordSearchSchema = new mongoose.Schema({
  keyword: { type: mongoose.Schema.Types.ObjectId, ref: 'Keyword', required: true },
  searchTimestamp: { type: Date, default: Date.now },
  searchResults: {
    metrics: {
      searchVolume: { type: Number, required: true, min: 0 },
      cpc: { type: Number, required: true, min: 0 },
      competition: { type: String, required: true, enum: ['low', 'medium', 'high'] },
    },
    relatedKeywords: { 
      type: [String], 
      default: [], 
      validate: {
        validator: function(v) {
          return v.length <= 10;
        },
        message: props => `Related keywords exceed the limit of 10`
      }
    },
  },
}, { timestamps: true }); // Add timestamps

module.exports = mongoose.model('KeywordSearch', keywordSearchSchema);
