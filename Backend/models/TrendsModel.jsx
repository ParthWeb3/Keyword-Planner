const mongoose = require('mongoose');

const trendsSchema = new mongoose.Schema({
  keyword: { type: String, required: true },
  trends: [
    {
      month: { type: String, required: true },
      year: { type: Number, required: true },
      volume: { type: Number, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Trends', trendsSchema);
