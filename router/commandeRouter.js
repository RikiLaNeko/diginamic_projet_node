const express = require('express');
const router = express.Router();

// Exemple de modèle Sequelize pour 'Commande'
const Commande = require('../models/Commande');

// Récupérer toutes les commandes
router.get('/', async (req, res) => {
    try {
        const commandes = await Commande.findAll();
        res.json(commandes);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des commandes' });
    }
});

// Créer une nouvelle commande
router.post('/', async (req, res) => {
    try {
        const { customerName, totalAmount } = req.body;
        const newCommande = await Commande.create({ customerName, totalAmount });
        res.status(201).json(newCommande);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de la commande' });
    }
});

module.exports = router;