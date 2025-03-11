const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const routers = require('./router/routers');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/', routers);

sequelize.sync({ force: false }).then(() => {
    console.info('Base de donnée et table crée!');
    app.listen(PORT, () => {
        console.info(`Le serveur a démarée sur le port: ${PORT}`);
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});

module.exports = app;