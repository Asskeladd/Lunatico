const { pool } = require('../../config/database');

module.exports = {
    getAll: () => {
        return pool.execute('SELECT * FROM maquinas ORDER BY id_maquina DESC');
    },

    getById: (id) => {
        return pool.execute('SELECT * FROM maquinas WHERE id_maquina = ?', [id]);
    },

    create: (data) => {
        return pool.execute(
            'INSERT INTO maquinas (nombre, tipo, estado, operator, currentJob, efficiency) VALUES (?, ?, ?, ?, ?, ?)',
            [
                data.nombre,
                data.tipo || null,
                data.estado || 'Inactivo',
                data.operator || null,
                data.currentJob || null,
                data.efficiency || 0
            ]
        );
    },

    update: (id, data) => {
        const fields = [];
        const values = [];

        if (data.nombre) {
            fields.push('nombre = ?');
            values.push(data.nombre);
        }
        if (data.tipo !== undefined) {
            fields.push('tipo = ?');
            values.push(data.tipo);
        }
        if (data.estado) {
            fields.push('estado = ?');
            values.push(data.estado);
        }
        if (data.operator !== undefined) {
            fields.push('operator = ?');
            values.push(data.operator);
        }
        if (data.currentJob !== undefined) {
            fields.push('currentJob = ?');
            values.push(data.currentJob);
        }
        if (data.efficiency !== undefined) {
            fields.push('efficiency = ?');
            values.push(data.efficiency);
        }

        values.push(id);

        return pool.execute(
            `UPDATE maquinas SET ${fields.join(', ')} WHERE id_maquina = ?`,
            values
        );
    },

    remove: (id) => {
        return pool.execute('DELETE FROM maquinas WHERE id_maquina = ?', [id]);
    }
};
