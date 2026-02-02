const model = require('./model');

module.exports = {
    async getAll(req, res, next) {
        try {
            const [rows] = await model.getAll();
            res.json({ success: true, data: rows });
        } catch (error) {
            next(error);
        }
    },

    async getById(req, res, next) {
        try {
            const [rows] = await model.getById(req.params.id);
            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Reporte no encontrado'
                });
            }
            res.json({ success: true, data: rows[0] });
        } catch (error) {
            next(error);
        }
    },

    async create(req, res, next) {
        try {
            const { mes, anio, total_piezas, total_horas, total_materiales_utilizados } = req.body;

            if (!mes || !anio) {
                return res.status(400).json({
                    success: false,
                    message: 'Mes y año son requeridos'
                });
            }

            const [result] = await model.create({
                mes,
                anio,
                total_piezas,
                total_horas,
                total_materiales_utilizados
            });

            const [rows] = await model.getById(result.insertId);

            res.status(201).json({
                success: true,
                message: 'Reporte creado correctamente',
                data: rows[0]
            });
        } catch (error) {
            next(error);
        }
    }
};
