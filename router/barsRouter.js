const express = require('express');
const router = express.Router();
const barsController = require('../controllers/barsController');

// POST /bars => Ajouter un bar
router.post('/', barsController.createBar);

// PUT /bars/:id_bar => Modifier un bar
router.put('/:id_bar', barsController.updateBar);

// DELETE /bars/:id_bar => Supprimer un bar
router.delete('/:id_bar', barsController.deleteBar);

// GET /bars => Liste des bars
router.get('/', barsController.getAllBars);

// GET /bars/:id_bar => Détail d'un bar
router.get('/:id_bar', barsController.getBarById);

module.exports = router;
