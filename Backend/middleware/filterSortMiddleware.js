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
      page = 1,
      limit = 10,
      sortBy = 'searchVolume',
      order = 'desc',
    } = req.query;

    // Build filtering criteria
    const filterCriteria = {};
    if (minSearchVolume) filterCriteria['metrics.search_volume'] = { $gte: parseInt(minSearchVolume) };
    if (maxSearchVolume) filterCriteria.searchVolume = { ...filterCriteria.searchVolume, $lte: parseInt(maxSearchVolume) };
    if (competitionLevel) filterCriteria.competition = competitionLevel.toUpperCase();
    if (trend) filterCriteria.trend = trend.toLowerCase();
    if (includeTerms) filterCriteria.keyword = { $regex: includeTerms, $options: 'i' };
    if (excludeTerms) filterCriteria.keyword = { ...filterCriteria.keyword, $not: new RegExp(excludeTerms, 'i') };

    // Build sorting criteria
    const sortCriteria = { [sortBy]: order === 'desc' ? -1 : 1 };

    // Fetch filtered and sorted results with pagination
    const keywords = await Keyword.find(filterCriteria)
      .sort(sortCriteria)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.locals.keywords = keywords; // Pass results to the next middleware
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = filterAndSortMiddleware;
