const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

// Get all users
const getAll = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT id_operario as id, username, nombre as name, role, avatar, especialidad, activo, created_at FROM operarios ORDER BY created_at DESC'
        );
        res.json(rows);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ success: false, message: 'Error al obtener usuarios' });
    }
};

// Get user by ID
const getById = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT id_operario as id, username, nombre as name, role, avatar, especialidad, activo, created_at FROM operarios WHERE id_operario = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ success: false, message: 'Error al obtener usuario' });
    }
};

// Create user (register operator)
const create = async (req, res) => {
    try {
        const { username, password, name, role, especialidad, activo } = req.body;

        if (!username || !password || !name) {
            return res.status(400).json({
                success: false,
                message: 'Username, password y nombre son requeridos'
            });
        }

        // Check for duplicate username
        const [existing] = await pool.execute('SELECT id_operario FROM operarios WHERE username = ?', [username]);
        if (existing.length > 0) {
            return res.status(409).json({ success: false, message: `El usuario "${username}" ya existe` });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const isActive = activo !== undefined ? activo : true;

        const [result] = await pool.execute(
            `INSERT INTO operarios (username, password, nombre, role, especialidad, activo) VALUES (?, ?, ?, ?, ?, ?)`,
            [username, hashedPassword, name, role || 'operator', especialidad || null, isActive]
        );

        const [rows] = await pool.execute(
            'SELECT id_operario as id, username, nombre as name, role, especialidad, activo, created_at FROM operarios WHERE id_operario = ?',
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            user: rows[0]
        });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ success: false, message: 'Error al crear usuario' });
    }
};

// Update user
const update = async (req, res) => {
    try {
        const { username, password, name, role, avatar, especialidad, activo } = req.body;
        const userId = req.params.id;

        // Check if user exists
        const [existing] = await pool.execute('SELECT * FROM operarios WHERE id_operario = ?', [userId]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        let updates = [];
        let params = [];

        if (username !== undefined) {
            // Check for duplicate username
            const [dup] = await pool.execute('SELECT id_operario FROM operarios WHERE username = ? AND id_operario != ?', [username, userId]);
            if (dup.length > 0) {
                return res.status(409).json({ success: false, message: `El usuario "${username}" ya existe` });
            }
            updates.push('username = ?');
            params.push(username);
        }
        if (password !== undefined && password !== '') {
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.push('password = ?');
            params.push(hashedPassword);
        }
        if (name !== undefined) { updates.push('nombre = ?'); params.push(name); }
        if (role !== undefined) { updates.push('role = ?'); params.push(role); }
        if (avatar !== undefined) { updates.push('avatar = ?'); params.push(avatar); }
        if (especialidad !== undefined) { updates.push('especialidad = ?'); params.push(especialidad); }
        if (activo !== undefined) { updates.push('activo = ?'); params.push(activo); }

        if (updates.length === 0) {
            return res.status(400).json({ success: false, message: 'No hay datos para actualizar' });
        }

        params.push(userId);

        await pool.execute(
            `UPDATE operarios SET ${updates.join(', ')} WHERE id_operario = ?`,
            params
        );

        const [rows] = await pool.execute(
            'SELECT id_operario as id, username, nombre as name, role, avatar, especialidad, activo, created_at FROM operarios WHERE id_operario = ?',
            [userId]
        );

        res.json({
            success: true,
            user: rows[0]
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ success: false, message: 'Error al actualizar usuario' });
    }
};

// Delete user
const remove = async (req, res) => {
    try {
        const [existing] = await pool.execute('SELECT * FROM operarios WHERE id_operario = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        // Prevent deleting admin users
        if (existing[0].role === 'admin') {
            return res.status(403).json({ success: false, message: 'No se puede eliminar un usuario administrador' });
        }

        await pool.execute('DELETE FROM operarios WHERE id_operario = ?', [req.params.id]);

        res.json({ success: true, message: 'Usuario eliminado' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar usuario' });
    }
};

module.exports = { getAll, getById, create, update, remove };
