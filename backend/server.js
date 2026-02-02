require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const { testConnection } = require('./config/database');
const corsMiddleware = require('./middleware/cors');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ============================================
// AUTO-LOAD MODULES (KISS Pattern)
// ============================================
const modulesDir = path.join(__dirname, 'modules');

if (fs.existsSync(modulesDir)) {
    const modules = fs.readdirSync(modulesDir);

    console.log('\n📦 Loading modules...');

    modules.forEach(moduleName => {
        const routePath = path.join(modulesDir, moduleName, 'routes.js');

        if (fs.existsSync(routePath)) {
            try {
                const routes = require(routePath);
                app.use(`/api/${moduleName}`, routes);
                console.log(`   ✅ /api/${moduleName}`);
            } catch (error) {
                console.error(`   ❌ Error loading ${moduleName}:`, error.message);
            }
        }
    });

    console.log('');
}

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.url} not found`
    });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const startServer = async () => {
    try {
        await testConnection();

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📋 API Health: http://localhost:${PORT}/api/health\n`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        console.log('⚠️  Starting server anyway (check your .env file)\n');

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`⚠️  Database not connected - fix configuration\n`);
        });
    }
};

startServer();
