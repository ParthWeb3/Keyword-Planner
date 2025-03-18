const mongoose = require('mongoose');

const keywordSchema = new mongoose.Schema({
  keyword: { type: String, required: true },
  searchVolume: { type: Number, required: true },
  competition: { type: String, required: true },
  platform: { type: String },
  searchVolumeTrends: [
    {
      month: { type: String, required: true },
      year: { type: Number, required: true },
      volume: { type: Number, required: true },
    },
  ],
  deleted: { type: Boolean, default: false }, // Add soft delete field
}, { timestamps: true });
.exports = mongoose.model('Keyword', keywordSchema);
module.exports = mongoose.model('Keyword', keywordSchema);