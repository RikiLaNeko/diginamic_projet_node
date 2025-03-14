const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Bars = require('./bars');
const BiereCommande = require('./biere_commande');

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
            model: Bars,
            key: 'id'
        }
    }
}, {
    hooks: {
        beforeDestroy: async (biere) => {
            await BiereCommande.destroy({ where: { biere_id: biere.id } });
        }
    }
});

module.exports = Biere;