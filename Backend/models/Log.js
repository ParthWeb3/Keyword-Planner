const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  level: { type: String, required: true, enum: ['info', 'error', 'warn'] },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  meta: { type: Object, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('Log', logSchema);
