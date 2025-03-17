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
    addresse: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tel: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Users',
            key: 'id'
        }
    }
}, {
    hooks: {
        beforeDestroy: async (bar, options) => {
            await Biere.destroy({ where: { bars_id: bar.id }, individualHooks: true });
            await Commande.destroy({ where: { bars_id: bar.id }, individualHooks: true });
        }
    }
});

module.exports = Bars;
