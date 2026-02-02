const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { verifyToken } = require('../../middleware/auth');

// POST /api/auth/login
router.post('/login', controller.login);

// GET /api/auth/profile (protected)
router.get('/profile', verifyToken, controller.getProfile);

// PUT /api/auth/profile (protected)
router.put('/profile', verifyToken, controller.updateProfile);

module.exports = router;
