const express = require('express');
const router = express.Router();
const commandesController = require('../controllers/commandeController');
const { validateCommande } = require('../middleware/form');

// GET /commandes/:id => Détail d'une commande
router.get('/:id', commandesController.getCommandeById);

// PUT /commandes/:id_commande => Modifier une commande
router.put('/:id_commande', commandesController.updateCommande);

// DELETE /commandes/:id_commande => Supprimer une commande
router.delete('/:id_commande', commandesController.deleteCommande);

// GET /commandes/details/:id_commande => PDF d'une commande
router.get('/details/:id_commande', commandesController.getCommandeDetailsPdf);

module.exports = router;