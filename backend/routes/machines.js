const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/machinesController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// All routes require authentication
router.use(verifyToken);

// GET /api/machines
router.get('/', getAll);

// GET /api/machines/:id
router.get('/:id', getById);

// POST /api/machines (admin only)
router.post('/', requireAdmin, create);

// PUT /api/machines/:id
router.put('/:id', update);

// DELETE /api/machines/:id (admin only)
router.delete('/:id', requireAdmin, remove);

module.exports = router;
