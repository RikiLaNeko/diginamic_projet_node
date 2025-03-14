const express = require('express');
const router = express.Router();
const biereController = require('../backend/controllers/biereController');

// Modifier une bière
// Endpoint : PUT /biere/:id_biere
router.put('/:id_biere', biereController.updateBiere);

// Supprimer une bière d'un bar
// Endpoint : DELETE /biere/:id_biere
router.delete('/:id_biere', biereController.deleteBiere);

// Détail d'une bière
// Endpoint : GET /biere/:id_biere
router.get('/:id_biere', biereController.getBiereById);

module.exports = router;