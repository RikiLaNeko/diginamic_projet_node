const express = require('express');
const router = express.Router();
const biereController = require('../controllers/biereController');

// Modifier une bière
// Endpoint : PUT /bieres/:id_biere
router.put('/:id_biere', biereController.updateBiere);

// Supprimer une bière d'un bar
// Endpoint : DELETE /bieres/:id_biere
router.delete('/:id_biere', biereController.deleteBiere);

// Détail d'une bière
// Endpoint : GET /bieres/:id_biere
router.get('/:id_biere', biereController.getBiereById);

// Liste des bières d'un bar
// Endpoint : GET /bieres
router.get('/', biereController.getAllBieres);

// Ajouter une bière à un bar
// Endpoint : POST /bieres
router.post('/', biereController.createBiere);

module.exports = router;