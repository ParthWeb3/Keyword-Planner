const { getKeywordSuggestions } = require('../services/chatgpt-service');
const { APIError } = require('./errors');
const { resilientAPICall } = require('./apiUtils');
const { KeywordSchema } = require('./validationSchemas');
const { z } = require('zod');

class KeywordService {
  constructor() {
    // No need for constructor parameters anymore
  }
  
  async getKeywordData(keyword) {
    try {
      const suggestions = await resilientAPICall(async () => {
        return await getKeywordSuggestions(keyword);
      });
      
      // Transform and validate the data
      const keywordData = suggestions.find(k => k.keyword.toLowerCase() === keyword.toLowerCase());
      
      if (keywordData) {
        return KeywordSchema.parse({
          keyword: keywordData.keyword,
          searchVolume: parseInt(keywordData.searchVolume),
          competition: parseFloat(keywordData.competition),
          cpc: parseFloat(keywordData.cpc)
        });
      }
      
      // Return and validate mock data
      return KeywordSchema.parse({
        keyword,
        searchVolume: Math.floor(Math.random() * 9900) + 100, // Between 100-10000
        competition: Math.random(),
        cpc: (Math.random() * 9.9) + 0.1 // Between 0.1-10
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new APIError('Invalid keyword data format', error);
      }
      throw new APIError('Failed to fetch keyword data', error);
    }
  }

  async getRelatedKeywords(keyword) {
    try {
      const suggestions = await resilientAPICall(async () => {
        return await getKeywordSuggestions(keyword);
      });
      
      // Transform and validate each suggestion
      return suggestions.map(s => KeywordSchema.parse({
        keyword: s.keyword,
        searchVolume: parseInt(s.searchVolume),
        competition: parseFloat(s.competition),
        cpc: parseFloat(s.cpc)
      }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new APIError('Invalid related keywords format', error);
      }
      throw new APIError('Failed to fetch related keywords', error);
    }
  }
}

// Export both the class and the getKeywordSuggestions function
module.exports = KeywordService;
module.exports.getKeywordSuggestions = getKeywordSuggestions;
