const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Bar = require('./bars');

const Commande = sequelize.define('Commande', {
    name: {
        type: DataTypes.STRING,
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
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['en cours', 'terminée']]
        }
    }
});

module.exports = Commande;