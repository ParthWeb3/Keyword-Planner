// backend/routes/keywordRoutes.js
const express = require('express');
const router = express.Router();
const keywordController = require('../controllers/keywordController');
const { analyzeKeyword } = require('../controllers/keywordController');
const filterAndSortMiddleware = require('../middleware/filterSortMiddleware');

router.get('/', filterAndSortMiddleware, (req, res) => {
  res.status(200).json(res.locals.keywords); // Return filtered and sorted results
});

router.get('/suggestions', keywordController.findSuggestions);
router.get('/:term', keywordController.getKeyword);
router.post('/', keywordController.createKeyword);
router.put('/:id', keywordController.updateKeyword);
router.delete('/:id', keywordController.deleteKeyword);
router.get('/api/keyword-analysis', analyzeKeyword); // Ensure this route is defined

router.get('/test-google-ads', async (req, res) => {
  try {
    const googleAdsService = new (require('../utils/googleApi'))(
      process.env.GOOGLE_ADS_CLIENT_ID,
      process.env.GOOGLE_ADS_CLIENT_SECRET,
      process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
      process.env.REDIS_URL
    );

    const data = await googleAdsService.fetchKeywordData({ keyword: 'example' });
    res.status(200).json(data);
  } catch (error) {
    console.error('Error in test route:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
