// backend/routes/keywordRoutes.js
const express = require('express');
const router = express.Router();
const keywordController = require('../controllers/keywordController');
const { analyzeKeyword } = require('../controllers/keywordController');
const filterAndSortMiddleware = require('../middleware/filterSortMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Ensure this middleware is defined
const parseCSV = require('../utils/parseCSV'); // Ensure this utility is implemented
const Keyword = require('../models/Keyword'); // Ensure this model is defined

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
    const googleAdsService = new (require('../utils/chatGapi'))( // Updated from googleApi to chatGapi
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

router.get('/test-openai', async (req, res) => {
  try {
    const GoogleAdsService = require('../utils/chatGapi');
    const googleAdsService = new GoogleAdsService(process.env.REDIS_URL);

    const keyword = req.query.keyword || 'example';
    const data = await googleAdsService.fetchKeywordData({ keyword });

    res.status(200).json(data);
  } catch (error) {
    console.error('Error in OpenAI test route:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post('/bulk-upload', upload.single('file'), async (req, res) => {
  try {
    const keywords = parseCSV(req.file.buffer); // Implement parseCSV utility
    await Keyword.insertMany(keywords);
    res.status(201).json({ message: 'Bulk upload successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
