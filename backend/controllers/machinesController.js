const { pool } = require('../config/database');

// Get all machines
const getAll = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM machines ORDER BY id');
        res.json(rows);
    } catch (error) {
        console.error('Get machines error:', error);
        res.status(500).json({ success: false, message: 'Error al obtener máquinas' });
    }
};

// Get machine by ID
const getById = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM machines WHERE id = ?', [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Máquina no encontrada' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Get machine error:', error);
        res.status(500).json({ success: false, message: 'Error al obtener máquina' });
    }
};

// Create machine
const create = async (req, res) => {
    try {
        const { id, name, status, operator, currentJob, efficiency } = req.body;

        if (!id || !name) {
            return res.status(400).json({ success: false, message: 'ID y nombre son requeridos' });
        }

        // Check for duplicate ID
        const [existing] = await pool.execute('SELECT id FROM machines WHERE id = ?', [id]);
        if (existing.length > 0) {
            return res.status(409).json({ success: false, message: `Ya existe una máquina con ID ${id}` });
        }

        await pool.execute(
            `INSERT INTO machines (id, name, status, operator, current_job, efficiency) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                id,
                name,
                status || 'Inactivo',
                operator || null,
                currentJob || null,
                efficiency || 0
            ]
        );

        const [rows] = await pool.execute('SELECT * FROM machines WHERE id = ?', [id]);

        res.status(201).json({
            success: true,
            machine: rows[0]
        });
    } catch (error) {
        console.error('Create machine error:', error);
        res.status(500).json({ success: false, message: 'Error al crear máquina' });
    }
};

// Update machine
const update = async (req, res) => {
    try {
        const { name, status, operator, currentJob, efficiency } = req.body;
        const machineId = req.params.id;

        // Check if machine exists
        const [existing] = await pool.execute('SELECT * FROM machines WHERE id = ?', [machineId]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Máquina no encontrada' });
        }

        let updates = [];
        let params = [];

        if (name !== undefined) { updates.push('name = ?'); params.push(name); }
        if (status !== undefined) { updates.push('status = ?'); params.push(status); }
        if (operator !== undefined) { updates.push('operator = ?'); params.push(operator); }
        if (currentJob !== undefined) { updates.push('current_job = ?'); params.push(currentJob); }
        if (efficiency !== undefined) { updates.push('efficiency = ?'); params.push(efficiency); }

        if (updates.length === 0) {
            return res.status(400).json({ success: false, message: 'No hay datos para actualizar' });
        }

        params.push(machineId);

        await pool.execute(
            `UPDATE machines SET ${updates.join(', ')} WHERE id = ?`,
            params
        );

        const [rows] = await pool.execute('SELECT * FROM machines WHERE id = ?', [machineId]);

        res.json({
            success: true,
            machine: rows[0]
        });
    } catch (error) {
        console.error('Update machine error:', error);
        res.status(500).json({ success: false, message: 'Error al actualizar máquina' });
    }
};

// Delete machine
const remove = async (req, res) => {
    try {
        const [existing] = await pool.execute('SELECT * FROM machines WHERE id = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Máquina no encontrada' });
        }

        await pool.execute('DELETE FROM machines WHERE id = ?', [req.params.id]);

        res.json({ success: true, message: 'Máquina eliminada' });
    } catch (error) {
        console.error('Delete machine error:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar máquina' });
    }
};

module.exports = { getAll, getById, create, update, remove };
