/**
 * barsController.js
 * 
 * Ce contrôleur gère toutes les opérations CRUD liées aux bars.
 * 
 * Endpoints gérés :
 *  - POST /bars         => createBar
 *  - PUT /bars/:id_bar  => updateBar
 *  - DELETE /bars/:id_bar => deleteBar
 *  - GET /bars          => getAllBars
 *  - GET /bars/:id_bar  => getBarById
 */

const { Bars } = require('../models/models');

/**
 * Créer un nouveau bar
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 * @returns {Object} - Retourne le bar créé
 */
exports.createBar = async (req, res) => {
  try {
    const { name, address, email } = req.body;

    // Création d'un bar dans la base de données
    const newBar = await Bars.create({
      name,
      address,
      email,
    });

    return res.status(201).json({
      message: 'Bar créé avec succès.',
      bar: newBar,
    });
  } catch (error) {
    console.error('Erreur lors de la création du bar :', error);
    return res.status(500).json({
      message: 'Une erreur est survenue lors de la création du bar.',
      error: error.message,
    });
  }
};

/**
 * Mettre à jour un bar existant
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 * @returns {Object} - Retourne le bar mis à jour
 */
exports.updateBar = async (req, res) => {
  try {
    const { id_bar } = req.params;
    const { name, address, city } = req.body;

    // Recherche du bar par son ID
    const bar = await Bars.findByPk(id_bar);
    if (!bar) {
      return res.status(404).json({ message: 'Bar introuvable.' });
    }

    // Mise à jour des champs
    bar.name = name || bar.name;
    bar.address = address || bar.address;
    bar.city = city || bar.city;

    await bar.save();

    return res.status(200).json({
      message: 'Bar mis à jour avec succès.',
      bar,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du bar :', error);
    return res.status(500).json({
      message: 'Une erreur est survenue lors de la mise à jour du bar.',
      error: error.message,
    });
  }
};

/**
 * Supprimer un bar
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 * @returns {Object} - Retourne un message de succès
 */
exports.deleteBar = async (req, res) => {
  try {
    const { id_bar } = req.params;

    // Recherche du bar par son ID
    const bar = await Bars.findByPk(id_bar);
    if (!bar) {
      return res.status(404).json({ message: 'Bar introuvable.' });
    }

    await bar.destroy();

    return res.status(200).json({
      message: 'Bar supprimé avec succès.',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du bar :', error);
    return res.status(500).json({
      message: 'Une erreur est survenue lors de la suppression du bar.',
      error: error.message,
    });
  }
};

/**
 * Récupérer la liste de tous les bars
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 * @returns {Array} - Tableau contenant tous les bars
 */
exports.getAllBars = async (req, res) => {
  try {
    const bars = await Bars.findAll();
    return res.status(200).json(bars);
  } catch (error) {
    console.error('Erreur lors de la récupération des bars :', error);
    return res.status(500).json({
      message: 'Une erreur est survenue lors de la récupération des bars.',
      error: error.message,
    });
  }
};

/**
 * Récupérer un bar par son ID
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 * @returns {Object} - Retourne le bar correspondant
 */
exports.getBarById = async (req, res) => {
  try {
    const { id_bar } = req.params;

    // Recherche du bar par son ID
    const bar = await Bars.findByPk(id_bar);
    if (!bar) {
      return res.status(404).json({ message: 'Bar introuvable.' });
    }

    return res.status(200).json(bar);
  } catch (error) {
    console.error('Erreur lors de la récupération du bar :', error);
    return res.status(500).json({
      message: 'Une erreur est survenue lors de la récupération du bar.',
      error: error.message,
    });
  }
};
