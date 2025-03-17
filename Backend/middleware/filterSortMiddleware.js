const Keyword = require('../models/Keyword');

const filterAndSortMiddleware = async (req, res, next) => {
  try {
    const {
      minSearchVolume,
      maxSearchVolume,
      competitionLevel,
      trend,
      includeTerms,
      excludeTerms,
      sortBy,
    } = req.query;

    // Build filtering criteria
    const filterCriteria = {};
    if (minSearchVolume) filterCriteria.searchVolume = { $gte: parseInt(minSearchVolume) };
    if (maxSearchVolume) filterCriteria.searchVolume = { ...filterCriteria.searchVolume, $lte: parseInt(maxSearchVolume) };
    if (competitionLevel) filterCriteria.competition = competitionLevel.toUpperCase();
    if (trend) filterCriteria.trend = trend.toLowerCase();
    if (includeTerms) filterCriteria.keyword = { $regex: includeTerms, $options: 'i' };
    if (excludeTerms) filterCriteria.keyword = { ...filterCriteria.keyword, $not: new RegExp(excludeTerms, 'i') };

    // Build sorting criteria
    const sortCriteria = {};
    switch (sortBy) {
      case 'searchVolume':
        sortCriteria.searchVolume = -1; // Descending
        break;
      case 'competition':
        sortCriteria.competition = 1; // Ascending
        break;
      case 'trend':
        sortCriteria.trend = 1; // Rising first
        break;
      default:
        sortCriteria.relevance = 1; // Default sorting by relevance
    }

    // Fetch filtered and sorted results
    const keywords = await Keyword.find(filterCriteria).sort(sortCriteria);
    res.locals.keywords = keywords; // Pass results to the next middleware
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = filterAndSortMiddleware;
