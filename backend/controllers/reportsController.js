const { pool } = require('../config/database');

// Get all reports data
const getAll = async (req, res) => {
    try {
        const [productivity] = await pool.execute('SELECT day, value FROM reports_productivity ORDER BY id');

        res.json({
            productivity
        });
    } catch (error) {
        console.error('Get reports error:', error);
        res.status(500).json({ success: false, message: 'Error al obtener reportes' });
    }
};

module.exports = { getAll };
