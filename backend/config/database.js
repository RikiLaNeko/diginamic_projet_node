const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: process.env["DIALECT"] || 'sqlite',
    storage: process.env["DB_NAME"] || 'database.sqlite'
});

module.exports = sequelize;