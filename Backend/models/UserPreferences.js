const mongoose = require('mongoose');

const userPreferencesSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  language: { type: String, default: 'English' },
  theme: { type: String, enum: ['light', 'dark'], default: 'light' },
  notifications: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('UserPreferences', userPreferencesSchema);
