const { User } = require('../models/models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

if (!process.env.JWT_SECRET) {
  console.warn('WARNING: Using default JWT secret. Set JWT_SECRET environment variable for security!');
}

/**
 * Inscription d'un utilisateur
 *
 * Attendu dans req.body :
 *   - name: Nom de l'utilisateur
 *   - email: Email
 *   - password: Mot de passe en clair
 *
 * Ce contrôleur vérifie l'unicité de l'email, hash le mot de passe,
 * crée l'utilisateur et génère un token JWT valide pendant 2 heures.
 * La réponse renvoie l'ID, le nom, l'email et le token de l'utilisateur.
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Vérifier si un utilisateur avec cet email existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    // Hash du mot de passe avec un salt de 10
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur dans la base de données
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // Génération d'un token JWT (valable 2 heures)
    const token = jwt.sign(
        { userId: newUser.id, email: newUser.email },
        JWT_SECRET,
        { expiresIn: '2h' }
    );

    // Stockage du token dans l'utilisateur (optionnel)
    newUser.token = token;
    await newUser.save();

    // Réponse sans renvoyer le mot de passe
    return res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      token: newUser.token
    });
  } catch (err) {
    console.error('Erreur lors de l\'inscription:', err);
    return res.status(500).json({ message: 'Erreur lors de l\'inscription' });
  }
};

/**
 * Connexion d'un utilisateur
 *
 * Attendu dans req.body :
 *   - name: username de l'utilisateur
 *   - password: Mot de passe en clair
 *
 * Ce contrôleur vérifie les identifiants, et si l'utilisateur existe et que le
 * mot de passe est correct, il génère un nouveau token JWT valide pendant 2 heures.
 * La réponse renvoie l'ID, le nom, l'email et le token de l'utilisateur.
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
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }

    // Génération d'un nouveau token JWT (valable 2 heures)
    const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '2h' }
    );

    // Mise à jour du token dans la base
    user.token = token;
    await user.save();

    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: user.token
    });
  } catch (err) {
    console.error('Erreur lors de la connexion:', err);
    return res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
};
