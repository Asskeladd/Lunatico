const bcrypt = require('bcryptjs');
const { pool } = require('./config/database');

async function updatePasswords() {
    try {
        console.log('🔄 Reestableciendo contraseña de admin...');

        const hashedPassword = await bcrypt.hash('123', 10);

        // Force update admin password
        const [result] = await pool.execute(
            'UPDATE operarios SET password = ? WHERE username = ?',
            [hashedPassword, 'admin']
        );

        if (result.affectedRows > 0) {
            console.log('✅ Contraseña de admin actualizada a: 123');
        } else {
            console.log('⚠️ Usuario admin no encontrado, creando...');
            // Create admin if not exists
            await pool.execute(
                'INSERT INTO operarios (nombre, username, password, role, activo) VALUES (?, ?, ?, ?, ?)',
                ['Admin User', 'admin', hashedPassword, 'admin', 1]
            );
            console.log('✅ Usuario admin creado con contraseña: 123');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

updatePasswords();
