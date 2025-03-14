const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Bars = require('./bars');

const Commande = sequelize.define('Commande', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
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
            model: Bars,
            key: 'id'
        }
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isBefore: new Date().toISOString()
        }
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['brouillon', 'en cours', 'terminée']]
        }
    }
}, {
    hooks: {
        beforeUpdate: async (commande) => {
            if (commande._previousDataValues.status === 'terminée') {
                throw new Error('Une commande terminée ne peut pas être modifiée');
            }
        },
        beforeDestroy: async (commande) => {
            await Commande.destroy({ where: { id: commande.id } });
        }
    }
});

module.exports = Commande;