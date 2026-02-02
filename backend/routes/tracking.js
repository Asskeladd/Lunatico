const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// GET /api/tracking/:orderId (public - no auth required)
router.get('/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;

        const [rows] = await pool.execute(
            'SELECT id, client, description, deadline, status, progress FROM orders WHERE id = ?',
            [orderId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pedido no encontrado. Verifique el código.'
            });
        }

        res.json({
            success: true,
            order: rows[0]
        });
    } catch (error) {
        console.error('Tracking error:', error);
        res.status(500).json({ success: false, message: 'Error al buscar pedido' });
    }
});

module.exports = router;
