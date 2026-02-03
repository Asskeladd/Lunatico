const model = require('./model');

module.exports = {
    async getUnread(req, res, next) {
        try {
            // req.user is set by verifyToken middleware
            const [rows] = await model.getUnread(req.user.id);
            res.json({ success: true, data: rows });
        } catch (error) {
            next(error);
        }
    },

    async markAsRead(req, res, next) {
        try {
            await model.markAsRead(req.params.id, req.user.id);
            res.json({ success: true, message: 'Notificación marcada como leída' });
        } catch (error) {
            next(error);
        }
    },

    async markAllAsRead(req, res, next) {
        try {
            await model.markAllAsRead(req.user.id);
            res.json({ success: true, message: 'Todas las notificaciones marcadas como leídas' });
        } catch (error) {
            next(error);
        }
    }
};
