const express = require('express');
const barsRouter = require('./barsRouter');
const biereRouter = require('./biereRouter');
const commandeRouter = require('./commandeRouter');
const biereCommandeRouter = require('./biere_commandeRouter');
const userRouter = require('./userRouter');

const router = express.Router();

router.use('/bars', barsRouter);
router.use('/biere', biereRouter);
router.use('/commandes', commandeRouter);
router.use('/biere_commande', biereCommandeRouter);
router.use('/users', userRouter);

module.exports = router;