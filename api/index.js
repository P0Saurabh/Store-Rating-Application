const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: require('path').join(__dirname, '../server/.env') });

const app = express();

app.use(cors());
app.use(express.json());

// Database connection state
let dbReady = false;
let dbError = null;

// Initialize database
const { connectDB } = require('../server/config/db');
connectDB()
    .then(() => {
        dbReady = true;
        console.log('✅ Database ready for serverless function');
    })
    .catch((error) => {
        dbError = error;
        console.error('❌ Database initialization failed:', error.message);
    });

// Middleware to ensure DB is ready
const ensureDbReady = async (req, res, next) => {
    if (dbReady) {
        return next();
    }

    if (dbError) {
        return res.status(500).json({
            message: 'Database connection failed',
            error: dbError.message
        });
    }

    // Wait for connection
    try {
        await connectDB();
        dbReady = true;
        next();
    } catch (error) {
        res.status(500).json({
            message: 'Database connection failed',
            error: error.message
        });
    }
};

// Health check (no DB required)
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        database: dbReady ? 'connected' : 'connecting',
        env: {
            DATABASE_URL: !!process.env.DATABASE_URL,
            JWT_SECRET: !!process.env.JWT_SECRET,
            NODE_ENV: process.env.NODE_ENV || 'development'
        }
    });
});

// Apply DB middleware to all API routes
const authRoutes = require('../server/routes/authRoutes');
const dataRoutes = require('../server/routes/dataRoutes');

app.use('/api/auth', ensureDbReady, authRoutes);
app.use('/api', ensureDbReady, dataRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.message);
    console.error('Stack:', err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV !== 'production' ? err.stack : undefined
    });
});

module.exports = app;
