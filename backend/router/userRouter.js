const express = require('express');
const router = express.Router();
const userController = require('../backend/controllers/userController');



// POST /users/register => Inscription d'un utilisateur
router.post('/register', userController.register);

// POST /users/login => Connexion d'un utilisateur
router.post('/login', userController.login);

module.exports = router;

