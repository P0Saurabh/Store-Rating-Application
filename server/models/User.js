const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [2, 60]
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING, // Hashed
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        validate: {
            len: [0, 400]
        }
    },
    role: {
        type: DataTypes.ENUM('System Administrator', 'Normal User', 'Store Owner'),
        defaultValue: 'Normal User',
    },
});

module.exports = User;
