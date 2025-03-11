const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Bar = require('./bars');

const Biere = sequelize.define('Biere', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    degree: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    prix: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0
        }
    },
    bars_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Bar,
            key: 'id'
        }
    }
});

module.exports = Biere;