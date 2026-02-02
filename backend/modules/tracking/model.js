const { pool } = require('../../config/database');

module.exports = {
    // Get order by ID for public tracking
    getByOrderId: (orderId) => {
        return pool.execute(
            `SELECT ot.id_orden, ot.tipo_pieza, ot.estado, ot.progress, ot.fecha_entrega, c.nombre as cliente
             FROM ordenes_trabajo ot
             LEFT JOIN clientes c ON ot.id_cliente = c.id_cliente
             WHERE ot.id_orden = ?`,
            [orderId]
        );
    }
};
