const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Biere = require('./biere');
const Commande = require('./commande');

const BiereCommande = sequelize.define('BiereCommande', {
    biere_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Biere,
            key: 'id'
        }
    },
    commande_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Commande,
            key: 'id'
        }
    }
});

module.exports = BiereCommande;