const Bars = require('./bars');
const Biere = require('./biere');
const BiereCommande = require('./biere_commande');
const Commande = require('./commande');
const User = require('./User');

Bars.hasMany(Biere, { foreignKey: 'bars_id', onDelete: 'CASCADE' });
Biere.belongsTo(Bars, { foreignKey: 'bars_id' });

Bars.hasMany(Commande, { foreignKey: 'bars_id', onDelete: 'CASCADE' });
Commande.belongsTo(Bars, { foreignKey: 'bars_id' });

Biere.belongsToMany(Commande, { through: BiereCommande, foreignKey: 'biere_id' });
Commande.belongsToMany(Biere, { through: BiereCommande, foreignKey: 'commande_id' });

User.belongsTo(Bars, { foreignKey: 'bar_id' });
Bars.hasMany(User, { foreignKey: 'bar_id', onDelete: 'CASCADE' });


module.exports = {
    Bars,
    Biere,
    BiereCommande,
    Commande,
    User
};