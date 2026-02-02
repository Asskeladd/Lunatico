const { pool } = require('../../config/database');
const bcrypt = require('bcryptjs');

module.exports = {
    // Find user by username
    findByUsername: (username) => {
        return pool.execute(
            'SELECT * FROM operarios WHERE username = ?',
            [username]
        );
    },

    // Find user by ID
    findById: (id) => {
        return pool.execute(
            'SELECT id_operario as id, username, nombre as name, role, avatar FROM operarios WHERE id_operario = ?',
            [id]
        );
    },

    // Update user profile
    update: (id, data) => {
        const fields = [];
        const values = [];

        if (data.name) {
            fields.push('nombre = ?');
            values.push(data.name);
        }
        if (data.password) {
            fields.push('password = ?');
            values.push(data.password);
        }
        if (data.avatar !== undefined) {
            fields.push('avatar = ?');
            values.push(data.avatar);
        }

        values.push(id);

        return pool.execute(
            `UPDATE operarios SET ${fields.join(', ')} WHERE id_operario = ?`,
            values
        );
    }
};
