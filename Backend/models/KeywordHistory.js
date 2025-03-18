const mongoose = require('mongoose');

const keywordHistorySchema = new mongoose.Schema({
  keyword: { type: mongoose.Schema.Types.ObjectId, ref: 'Keyword', required: true },
  date: { type: Date, required: true },
  searchVolume: { type: Number, required: true },
  cpc: { type: Number, required: true },
  competition: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('KeywordHistory', keywordHistorySchema);
