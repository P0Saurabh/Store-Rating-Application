const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    logging: false, // Set to console.log to see SQL queries
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // Required for some cloud providers like PlanetScale/Railway
        }
    },
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');
        // Sync models
        await sequelize.sync({ alter: true });
        console.log('Database synced.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = { sequelize, connectDB };
