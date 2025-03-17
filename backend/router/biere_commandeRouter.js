const express = require('express');
const router = express.Router();
const biereCommandeController = require('../controllers/biere_commandeController');

router.get('/commandes/:id_commande/biere', biereCommandeController.getBieresFromCommande);

// POST /commandes/:id_commande/bieres/:id_biere => Ajouter une bière à une commande
router.post('/commandes/:id_commande/biere/:id_biere', biereCommandeController.addBiereToCommande);

// DELETE /commandes/:id_commande/bieres/:id_biere => Supprimer une bière d'une commande
router.delete('/commandes/:id_commande/biere/:id_biere', biereCommandeController.deleteBiereFromCommande);

module.exports = router;