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
                    message: 'Material no encontrado'
                });
            }
            res.json({ success: true, data: rows[0] });
        } catch (error) {
            next(error);
        }
    },

    async create(req, res, next) {
        try {
            const { nombre, unidad, stock_actual } = req.body;

            if (!nombre || !unidad) {
                return res.status(400).json({
                    success: false,
                    message: 'Nombre y unidad son requeridos'
                });
            }

            const [result] = await model.create({ nombre, unidad, stock_actual });
            const [rows] = await model.getById(result.insertId);

            res.status(201).json({
                success: true,
                message: 'Material creado correctamente',
                data: rows[0]
            });
        } catch (error) {
            next(error);
        }
    },

    async update(req, res, next) {
        try {
            const { nombre, unidad, stock_actual } = req.body;
            await model.update(req.params.id, { nombre, unidad, stock_actual });
            const [rows] = await model.getById(req.params.id);

            res.json({
                success: true,
                message: 'Material actualizado correctamente',
                data: rows[0]
            });
        } catch (error) {
            next(error);
        }
    },

    async remove(req, res, next) {
        try {
            await model.remove(req.params.id);
            res.json({
                success: true,
                message: 'Material eliminado correctamente'
            });
        } catch (error) {
            next(error);
        }
    }
};
