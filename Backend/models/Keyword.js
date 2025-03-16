// backend/models/Keyword.js
const mongoose = require('mongoose');

const keywordSchema = new mongoose.Schema({
  keyword: { type: String, required: true },
  searchVolume: { type: Number, required: true },
  competition: { type: String, required: true },
  platform: { type: String },
  searchVolumeTrends: [
    {
      month: { type: String },
      year: { type: Number },
      volume: { type: Number },
    },
  ],
});

module.exports = mongoose.model('Keyword', keywordSchema);
