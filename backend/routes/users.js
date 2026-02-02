const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/usersController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// All routes require authentication
router.use(verifyToken);

// GET /api/users
router.get('/', getAll);

// GET /api/users/:id
router.get('/:id', getById);

// POST /api/users (admin only - register operator)
router.post('/', requireAdmin, create);

// PUT /api/users/:id (admin only)
router.put('/:id', requireAdmin, update);

// DELETE /api/users/:id (admin only)
router.delete('/:id', requireAdmin, remove);

module.exports = router;
