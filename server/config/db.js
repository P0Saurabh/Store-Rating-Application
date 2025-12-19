const { Sequelize } = require('sequelize');
const path = require('path');

// Only load dotenv in development
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: path.join(__dirname, '../.env') });
}

// Check for DATABASE_URL
if (!process.env.DATABASE_URL) {
    console.error("⚠️  DATABASE_URL is missing! Using fallback for safe startup.");
}

// Fallback to localhost to ensure we don't crash on startup
const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://fallback:fallback@127.0.0.1:5432/fallback', {
    dialect: 'postgres',
    dialectModule: require('pg'),
    logging: false,
    dialectOptions: process.env.DATABASE_URL ? {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    } : {},
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully.');

        // Only sync in development to avoid schema changes in production
        if (process.env.NODE_ENV !== 'production') {
            await sequelize.sync({ alter: true });
            console.log('Database synced.');
        }
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error.message);
        throw error;
    }
};

module.exports = { sequelize, connectDB };
