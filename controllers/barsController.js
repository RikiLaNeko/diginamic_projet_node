const { Bars, Orders, Beers } = require('../models/models');
const { Op } = require('sequelize');

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

/**
 * Récupérer les commandes d'un bar à une date donnée ou avec un prix compris entre deux valeurs
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 * @returns {Array} - Tableau contenant les commandes
 */
exports.getBarOrders = async (req, res) => {
  try {
    const { id_bar } = req.params;
    const { date, prix_min, prix_max } = req.query;
    const whereClause = { barId: id_bar };

    if (date) {
      whereClause.date = date;
    }
    if (prix_min && prix_max) {
      whereClause.price = { [Op.between]: [prix_min, prix_max] };
    }

    const orders = await Orders.findAll({ where: whereClause });
    return res.status(200).json(orders);
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes :', error);
    return res.status(500).json({
      message: 'Une erreur est survenue lors de la récupération des commandes.',
      error: error.message,
    });
  }
};

/**
 * Récupérer les bars par ville ou par nom
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 * @returns {Array} - Tableau contenant les bars
 */
exports.getBarsByQuery = async (req, res) => {
  try {
    const { ville, name } = req.query;
    const whereClause = {};

    if (ville) {
      whereClause.city = ville;
    }
    if (name) {
      whereClause.name = { [Op.like]: `%${name}%` };
    }

    const bars = await Bars.findAll({ where: whereClause });
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
 * Récupérer le degré d'alcool moyen des bières d'un bar
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 * @returns {Object} - Retourne le degré d'alcool moyen
 */
exports.getAverageAlcoholDegree = async (req, res) => {
  try {
    const { id_bar } = req.params;

    const beers = await Beers.findAll({ where: { barId: id_bar } });
    if (beers.length === 0) {
      return res.status(404).json({ message: 'Aucune bière trouvée pour ce bar.' });
    }

    const totalDegree = beers.reduce((sum, beer) => sum + beer.alcoholDegree, 0);
    const averageDegree = totalDegree / beers.length;

    return res.status(200).json({ averageAlcoholDegree: averageDegree });
  } catch (error) {
    console.error('Erreur lors de la récupération du degré d\'alcool moyen :', error);
    return res.status(500).json({
      message: 'Une erreur est survenue lors de la récupération du degré d\'alcool moyen.',
      error: error.message,
    });
  }
};