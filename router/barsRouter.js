const express = require('express');
const router = express.Router();
const barsController = require('../controllers/barsController');

// Route GET

// GET /bars => Liste des bars
router.get('/', barsController.getAllBars);

// GET /bars/:id_bar => Détail d'un bar
router.get('/:id_bar', barsController.getBarById);

// GET /bars/:id_bar/commandes => Liste des commandes d'un bar à une date donnée ou avec un prix compris entre deux valeurs
router.get('/:id_bar/commandes', barsController.getBarOrders);

// GET /bars?ville=Paris => Liste des bars d'une ville donnée
// GET /bars?name=example => Liste des bars dont le nom contient "example"
router.get('/', barsController.getBarsByQuery);

// GET /bars/:id_bar/degree => Degré d'alcool moyen des bières d'un bar
router.get('/:id_bar/degree', barsController.getAverageAlcoholDegree);

// Route POST

// POST /bars => Ajouter un bar
router.post('/', barsController.createBar);

// PUT /bars/:id_bar => Modifier un bar
router.put('/:id_bar', barsController.updateBar);

// Route DELETE

// DELETE /bars/:id_bar => Supprimer un bar
router.delete('/:id_bar', barsController.deleteBar);


module.exports = router;