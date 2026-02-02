const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

// Get all users
const getAll = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT id, username, name, role, avatar, created_at FROM users ORDER BY created_at DESC'
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
            'SELECT id, username, name, role, avatar, created_at FROM users WHERE id = ?',
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
        const { username, password, name, role } = req.body;

        if (!username || !password || !name) {
            return res.status(400).json({
                success: false,
                message: 'Username, password y nombre son requeridos'
            });
        }

        // Check for duplicate username
        const [existing] = await pool.execute('SELECT id FROM users WHERE username = ?', [username]);
        if (existing.length > 0) {
            return res.status(409).json({ success: false, message: `El usuario "${username}" ya existe` });
        }

        const userId = `u${Math.floor(Math.random() * 100000)}`;
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.execute(
            `INSERT INTO users (id, username, password, name, role) VALUES (?, ?, ?, ?, ?)`,
            [userId, username, hashedPassword, name, role || 'operator']
        );

        const [rows] = await pool.execute(
            'SELECT id, username, name, role, created_at FROM users WHERE id = ?',
            [userId]
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
        const { username, password, name, role, avatar } = req.body;
        const userId = req.params.id;

        // Check if user exists
        const [existing] = await pool.execute('SELECT * FROM users WHERE id = ?', [userId]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        let updates = [];
        let params = [];

        if (username !== undefined) {
            // Check for duplicate username
            const [dup] = await pool.execute('SELECT id FROM users WHERE username = ? AND id != ?', [username, userId]);
            if (dup.length > 0) {
                return res.status(409).json({ success: false, message: `El usuario "${username}" ya existe` });
            }
            updates.push('username = ?');
            params.push(username);
        }
        if (password !== undefined) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.push('password = ?');
            params.push(hashedPassword);
        }
        if (name !== undefined) { updates.push('name = ?'); params.push(name); }
        if (role !== undefined) { updates.push('role = ?'); params.push(role); }
        if (avatar !== undefined) { updates.push('avatar = ?'); params.push(avatar); }

        if (updates.length === 0) {
            return res.status(400).json({ success: false, message: 'No hay datos para actualizar' });
        }

        params.push(userId);

        await pool.execute(
            `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
            params
        );

        const [rows] = await pool.execute(
            'SELECT id, username, name, role, avatar, created_at FROM users WHERE id = ?',
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
        const [existing] = await pool.execute('SELECT * FROM users WHERE id = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        // Prevent deleting admin users
        if (existing[0].role === 'admin') {
            return res.status(403).json({ success: false, message: 'No se puede eliminar un usuario administrador' });
        }

        await pool.execute('DELETE FROM users WHERE id = ?', [req.params.id]);

        res.json({ success: true, message: 'Usuario eliminado' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar usuario' });
    }
};

module.exports = { getAll, getById, create, update, remove };
