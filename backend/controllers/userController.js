const { User } = require('../models/models');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

if (!process.env.JWT_SECRET) {
  console.warn('WARNING: Using default JWT secret. Set JWT_SECRET environment variable for security!');
}

/**
 * Inscription d'un utilisateur
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Vérifier si un utilisateur avec cet email existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    // Création de l'utilisateur dans la base de données
    const newUser = await User.create({ name, email, password });

    // Génération du token JWT (valable 2 heures)
    const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '2h' });

    // Stockage du token
    newUser.token = token;
    await newUser.save();

    return res.status(201).json({ id: newUser.id, name: newUser.name, email: newUser.email, token });
  } catch (err) {
    console.error('Erreur lors de l\'inscription:', err);
    return res.status(500).json({ message: 'Erreur lors de l\'inscription' });
  }
};

/**
 * Connexion d'un utilisateur
 */
exports.login = async (req, res) => {
  try {
    const { name, password } = req.body;

    // Recherche de l'utilisateur par name
    const user = await User.findOne({ where: { name } });
    if (!user) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }

    // Vérification du mot de passe
    const isMatch = await user.validPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }

    // Génération d'un NOUVEAU token JWT à chaque connexion
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '2h' });

    // Mise à jour du token dans la base de données
    user.token = token;
    await user.save();

    return res.status(200).json({ id: user.id, name: user.name, email: user.email, token });
  } catch (err) {
    console.error('Erreur lors de la connexion:', err);
    return res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
};
