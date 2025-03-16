const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);

router.get('/profile', authMiddleware, (req, res) => {
  res.status(200).json({ id: req.user.id, name: req.user.name, email: req.user.email });
});

module.exports = router;
