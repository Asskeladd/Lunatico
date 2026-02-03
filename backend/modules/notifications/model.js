const { pool } = require('../../config/database');

// Auto-migration to create table
const initTable = async () => {
    try {
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS notificaciones (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                message TEXT,
                is_read BOOLEAN DEFAULT FALSE,
                type VARCHAR(50),
                related_id INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES operarios(id_operario) ON DELETE CASCADE
            ) ENGINE=InnoDB;
        `);
        console.log('   ✅ Table "notificaciones" checked/created');
    } catch (error) {
        console.error('   ❌ Error creating "notificaciones" table:', error.message);
    }
};

// Run migration
initTable();

module.exports = {
    // Get unread notifications for a user
    getUnread: (userId) => {
        return pool.execute(
            'SELECT * FROM notificaciones WHERE user_id = ? AND is_read = FALSE ORDER BY created_at DESC',
            [userId]
        );
    },

    // Create a new notification
    create: (data) => {
        return pool.execute(
            'INSERT INTO notificaciones (user_id, message, type, related_id) VALUES (?, ?, ?, ?)',
            [data.user_id, data.message, data.type || 'info', data.related_id || null]
        );
    },

    // Mark as read
    markAsRead: (id, userId) => {
        return pool.execute(
            'UPDATE notificaciones SET is_read = TRUE WHERE id = ? AND user_id = ?',
            [id, userId]
        );
    },

    // Mark all as read for user
    markAllAsRead: (userId) => {
        return pool.execute(
            'UPDATE notificaciones SET is_read = TRUE WHERE user_id = ?',
            [userId]
        );
    }
};
