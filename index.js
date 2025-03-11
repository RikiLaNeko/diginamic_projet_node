const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const barsRouter = require('./router/barsRouter');
const biereRouter = require('./router/biereRouter');
const commandeRouter = require('./router/commandeRouter');
const biereCommandeRouter = require('./router/biere_commandeRouter');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/bars', barsRouter);
app.use('/biere', biereRouter);
app.use('/commandes', commandeRouter);
app.use('/biere_commande', biereCommandeRouter);

sequelize.sync({ force: false }).then(() => {
    console.log('Database & tables created!');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});