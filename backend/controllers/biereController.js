/**
 * biereController.js
 * 
 * Ce contrôleur gère toutes les opérations CRUD liées aux bières.
 * 
 * Endpoints gérés :
 *  - POST /bars/:id_bar/bieres   => Ajouter une bière à un bar
 *  - PUT /bieres/:id_biere       => Modifier une bière
 *  - DELETE /bieres/:id_biere    => Supprimer une bière d'un bar
 *  - GET /bars/:id_bar/bieres    => Liste des bières d'un bar
 *  - GET /bieres/:id_biere       => Détail d'une bière
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
 *  - GET /bars/:id_bar/bieres?sort=desc
 *  - GET /bars/:id_bar/bieres?sort=asc&limit=10
 *  - GET /bars/:id_bar/bieres?sort=asc&limit=10&offset=5
 *  - GET /bars/:id_bar/bieres?sort=asc&limit=10&offset=5&degree_min=5&degree_max=10
 *  - GET /bars/:id_bar/bieres?sort=asc&limit=10&offset=5&degree_min=5&degree_max=10&prix_min=10&prix_max=20
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
 * GET /bieres/:id_biere
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

/**
 * Ajouter une nouvelle bière
 * Endpoint: POST /bieres
 *
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 * @returns {Object} - Retourne la bière créée
 */
exports.createBiere = async (req, res) => {
  try {
    const { name, description, degree, prix, bars_id } = req.body;

    // Vérification des champs obligatoires
    if (!name || degree === undefined || prix === undefined) {
      return res.status(400).json({ message: 'Les champs name, degree et prix sont obligatoires.' });
    }

    // Si un ID de bar est fourni, vérifier qu'il existe
    if (bars_id) {
      const bar = await Bars.findByPk(bars_id);
      if (!bar) {
        return res.status(404).json({ message: 'Bar introuvable.' });
      }
    }

    // Créer une nouvelle bière
    const newBiere = await Biere.create({
      name,
      description,
      degree,
      prix,
      bars_id
    });

    return res.status(201).json({
      message: 'Bière créée avec succès.',
      biere: newBiere,
    });
  } catch (error) {
    console.error('Erreur lors de la création de la bière :', error);
    return res.status(500).json({
      message: 'Une erreur est survenue lors de la création de la bière.',
      error: error.message,
    });
  }
};

/**
 * Récupérer toutes les bières
 * Endpoint: GET /bieres
 *
 * Supporte les paramètres de requête:
 * - sort: "asc" ou "desc" (tri par nom)
 * - limit: nombre d'éléments à retourner
 * - offset: nombre d'éléments à sauter
 * - degree_min, degree_max: filtres sur le degré d'alcool
 * - prix_min, prix_max: filtres sur le prix
 * - bars_id: filtre par bar
 *
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 * @returns {Array} - Retourne la liste des bières
 */
exports.getAllBieres = async (req, res) => {
  try {
    const { sort, limit, offset, degree_min, degree_max, prix_min, prix_max, bars_id } = req.query;

    // Construire la clause WHERE
    const whereClause = {};

    // Filtre par bar si spécifié
    if (bars_id !== undefined) {
      whereClause.bars_id = bars_id;
    }

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

    // Tri par nom
    const orderClause = [['name', (sort && sort.toLowerCase() === 'desc') ? 'DESC' : 'ASC']];

    // Construction des options
    const options = {
      where: whereClause,
      order: orderClause
    };

    if (limit !== undefined) {
      options.limit = parseInt(limit, 10);
    }
    if (offset !== undefined) {
      options.offset = parseInt(offset, 10);
    }

    // Récupérer toutes les bières
    const bieres = await Biere.findAll(options);
    return res.status(200).json(bieres);
  } catch (error) {
    console.error('Erreur lors de la récupération des bières :', error);
    return res.status(500).json({
      message: 'Une erreur est survenue lors de la récupération des bières.',
      error: error.message,
    });
  }
};
