const { pool } = require('../../config/database');

module.exports = {
    getAll: () => {
        return pool.execute(`
            SELECT rm.*, 
                   (SELECT COUNT(*) FROM ordenes_trabajo WHERE MONTH(created_at) = rm.mes AND YEAR(created_at) = rm.anio) as ordenes_mes
            FROM reportes_mensuales rm
            ORDER BY rm.anio DESC, rm.mes DESC
        `);
    },

    getById: (id) => {
        return pool.execute('SELECT * FROM reportes_mensuales WHERE id_reporte = ?', [id]);
    },

    create: (data) => {
        return pool.execute(
            `INSERT INTO reportes_mensuales 
            (mes, anio, total_piezas, total_horas, total_materiales_utilizados, fecha_generacion) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                data.mes,
                data.anio,
                data.total_piezas || 0,
                data.total_horas || 0,
                data.total_materiales_utilizados || 0,
                data.fecha_generacion || new Date().toISOString().split('T')[0]
            ]
        );
    },

    // Obtener estadísticas en tiempo real basadas en órdenes reales
    getRealTimeStats: async () => {
        const [orders] = await pool.execute('SELECT * FROM ordenes_trabajo');
        const [machines] = await pool.execute('SELECT * FROM maquinas');

        // Calcular totales
        const totalPiezas = orders.reduce((sum, order) => sum + (parseInt(order.cantidad) || 0), 0);
        const totalOrdenes = orders.length;
        const ordenesCompletadas = orders.filter(o => o.estado === 'Completada').length;
        const ordenesPendientes = orders.filter(o => o.estado === 'Pendiente').length;
        const ordenesEnProgreso = orders.filter(o => o.estado === 'En Progreso').length;

        // Estadísticas de máquinas
        const maquinasActivas = machines.filter(m => m.estado === 'Activo').length;
        const maquinasInactivas = machines.filter(m => m.estado === 'Inactivo').length;
        const maquinasMantenimiento = machines.filter(m => m.estado === 'En Mantenimiento').length;

        return {
            totalPiezas,
            totalOrdenes,
            ordenesCompletadas,
            ordenesPendientes,
            ordenesEnProgreso,
            maquinasActivas,
            maquinasInactivas,
            maquinasMantenimiento,
            totalMaquinas: machines.length
        };
    }
};
