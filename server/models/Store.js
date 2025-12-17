const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Store = sequelize.define('Store', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [0, 400]
        }
    },
    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    ownerId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Allow null initially for existing stores, or require it
        references: {
            model: 'Users',
            key: 'id'
        }
    }
});

module.exports = Store;
