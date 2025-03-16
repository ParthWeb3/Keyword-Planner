const express = require('express');
const router = express.Router();
const keywordController = require('../controllers/keywordController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', authMiddleware, keywordController.getKeywords); // Protected route
router.get('/suggestions', authMiddleware, keywordController.findSuggestions);
router.get('/:term', authMiddleware, keywordController.getKeyword);
router.get('/trends/:id', authMiddleware, keywordController.getKeywordTrends);
router.get('/google-ads', authMiddleware, keywordController.fetchGoogleAdsData);
router.get('/google-search', authMiddleware, keywordController.searchGoogle);
router.post('/', authMiddleware, roleMiddleware('admin'), keywordController.createKeyword); // Admin only
router.put('/:id', authMiddleware, roleMiddleware('admin'), keywordController.updateKeyword);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), keywordController.deleteKeyword);

module.exports = router;
