const { pool } = require('../../config/database');

module.exports = {
    getAll: () => {
        return pool.execute(`
            SELECT ot.*, c.nombre as cliente_nombre
            FROM ordenes_trabajo ot
            LEFT JOIN clientes c ON ot.id_cliente = c.id_cliente
            ORDER BY ot.id_orden DESC
        `);
    },

    getById: (id) => {
        return pool.execute(`
            SELECT ot.*, c.nombre as cliente_nombre
            FROM ordenes_trabajo ot
            LEFT JOIN clientes c ON ot.id_cliente = c.id_cliente
            WHERE ot.id_orden = ?
        `, [id]);
    },

    create: (data) => {
        return pool.execute(
            `INSERT INTO ordenes_trabajo 
            (id_cliente, tipo_pieza, cantidad, fecha_entrega, fecha_recepcion, prioridad, estado, description, progress) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.id_cliente,
                data.tipo_pieza || null,
                data.cantidad,
                data.fecha_entrega || null,
                data.fecha_recepcion || new Date().toISOString().split('T')[0],
                data.prioridad || 'Media',
                data.estado || 'Pendiente',
                data.description || null,
                data.progress || 0
            ]
        );
    },

    update: (id, data) => {
        const fields = [];
        const values = [];

        if (data.tipo_pieza !== undefined) {
            fields.push('tipo_pieza = ?');
            values.push(data.tipo_pieza);
        }
        if (data.cantidad !== undefined) {
            fields.push('cantidad = ?');
            values.push(data.cantidad);
        }
        if (data.fecha_entrega !== undefined) {
            fields.push('fecha_entrega = ?');
            values.push(data.fecha_entrega);
        }
        if (data.prioridad) {
            fields.push('prioridad = ?');
            values.push(data.prioridad);
        }
        if (data.estado) {
            fields.push('estado = ?');
            values.push(data.estado);
        }
        if (data.description !== undefined) {
            fields.push('description = ?');
            values.push(data.description);
        }
        if (data.progress !== undefined) {
            fields.push('progress = ?');
            values.push(data.progress);
        }

        values.push(id);

        return pool.execute(
            `UPDATE ordenes_trabajo SET ${fields.join(', ')} WHERE id_orden = ?`,
            values
        );
    },

    remove: (id) => {
        return pool.execute('DELETE FROM ordenes_trabajo WHERE id_orden = ?', [id]);
    }
};
