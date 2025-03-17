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
router.get('/api/keyword-analysis', analyzeKeyword);

module.exports = router;
