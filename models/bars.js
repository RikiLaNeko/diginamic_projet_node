const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Biere = require('./biere');
const Commande = require('./commande');

const Bars = sequelize.define('Bars', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    adresse: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tel: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: {
        type: DataTypes.STRING,
        allowNull: true
    }    

}, {
    hooks: {
        beforeDestroy: async (bar) => {
            await Biere.destroy({ where: { bars_id: bar.id } });
            await Commande.destroy({ where: { bars_id: bar.id } });
        }
    }
});

module.exports = Bars;