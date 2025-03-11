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

// GET /bars/:id_bar/degree?prix_min=10&prix_max=20 => Calculer le degré d'alcool moyen des bières d'un bar dont le prix est compris entre prix_min et prix_max
router.get('/:id_bar/degree', barsController.getAlcoholDegreeBetweenMinPriceAndMaxPrice);

// GET /bars/:id_bar/degree?date=2021-01-01 => Calculer le degré d'alcool moyen des bières des commandes d'un bar à une date donnée
router.get('/:id_bar/degree', barsController.getAlcoholDegreeOfBeersFromADate);

// GET /bars/:id_bar/commandes?date=2021-01-01&prix_min=10&prix_max=20 => Lister les commandes d'un bar à une date donnée avec un prix compris entre prix_min et prix_max
router.get('/:id_bar/commandes', barsController.listBarOrdersFromDateAndBetweenMinPriceAndMaxPrice);

// GET /bars/:id_bar/commandes?date=2021-01-01&prix_min=10&prix_max=20&status=terminée => Lister les commandes d'un bar à une date donnée avec un prix compris entre prix_min et prix_max et un statut terminée
router.get('/:id_bar/commandes', barsController.listBarOrdersFromDateAndBetweenMinPriceAndMaxPriceAndFinishStatus)

// GET /bars/:id_bar/commandes?date=2021-01-01&prix_min=10&prix_max=20&status=terminée&name=example => Lister les commandes d'un bar à une date donnée avec un prix compris entre prix_min et prix_max, un statut terminée et un nom contenant example
router.get('/:id_bar/commandes', barsController.listBarOrdersFromDateAndBetweenMinPriceAndMaxPriceAndFinishStatusAndExampleName)

// GET /bars/:id_bar/biere?sort=asc => Lister les bières d'un bar triées par ordre alphabétique (asc ou desc)
router.get('/:id_bar/biere', barsController.getAlphabeticSortedBeers)

// Route POST

// POST /bars => Ajouter un bar
router.post('/', barsController.createBar);

// PUT /bars/:id_bar => Modifier un bar
router.put('/:id_bar', barsController.updateBar);

// Route DELETE

// DELETE /bars/:id_bar => Supprimer un bar
router.delete('/:id_bar', barsController.deleteBar);


module.exports = router;