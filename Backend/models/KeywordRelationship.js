const mongoose = require('mongoose');

const keywordRelationshipSchema = new mongoose.Schema({
  keyword: { type: mongoose.Schema.Types.ObjectId, ref: 'Keyword', required: true },
  relatedKeywords: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Keyword' }],
  synonyms: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('KeywordRelationship', keywordRelationshipSchema);
