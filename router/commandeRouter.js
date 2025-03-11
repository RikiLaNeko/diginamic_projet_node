const express = require('express');
const router = express.Router();
const commandesController = require('../controllers/commandeController');

// POST /bars/:id_bar/commandes => Ajouter une commande à un bar
router.post('/bars/:id_bar/commandes', commandesController.addCommandeToBar);

// PUT /commandes/:id_commande => Modifier une commande d'un bar
router.put('/commandes/:id_commande', commandesController.updateCommande);

// DELETE /commandes/:id_commande => Supprimer une commande d'un bar
router.delete('/commandes/:id_commande', commandesController.deleteCommande);

// GET /bars/:id_bar/commandes => Liste des commandes d'un bar
router.get('/bars/:id_bar/commandes', commandesController.getBarOrders);

// GET /commandes/:id => Détail d'une commande d'un bar
router.get('/commandes/:id', commandesController.getCommandeById);

// Endpoint PDF
router.get('/details/:id_commande', commandeController.getCommandeDetailsPdf);

module.exports = router;