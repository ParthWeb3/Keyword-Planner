// backend/routes/keywordRoutes.js
const express = require('express');
const router = express.Router();
const keywordController = require('../controllers/keywordController');

router.get('/', keywordController.getKeywords);
router.get('/suggestions', keywordController.findSuggestions);
router.get('/:term', keywordController.getKeyword);
router.post('/', keywordController.createKeyword);
router.put('/:id', keywordController.updateKeyword);
router.delete('/:id', keywordController.deleteKeyword);

module.exports = router;
