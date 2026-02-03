require('dotenv').config();
const { pool } = require('./config/database');

async function checkColumns() {
    try {
        console.log('Checking "users" table columns...');
        const [rows] = await pool.execute('DESCRIBE users');
        console.table(rows);
    } catch (error) {
        console.error('Error checking users table:', error.message);
    } finally {
        process.exit();
    }
}

checkColumns();
