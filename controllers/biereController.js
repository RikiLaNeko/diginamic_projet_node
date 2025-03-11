/**
 * biereController.js
 * 
 * Ce contrôleur gère toutes les opérations CRUD liées aux bières.
 * 
 * Endpoints gérés :
 *  - POST /bars/:id_bar/biere   => Ajouter une bière à un bar
 *  - PUT /biere/:id_biere        => Modifier une bière
 *  - DELETE /biere/:id_biere     => Supprimer une bière d'un bar
 *  - GET /bars/:id_bar/biere     => Liste des bières d'un bar
 *  - GET /biere/:id_biere        => Détail d'une bière
 */

const { Biere, Bar } = require('../models');

/**
 * Ajouter une bière à un bar
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 * @returns {Object} - Retourne la bière créée
 */
exports.addBiereToBar = async (req, res) => {
  try {
    const { id_bar } = req.params;
    const { name, style, alcoholContent } = req.body;

    // Vérifier que le bar existe
    const bar = await Bar.findByPk(id_bar);
    if (!bar) {
      return res.status(404).json({ message: 'Bar introuvable.' });
    }

    // Créer une nouvelle bière associée au bar
    const newBiere = await Biere.create({
      name,
      style,
      alcoholContent,
      barId: id_bar, // Assurez-vous que votre modèle Biere possède une colonne barId (clé étrangère vers Bar)
    });

    return res.status(201).json({
      message: 'Bière ajoutée avec succès au bar.',
      biere: newBiere,
    });
  } catch (error) {
    console.error('Erreur lors de l’ajout de la bière :', error);
    return res.status(500).json({
      message: 'Une erreur est survenue lors de l’ajout de la bière.',
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
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 * @returns {Array} - Retourne la liste des bières pour le bar spécifié
 */
exports.getBiereListByBar = async (req, res) => {
  try {
    const { id_bar } = req.params;

    // Vérifier que le bar existe
    const bar = await Bar.findByPk(id_bar);
    if (!bar) {
      return res.status(404).json({ message: 'Bar introuvable.' });
    }

    // Récupérer la liste des bières associées au bar
    const bieres = await Biere.findAll({
      where: { barId: id_bar },
    });

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
