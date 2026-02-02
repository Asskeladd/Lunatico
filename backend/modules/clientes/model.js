const { pool } = require('../../config/database');

module.exports = {
    getAll: () => {
        return pool.execute('SELECT * FROM clientes ORDER BY id_cliente DESC');
    },

    getById: (id) => {
        return pool.execute('SELECT * FROM clientes WHERE id_cliente = ?', [id]);
    },

    create: (data) => {
        return pool.execute(
            'INSERT INTO clientes (nombre, telefono, email) VALUES (?, ?, ?)',
            [data.nombre, data.telefono || null, data.email || null]
        );
    },

    update: (id, data) => {
        const fields = [];
        const values = [];

        if (data.nombre) {
            fields.push('nombre = ?');
            values.push(data.nombre);
        }
        if (data.telefono !== undefined) {
            fields.push('telefono = ?');
            values.push(data.telefono);
        }
        if (data.email !== undefined) {
            fields.push('email = ?');
            values.push(data.email);
        }

        values.push(id);

        return pool.execute(
            `UPDATE clientes SET ${fields.join(', ')} WHERE id_cliente = ?`,
            values
        );
    },

    remove: (id) => {
        return pool.execute('DELETE FROM clientes WHERE id_cliente = ?', [id]);
    }
};
