const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('../server/config/db');

// Load environment variables from server/.env for Vercel
dotenv.config({ path: '../server/.env' });

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('../server/routes/authRoutes');

// Connect to Database (async)
(async () => {
    try {
        await connectDB();
        console.log('✅ Database connected successfully in serverless function');
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.error('DATABASE_URL present:', !!process.env.DATABASE_URL);
        console.error('JWT_SECRET present:', !!process.env.JWT_SECRET);
    }
})();

app.use('/api/auth', authRoutes);
app.use('/api', require('../server/routes/dataRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        env: {
            DATABASE_URL: !!process.env.DATABASE_URL,
            JWT_SECRET: !!process.env.JWT_SECRET,
            NODE_ENV: process.env.NODE_ENV
        }
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('❌ Error caught:', err.message);
    console.error('Stack:', err.stack);
    res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'production' ? err.message : err.stack
    });
});

module.exports = app;
