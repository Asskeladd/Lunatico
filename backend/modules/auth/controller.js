const bcrypt = require('bcryptjs');
const model = require('./model');
const { generateToken } = require('../../middleware/auth');

module.exports = {
    // POST /api/auth/login
    async login(req, res, next) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Usuario y contraseña son requeridos'
                });
            }

            const [rows] = await model.findByUsername(username);

            if (rows.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas'
                });
            }

            const user = rows[0];
            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas'
                });
            }

            const token = generateToken({
                id: user.id_operario,
                username: user.username,
                name: user.nombre,
                role: user.role
            });

            res.json({
                success: true,
                token,
                user: {
                    id: user.id_operario,
                    username: user.username,
                    name: user.nombre,
                    role: user.role,
                    avatar: user.avatar
                }
            });
        } catch (error) {
            next(error);
        }
    },

    // GET /api/auth/profile
    async getProfile(req, res, next) {
        try {
            const [rows] = await model.findById(req.user.id);

            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            res.json({
                success: true,
                user: rows[0]
            });
        } catch (error) {
            next(error);
        }
    },

    // PUT /api/auth/profile
    async updateProfile(req, res, next) {
        try {
            const { name, password, avatar } = req.body;
            const updates = {};

            if (name) updates.name = name;
            if (password) updates.password = await bcrypt.hash(password, 10);
            if (avatar !== undefined) updates.avatar = avatar;

            if (Object.keys(updates).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No hay campos para actualizar'
                });
            }

            await model.update(req.user.id, updates);
            const [rows] = await model.findById(req.user.id);

            res.json({
                success: true,
                message: 'Perfil actualizado correctamente',
                user: rows[0]
            });
        } catch (error) {
            next(error);
        }
    }
};
