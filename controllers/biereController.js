/**
 * biereController.js
 * 
 * Ce contrôleur gère toutes les opérations CRUD liées aux bières.
 * 
 * Endpoints gérés :
 *  - POST /bars/:id_bar/biere   => Ajouter une bière à un bar
 *  - PUT /biere/:id_biere       => Modifier une bière
 *  - DELETE /biere/:id_biere    => Supprimer une bière d'un bar
 *  - GET /bars/:id_bar/biere    => Liste des bières d'un bar
 *  - GET /biere/:id_biere       => Détail d'une bière
 */

const { Op } = require('sequelize');
const { Biere, Bars } = require('../models/models');

/**
 * Ajouter une bière à un bar
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 * @returns {Object} - Retourne la bière créée
 */
exports.addBiereToBar = async (req, res) => {
  try {
    const { id_bar } = req.params;
    const { name, description, degree, prix } = req.body;

    // Vérifier que le bar existe
    const bar = await Bars.findByPk(id_bar);
    if (!bar) {
      return res.status(404).json({ message: 'Bar introuvable.' });
    }

    // Créer une nouvelle bière associée au bar
    const newBiere = await Biere.create({
      name,
      description,
      degree,
      prix,
      bars_id: id_bar, // Utiliser bars_id au lieu de barId
    });

    return res.status(201).json({
      message: 'Bière ajoutée avec succès au bar.',
      biere: newBiere,
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la bière :', error);
    return res.status(500).json({
      message: 'Une erreur est survenue lors de l\'ajout de la bière.',
      error: error.message,
    });
  }
};

/**
 * Modifier une bière
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 * @returns {Object} - Retourne la bière modifiée
 */
exports.updateBiere = async (req, res) => {
  try {
    const { id_biere } = req.params;
    const { name, style, alcoholContent } = req.body;

    // Recherche de la bière par son ID
    const biere = await Biere.findByPk(id_biere);
    if (!biere) {
      return res.status(404).json({ message: 'Bière introuvable.' });
    }

    // Mise à jour des champs si fournis
    biere.name = name || biere.name;
    biere.style = style || biere.style;
    biere.alcoholContent = alcoholContent || biere.alcoholContent;

    await biere.save();

    return res.status(200).json({
      message: 'Bière mise à jour avec succès.',
      biere,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la bière :', error);
    return res.status(500).json({
      message: 'Une erreur est survenue lors de la mise à jour de la bière.',
      error: error.message,
    });
  }
};

/**
 * Supprimer une bière
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 * @returns {Object} - Retourne un message de succès
 */
exports.deleteBiere = async (req, res) => {
  try {
    const { id_biere } = req.params;

    // Recherche de la bière par son ID
    const biere = await Biere.findByPk(id_biere);
    if (!biere) {
      return res.status(404).json({ message: 'Bière introuvable.' });
    }

    await biere.destroy();

    return res.status(200).json({
      message: 'Bière supprimée avec succès.',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la bière :', error);
    return res.status(500).json({
      message: 'Une erreur est survenue lors de la suppression de la bière.',
      error: error.message,
    });
  }
};

/**
 * Récupérer la liste des bières d'un bar
 * (version enrichie pour gérer le tri, la pagination et les filtres sur le degré/prix)
 * 
 * Endpoints avancés :
 *  - GET /bars/:id_bar/biere?sort=desc
 *  - GET /bars/:id_bar/biere?sort=asc&limit=10
 *  - GET /bars/:id_bar/biere?sort=asc&limit=10&offset=5
 *  - GET /bars/:id_bar/biere?sort=asc&limit=10&offset=5&degree_min=5&degree_max=10
 *  - GET /bars/:id_bar/biere?sort=asc&limit=10&offset=5&degree_min=5&degree_max=10&prix_min=10&prix_max=20
 *
 * @param {Object} req - Objet requête Express
 *   - params.id_bar : l'ID du bar
 *   - query.sort : "asc" ou "desc"
 *   - query.limit, query.offset : pagination
 *   - query.degree_min, query.degree_max : filtre sur le degré d'alcool
 *   - query.prix_min, query.prix_max : filtre sur le prix
 * @param {Object} res - Objet réponse Express
 * @returns {Array} - Retourne la liste des bières correspondant aux filtres
 */
exports.getBiereListByBar = async (req, res) => {
  try {
    const { id_bar } = req.params;
    const { sort, limit, offset, degree_min, degree_max, prix_min, prix_max } = req.query;

    // Vérifier que le bar existe
    const bar = await Bars.findByPk(id_bar);
    if (!bar) {
      return res.status(404).json({ message: 'Bar introuvable.' });
    }

    // Construire la clause WHERE
    const whereClause = { bars_id: id_bar };

    // Filtre sur le degré d'alcool
    if (degree_min !== undefined && degree_max !== undefined) {
      whereClause.degree = { [Op.between]: [parseFloat(degree_min), parseFloat(degree_max)] };
    } else if (degree_min !== undefined) {
      whereClause.degree = { [Op.gte]: parseFloat(degree_min) };
    } else if (degree_max !== undefined) {
      whereClause.degree = { [Op.lte]: parseFloat(degree_max) };
    }

    // Filtre sur le prix
    if (prix_min !== undefined && prix_max !== undefined) {
      whereClause.prix = { [Op.between]: [parseFloat(prix_min), parseFloat(prix_max)] };
    } else if (prix_min !== undefined) {
      whereClause.prix = { [Op.gte]: parseFloat(prix_min) };
    } else if (prix_max !== undefined) {
      whereClause.prix = { [Op.lte]: parseFloat(prix_max) };
    }

    // Tri par le champ "name" (ascendant par défaut, "desc" si paramètre sort=desc)
    const orderClause = [['name', (sort && sort.toLowerCase() === 'desc') ? 'DESC' : 'ASC']];

    // Construction des options
    const options = { where: whereClause, order: orderClause };
    if (limit !== undefined) {
      options.limit = parseInt(limit, 10);
    }
    if (offset !== undefined) {
      options.offset = parseInt(offset, 10);
    }

    // Récupérer la liste des bières
    const bieres = await Biere.findAll(options);
    return res.status(200).json(bieres);
  } catch (error) {
    console.error('Erreur lors de la récupération des bières du bar :', error);
    return res.status(500).json({
      message: 'Une erreur est survenue lors de la récupération des bières du bar.',
      error: error.message,
    });
  }
};

/**
 * Récupérer le détail d'une bière
 * GET /biere/:id_biere
 * 
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 * @returns {Object} - Retourne les détails de la bière
 */
exports.getBiereById = async (req, res) => {
  try {
    const { id_biere } = req.params;

    // Recherche de la bière par son ID
    const biere = await Biere.findByPk(id_biere);
    if (!biere) {
      return res.status(404).json({ message: 'Bière introuvable.' });
    }

    return res.status(200).json(biere);
  } catch (error) {
    console.error('Erreur lors de la récupération de la bière :', error);
    return res.status(500).json({
      message: 'Une erreur est survenue lors de la récupération de la bière.',
      error: error.message,
    });
  }
};
