const express = require('express');
const router = express.Router();
const biereController = require('../controllers/biereController');

// Ajouter une bière à un bar
// Endpoint : POST /bars/:id_bar/biere
router.post('/bars/:id_bar/biere', biereController.addBiereToBar);

// Liste des bières d'un bar
// Endpoint : GET /bars/:id_bar/biere
router.get('/bars/:id_bar/biere', biereController.getBiereListByBar);

// Modifier une bière
// Endpoint : PUT /biere/:id_biere
router.put('/biere/:id_biere', biereController.updateBiere);

// Supprimer une bière d'un bar
// Endpoint : DELETE /biere/:id_biere
router.delete('/biere/:id_biere', biereController.deleteBiere);

// Détail d'une bière
// Endpoint : GET /biere/:id_biere
router.get('/biere/:id_biere', biereController.getBiereById);

module.exports = router;
