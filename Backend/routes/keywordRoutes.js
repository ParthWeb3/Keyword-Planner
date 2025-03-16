const express = require('express');
const router = express.Router();
const keywordController = require('../controllers/keywordController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', authMiddleware, keywordController.getKeywords); // Protected route
router.get('/suggestions', authMiddleware, keywordController.findSuggestions);
router.get('/:term', authMiddleware, keywordController.getKeyword);
router.post('/', authMiddleware, roleMiddleware('admin'), keywordController.createKeyword); // Admin only
router.put('/:id', authMiddleware, roleMiddleware('admin'), keywordController.updateKeyword);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), keywordController.deleteKeyword);

module.exports = router;
