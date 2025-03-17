const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const routers = require('./router/routers');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

/*
Ici nous utilisons CORS pour autoriser les requêtes provenant de n'importe quelle origine uniquement en développement
Dans un environnement de production, il est recommandé de spécifier les origines autorisées en fonction de votre configuration.
 */
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use('/', routers);



if (process.env.NODE_ENV !== 'test') {
    sequelize.sync({ force: false }).then(() => {
        console.info('Base de donnée et table crée!');
        app.listen(PORT, () => {
            console.info(`Le serveur a démarée sur le port: ${PORT}`);
        });
    }).catch(err => {
        console.error('Unable to connect to the database:', err);
    });
}

module.exports = app;