const express = require('express');
const router = express.Router();
const { getAll } = require('../controllers/reportsController');
const { verifyToken } = require('../middleware/auth');

// GET /api/reports (protected)
router.get('/', verifyToken, getAll);

module.exports = router;
