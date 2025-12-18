const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://user:pass@example.com:5432/dbname', {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
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
