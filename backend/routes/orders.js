const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/ordersController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// All routes require authentication
router.use(verifyToken);

// GET /api/orders
router.get('/', getAll);

// GET /api/orders/:id
router.get('/:id', getById);

// POST /api/orders (admin only)
router.post('/', requireAdmin, create);

// PUT /api/orders/:id
router.put('/:id', update);

// DELETE /api/orders/:id (admin only)
router.delete('/:id', requireAdmin, remove);

module.exports = router;
