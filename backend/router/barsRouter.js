const express = require('express');
const router = express.Router();
const barsController = require('../backend/controllers/barsController');
const biereController = require('../backend/controllers/biereController');
const commandeController = require('../backend/controllers/commandeController');
const auth = require('../backend/middleware/auth');

// GET /bars => Liste des bars
router.get('/', barsController.getAllBars);

// GET /bars?ville=Paris | GET /bars?name=example
router.get('/', barsController.getBarsByQuery);

// POST /bars => Ajouter un bar
router.post('/', auth , barsController.createBar);

// GET /bars/:id_bar => Détail d'un bar
router.get('/:id_bar', barsController.getBarById);

// PUT /bars/:id_bar => Modifier un bar
router.put('/:id_bar', auth , barsController.updateBar);

// DELETE /bars/:id_bar => Supprimer un bar
router.delete('/:id_bar', auth , barsController.deleteBar);

// Toutes les routes liées au degré d'alcool
router.get('/:id_bar/degree', barsController.getAverageAlcoholDegree);

// POST /bars/:id_bar/biere => Ajouter une bière à un bar
router.post('/:id_bar/biere', auth , biereController.addBiereToBar);

// GET /bars/:id_bar/biere => Liste des bières d'un bar (avec tous les filtres)
router.get('/:id_bar/biere', biereController.getBiereListByBar);

// POST /bars/:id_bar/commandes => Ajouter une commande
router.post('/:id_bar/commandes', auth , commandeController.addCommandeToBar);

// GET /bars/:id_bar/commandes => Liste des commandes (avec tous les filtres)
router.get('/:id_bar/commandes', commandeController.getBarOrders);

module.exports = router;