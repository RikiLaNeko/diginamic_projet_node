const express = require('express');
const router = express.Router();

// Exemple de modèle Sequelize pour la relation BiereCommande
const BiereCommande = require('../models/BiereCommande');

// Récupérer toutes les bières d'une commande spécifique
router.get('/:commandeId', async (req, res) => {
    try {
        const biereCommandes = await BiereCommande.findAll({ where: { commandeId: req.params.commandeId } });
        res.json(biereCommandes);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des bières de la commande' });
    }
});

// Ajouter une bière à une commande
router.post('/', async (req, res) => {
    try {
        const { commandeId, biereId, quantity } = req.body;
        const newBiereCommande = await BiereCommande.create({ commandeId, biereId, quantity });
        res.status(201).json(newBiereCommande);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'ajout de la bière à la commande' });
    }
});

module.exports = router;