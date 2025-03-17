const Joi = require('joi');
const KeywordSearch = require('../models/KeywordSearch');

class KeywordSearchService {
  static validateSearchData(data) {
    const schema = Joi.object({
      keyword: Joi.string().required(),
      searchResults: Joi.object({
        metrics: Joi.object({
          searchVolume: Joi.number().required(),
          cpc: Joi.number().required(),
          competition: Joi.string().required(),
        }).required(),
        relatedKeywords: Joi.array().items(Joi.string()).optional(),
      }).required(),
    });

    const { error } = schema.validate(data);
    if (error) {
      throw new Error(`Validation Error: ${error.message}`);
    }
  }

  static async saveSearchData(data) {
    this.validateSearchData(data);
    const keywordSearch = new KeywordSearch(data);
    await keywordSearch.save();
  }
}

module.exports = KeywordSearchService;
