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
    }
};
