const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware'); // Ensure this middleware exists

// Register route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Get profile route (protected)
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
