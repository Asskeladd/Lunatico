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
    },

    async getStats(req, res, next) {
        try {
            const stats = await model.getRealTimeStats();
            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            next(error);
        }
    },

    async generatePDF(req, res, next) {
        try {
            const { mes, anio } = req.body;

            if (!mes || !anio) {
                return res.status(400).json({
                    success: false,
                    message: 'Mes y año son requeridos'
                });
            }

            // Llamar al microservicio PHP
            const axios = require('axios');
            const pdfServiceUrl = process.env.PDF_SERVICE_URL || 'http://localhost:8080';

            const response = await axios.post(`${pdfServiceUrl}/generate`, {
                mes: parseInt(mes),
                anio: parseInt(anio)
            });

            res.json(response.data);
        } catch (error) {
            if (error.response) {
                // Error del servicio PHP
                return res.status(error.response.status).json({
                    success: false,
                    message: error.response.data.error || 'Error al generar PDF'
                });
            }
            next(error);
        }
    },

    async downloadPDF(req, res, next) {
        try {
            const { filename } = req.params;
            const axios = require('axios');
            const pdfServiceUrl = process.env.PDF_SERVICE_URL || 'http://localhost:8080';

            // Proxy a PHP service para descargar
            const response = await axios.get(`${pdfServiceUrl}/download/${filename}`, {
                responseType: 'arraybuffer'
            });

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.send(Buffer.from(response.data));
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return res.status(404).json({
                    success: false,
                    message: 'Reporte no encontrado'
                });
            }
            next(error);
        }
    }
};
