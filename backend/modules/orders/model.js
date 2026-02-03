const { pool } = require('../../config/database');
const notificationsModel = require('../notifications/model');

module.exports = {
    getAll: () => {
        return pool.execute(`
            SELECT ot.*, c.nombre as cliente_nombre, ar.id_operario as assigned_to
            FROM ordenes_trabajo ot
            LEFT JOIN clientes c ON ot.id_cliente = c.id_cliente
            LEFT JOIN asignaciones_recursos ar ON ot.id_orden = ar.id_orden
            ORDER BY ot.id_orden DESC
        `);
    },

    getById: (id) => {
        return pool.execute(`
            SELECT ot.*, c.nombre as cliente_nombre, ar.id_operario as assigned_to
            FROM ordenes_trabajo ot
            LEFT JOIN clientes c ON ot.id_cliente = c.id_cliente
            LEFT JOIN asignaciones_recursos ar ON ot.id_orden = ar.id_orden
            WHERE ot.id_orden = ?
        `, [id]);
    },

    create: async (data) => {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            const [result] = await conn.execute(
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

            const orderId = result.insertId;

            if (data.assignedTo) {
                await conn.execute(
                    `INSERT INTO asignaciones_recursos (id_orden, id_operario, fecha_asignacion) VALUES (?, ?, NOW())`,
                    [orderId, data.assignedTo]
                );

                // Create notification
                await notificationsModel.create({
                    user_id: data.assignedTo,
                    message: `Nueva orden asignada: #${orderId} - ${data.tipo_pieza || 'Pieza'}`,
                    type: 'assignment',
                    related_id: orderId
                });
            }

            await conn.commit();
            return [result];
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    update: async (id, data) => {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            const fields = [];
            const values = [];

            if (data.tipo_pieza !== undefined) { fields.push('tipo_pieza = ?'); values.push(data.tipo_pieza); }
            if (data.cantidad !== undefined) { fields.push('cantidad = ?'); values.push(data.cantidad); }
            if (data.fecha_entrega !== undefined) { fields.push('fecha_entrega = ?'); values.push(data.fecha_entrega); }
            if (data.prioridad) { fields.push('prioridad = ?'); values.push(data.prioridad); }
            if (data.estado) { fields.push('estado = ?'); values.push(data.estado); }
            if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }
            if (data.progress !== undefined) { fields.push('progress = ?'); values.push(data.progress); }

            if (fields.length > 0) {
                values.push(id);
                await conn.execute(
                    `UPDATE ordenes_trabajo SET ${fields.join(', ')} WHERE id_orden = ?`,
                    values
                );
            }

            // Handle assignment
            if (data.assignedTo !== undefined) {
                // Remove existing assignment
                await conn.execute('DELETE FROM asignaciones_recursos WHERE id_orden = ?', [id]);

                if (data.assignedTo) {
                    await conn.execute(
                        `INSERT INTO asignaciones_recursos (id_orden, id_operario, fecha_asignacion) VALUES (?, ?, NOW())`,
                        [id, data.assignedTo]
                    );

                    // Create notification
                    await notificationsModel.create({
                        user_id: data.assignedTo,
                        message: `Orden asignada: #${id}`, // Simplified message as update might not have all details
                        type: 'assignment',
                        related_id: id
                    });
                }
            }

            await conn.commit();
            return;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    remove: (id) => {
        return pool.execute('DELETE FROM ordenes_trabajo WHERE id_orden = ?', [id]);
    }
};
