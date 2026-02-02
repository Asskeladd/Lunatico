const model = require('./model');

module.exports = {
    async getOrder(req, res, next) {
        try {
            const { orderId } = req.params;
            const [rows] = await model.getByOrderId(orderId);

            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Pedido no encontrado. Verifique el código.'
                });
            }

            res.json({
                success: true,
                order: rows[0]
            });
        } catch (error) {
            next(error);
        }
    }
};
