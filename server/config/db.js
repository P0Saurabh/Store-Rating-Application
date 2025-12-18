const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const isProduction = process.env.NODE_ENV === 'production';
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
    console.error("⚠️  DATABASE_URL is missing! Using fallback for safe startup.");
}

// Fallback to localhost to ensure we don't crash on startup, but fail gracefully at connection time
// We disable SSL for the fallback to prevent immediate 'self signed certificate' errors or protocol mismatch
const sequelize = new Sequelize(dbUrl || 'postgres://fallback:fallback@127.0.0.1:5432/fallback', {
    dialect: 'postgres',
    logging: false, // console.log to see SQL queries
    dialectOptions: dbUrl ? {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    } : {}, // No SSL for fallback/localhost
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

let isConnected = false;
let connectionPromise = null;

const connectDB = async () => {
    if (isConnected) return;
    if (connectionPromise) return connectionPromise;

    connectionPromise = (async () => {
        try {
            await sequelize.authenticate();
            console.log('Database connected successfully.');

            // Only sync in development
            if (process.env.NODE_ENV !== 'production') {
                await sequelize.sync({ alter: true });
                console.log('Database synced.');
            }
            isConnected = true;
        } catch (error) {
            console.error('Unable to connect to the database:', error);
            connectionPromise = null;
            throw error;
        }
    })();

    return connectionPromise;
};

module.exports = { sequelize, connectDB };
