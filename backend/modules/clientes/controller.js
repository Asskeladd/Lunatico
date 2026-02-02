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
                    message: 'Cliente no encontrado'
                });
            }
            res.json({ success: true, data: rows[0] });
        } catch (error) {
            next(error);
        }
    },

    async create(req, res, next) {
        try {
            const { nombre, telefono, email } = req.body;

            if (!nombre) {
                return res.status(400).json({
                    success: false,
                    message: 'El nombre es requerido'
                });
            }

            const [result] = await model.create({ nombre, telefono, email });
            const [rows] = await model.getById(result.insertId);

            res.status(201).json({
                success: true,
                message: 'Cliente creado correctamente',
                data: rows[0]
            });
        } catch (error) {
            next(error);
        }
    },

    async update(req, res, next) {
        try {
            const { nombre, telefono, email } = req.body;
            await model.update(req.params.id, { nombre, telefono, email });
            const [rows] = await model.getById(req.params.id);

            res.json({
                success: true,
                message: 'Cliente actualizado correctamente',
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
                message: 'Cliente eliminado correctamente'
            });
        } catch (error) {
            next(error);
        }
    }
};
