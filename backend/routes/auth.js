const express = require('express');
const router = express.Router();
const { login, getProfile, updateProfile } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/profile (protected)
router.get('/profile', verifyToken, getProfile);

// PUT /api/auth/profile (protected)
router.put('/profile', verifyToken, updateProfile);

module.exports = router;
