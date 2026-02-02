const { pool } = require('../config/database');

// Get all orders
const getAll = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM orders ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ success: false, message: 'Error al obtener órdenes' });
    }
};

// Get order by ID
const getById = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM orders WHERE id = ?', [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Orden no encontrada' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ success: false, message: 'Error al obtener orden' });
    }
};

// Create order
const create = async (req, res) => {
    try {
        const { id, client, description, assignedTo, quantity, deadline, priority, status, progress } = req.body;

        const orderId = id || `ORD-${Math.floor(Math.random() * 10000)}`;

        await pool.execute(
            `INSERT INTO orders (id, client, description, assigned_to, quantity, deadline, priority, status, progress) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                orderId,
                client,
                description,
                assignedTo || null,
                quantity,
                deadline || null,
                priority || 'Media',
                status || 'Pendiente',
                progress || 0
            ]
        );

        const [rows] = await pool.execute('SELECT * FROM orders WHERE id = ?', [orderId]);

        res.status(201).json({
            success: true,
            order: rows[0]
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ success: false, message: 'Error al crear orden' });
    }
};

// Update order
const update = async (req, res) => {
    try {
        const { client, description, assignedTo, quantity, deadline, priority, status, progress } = req.body;
        const orderId = req.params.id;

        // Check if order exists
        const [existing] = await pool.execute('SELECT * FROM orders WHERE id = ?', [orderId]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Orden no encontrada' });
        }

        let updates = [];
        let params = [];

        if (client !== undefined) { updates.push('client = ?'); params.push(client); }
        if (description !== undefined) { updates.push('description = ?'); params.push(description); }
        if (assignedTo !== undefined) { updates.push('assigned_to = ?'); params.push(assignedTo); }
        if (quantity !== undefined) { updates.push('quantity = ?'); params.push(quantity); }
        if (deadline !== undefined) { updates.push('deadline = ?'); params.push(deadline); }
        if (priority !== undefined) { updates.push('priority = ?'); params.push(priority); }
        if (status !== undefined) { updates.push('status = ?'); params.push(status); }
        if (progress !== undefined) { updates.push('progress = ?'); params.push(Math.max(0, Math.min(100, progress))); }

        if (updates.length === 0) {
            return res.status(400).json({ success: false, message: 'No hay datos para actualizar' });
        }

        params.push(orderId);

        await pool.execute(
            `UPDATE orders SET ${updates.join(', ')} WHERE id = ?`,
            params
        );

        const [rows] = await pool.execute('SELECT * FROM orders WHERE id = ?', [orderId]);

        res.json({
            success: true,
            order: rows[0]
        });
    } catch (error) {
        console.error('Update order error:', error);
        res.status(500).json({ success: false, message: 'Error al actualizar orden' });
    }
};

// Delete order
const remove = async (req, res) => {
    try {
        const [existing] = await pool.execute('SELECT * FROM orders WHERE id = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Orden no encontrada' });
        }

        await pool.execute('DELETE FROM orders WHERE id = ?', [req.params.id]);

        res.json({ success: true, message: 'Orden eliminada' });
    } catch (error) {
        console.error('Delete order error:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar orden' });
    }
};

module.exports = { getAll, getById, create, update, remove };
