const Bar = require('./bars');
const Biere = require('./biere');
const BiereCommande = require('./biere_commande');
const Commande = require('./commande');

Bar.hasMany(Biere, { foreignKey: 'bars_id' });
Biere.belongsTo(Bar, { foreignKey: 'bars_id' });

Bar.hasMany(Commande, { foreignKey: 'bars_id' });
Commande.belongsTo(Bar, { foreignKey: 'bars_id' });

Biere.belongsToMany(Commande, { through: BiereCommande, foreignKey: 'biere_id' });
Commande.belongsToMany(Biere, { through: BiereCommande, foreignKey: 'commande_id' });

module.exports = {
    Bar,
    Biere,
    BiereCommande,
    Commande
};