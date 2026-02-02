const { pool } = require('../../config/database');

module.exports = {
    getAll: () => {
        return pool.execute('SELECT * FROM materiales ORDER BY id_material DESC');
    },

    getById: (id) => {
        return pool.execute('SELECT * FROM materiales WHERE id_material = ?', [id]);
    },

    create: (data) => {
        return pool.execute(
            'INSERT INTO materiales (nombre, unidad, stock_actual) VALUES (?, ?, ?)',
            [data.nombre, data.unidad, data.stock_actual || 0]
        );
    },

    update: (id, data) => {
        const fields = [];
        const values = [];

        if (data.nombre) {
            fields.push('nombre = ?');
            values.push(data.nombre);
        }
        if (data.unidad) {
            fields.push('unidad = ?');
            values.push(data.unidad);
        }
        if (data.stock_actual !== undefined) {
            fields.push('stock_actual = ?');
            values.push(data.stock_actual);
        }

        values.push(id);

        return pool.execute(
            `UPDATE materiales SET ${fields.join(', ')} WHERE id_material = ?`,
            values
        );
    },

    remove: (id) => {
        return pool.execute('DELETE FROM materiales WHERE id_material = ?', [id]);
    }
};
