class DataProvider {
  async fetchKeywordData(params) {
    throw new Error('fetchKeywordData method must be implemented by subclasses');
  }
}

class GoogleAdsProvider extends DataProvider {
  constructor(googleAdsService) {
    super();
    this.googleAdsService = googleAdsService;
  }

  async fetchKeywordData(params) {
    return await this.googleAdsService.fetchKeywordData(params);
  }
}

// Placeholder for future Google Trends integration
class GoogleTrendsProvider extends DataProvider {
  async fetchKeywordData(params) {
    // Implement Google Trends API logic here
    return [];
  }
}

// Placeholder for future SEMrush integration
class SEMrushProvider extends DataProvider {
  async fetchKeywordData(params) {
    // Implement SEMrush API logic here
    return [];
  }
}

module.exports = {
  DataProvider,
  GoogleAdsProvider,
  GoogleTrendsProvider,
  SEMrushProvider,
};
