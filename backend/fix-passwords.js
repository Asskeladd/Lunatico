const bcrypt = require('bcryptjs');
const { pool } = require('./config/database');

async function updatePasswords() {
    try {
        console.log('🔄 Reestableciendo contraseñas...');

        const hashedPassword = await bcrypt.hash('123', 10);

        // 1. Admin Update
        const [adminResult] = await pool.execute(
            'UPDATE operarios SET password = ? WHERE username = ?',
            [hashedPassword, 'admin']
        );

        if (adminResult.affectedRows > 0) {
            console.log('✅ Contraseña de admin actualizada a: 123');
        } else {
            console.log('⚠️ Usuario admin no encontrado, creando...');
            await pool.execute(
                'INSERT INTO operarios (nombre, username, password, role, activo) VALUES (?, ?, ?, ?, ?)',
                ['Admin User', 'admin', hashedPassword, 'admin', 1]
            );
            console.log('✅ Usuario admin creado con contraseña: 123');
        }

        // 2. Operador Update
        const [opResult] = await pool.execute(
            'UPDATE operarios SET password = ? WHERE username = ?',
            [hashedPassword, 'operador']
        );

        if (opResult.affectedRows > 0) {
            console.log('✅ Contraseña de operador actualizada a: 123');
        } else {
            console.log('⚠️ Usuario operador no encontrado, creando...');
            await pool.execute(
                'INSERT INTO operarios (nombre, username, password, role, activo) VALUES (?, ?, ?, ?, ?)',
                ['Operador General', 'operador', hashedPassword, 'operator', 1]
            );
            console.log('✅ Usuario operador creado con contraseña: 123');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

updatePasswords();
