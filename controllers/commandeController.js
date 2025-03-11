/**
 * commandeController.js
 *
 * Ce contrôleur gère les opérations CRUD sur les commandes liées à un bar.
 *
 * Endpoints :
 *   - POST /bars/:id_bar/commandes   => createCommandeForBar
 *   - PUT /commandes/:id_commande      => updateCommande
 *   - DELETE /commandes/:id_commande   => deleteCommande
 *   - GET /bars/:id_bar/commandes      => getCommandesByBar
 *   - GET /commandes/:id               => getCommandeById
 *
 * Contraintes :
 *   - Tous les champs obligatoires doivent être renseignés.
 *   - Le prix d'une commande doit être positif.
 *   - Le statut doit être "brouillon", "en cours" ou "terminée".
 *   - Une commande ne peut pas être modifiée si son statut est "terminée".
 *   - La date d'une commande ne peut pas être supérieure à la date du jour.
 */

const { Bars, Commande } = require('../models/models');

/**
 * Créer une commande pour un bar.
 * POST /bars/:id_bar/commandes
 *
 * @param {Object} req - Requête Express.
 * @param {Object} res - Réponse Express.
 * @returns {Object} - JSON contenant la commande créée.
 */
exports.createCommandeForBar = async (req, res) => {
  try {
    const { id_bar } = req.params;
    const { name, prix, date, status } = req.body;

    // Vérifier que le bar existe.
    const bar = await Bars.findByPk(id_bar);
    if (!bar) {
      return res.status(404).json({ message: 'Bar introuvable.' });
    }

    // Création de la commande 
    const newCommande = await Commande.create({
      name,      
      prix,      
      date,      
      status,    
      bars_id: id_bar,  
    });

    return res.status(201).json({
      message: 'Commande créée avec succès pour ce bar.',
      commande: newCommande,
    });
  } catch (error) {
    console.error('Erreur dans createCommandeForBar :', error);
    return res.status(500).json({
      message: 'Erreur lors de la création de la commande.',
      error: error.message,
    });
  }
};

/**
 * Modifier une commande.
 * PUT /commandes/:id_commande
 *
 * Interdit de modifier une commande si son statut est "terminée".
 *
 * @param {Object} req - Requête Express.
 * @param {Object} res - Réponse Express.
 * @returns {Object} - JSON contenant la commande modifiée.
 */
exports.updateCommande = async (req, res) => {
  try {
    const { id_commande } = req.params;
    const { name, prix, date, status } = req.body;

    // Recherche de la commande.
    const commande = await Commande.findByPk(id_commande);
    if (!commande) {
      return res.status(404).json({ message: 'Commande introuvable.' });
    }

    // Interdire la modification si la commande est terminée.
    if (commande.status === 'terminée') {
      return res.status(400).json({ message: 'Une commande terminée ne peut pas être modifiée.' });
    }

    // Mise à jour des champs .
    commande.name = (name !== undefined) ? name : commande.name;
    commande.prix = (prix !== undefined) ? prix : commande.prix;
    commande.date = (date !== undefined) ? date : commande.date;
    commande.status = (status !== undefined) ? status : commande.status;

    await commande.save();

    return res.status(200).json({
      message: 'Commande mise à jour avec succès.',
      commande,
    });
  } catch (error) {
    console.error('Erreur dans updateCommande :', error);
    return res.status(500).json({
      message: 'Erreur lors de la mise à jour de la commande.',
      error: error.message,
    });
  }
};

/**
 * Supprimer une commande.
 * DELETE /commandes/:id_commande
 *
 * La suppression d'une commande supprimera automatiquement toutes les associations dans biereCommande (grâce à la cascade).
 *
 * @param {Object} req - Requête Express.  
 * @param {Object} res - Réponse Express.
 * @returns {Object} - JSON confirmant la suppression.
 */
exports.deleteCommande = async (req, res) => {
  try {
    const { id_commande } = req.params;

    // Recherche de la commande.
    const commande = await Commande.findByPk(id_commande);
    if (!commande) {
      return res.status(404).json({ message: 'Commande introuvable.' });
    }

    // Suppression de la commande.
    await commande.destroy();
    return res.status(200).json({ message: 'Commande supprimée avec succès.' });
  } catch (error) {
    console.error('Erreur dans deleteCommande :', error);
    return res.status(500).json({
      message: 'Erreur lors de la suppression de la commande.',
      error: error.message,
    });
  }
};

/**
 * Récupérer la liste des commandes d'un bar.
 * GET /bars/:id_bar/commandes
 *
 * @param {Object} req - Requête Express.
 * @param {Object} res - Réponse Express.
 * @returns {Array} - JSON contenant la liste des commandes du bar.
 */
exports.getCommandesByBar = async (req, res) => {
  try {
    const { id_bar } = req.params;

    // Vérifier que le bar existe.
    const bar = await Bars.findByPk(id_bar);
    if (!bar) {
      return res.status(404).json({ message: 'Bar introuvable.' });
    }

    // Récupérer toutes les commandes associées à ce bar.
    const commandes = await Commande.findAll({ where: { bars_id: id_bar } });

    return res.status(200).json(commandes);
  } catch (error) {
    console.error('Erreur dans getCommandesByBar :', error);
    return res.status(500).json({
      message: 'Erreur lors de la récupération des commandes du bar.',
      error: error.message,
    });
  }
};

/**
 * Récupérer le détail d'une commande.
 * GET /commandes/:id
 *
 * @param {Object} req - Requête Express.
 * @param {Object} res - Réponse Express.
 * @returns {Object} - JSON contenant les détails de la commande.
 */
exports.getCommandeById = async (req, res) => {
  try {
    const { id } = req.params;

    // Recherche de la commande par son ID.
    const commande = await Commande.findByPk(id);
    if (!commande) {
      return res.status(404).json({ message: 'Commande introuvable.' });
    }

    return res.status(200).json(commande);
  } catch (error) {
    console.error('Erreur dans getCommandeById :', error);
    return res.status(500).json({
      message: 'Erreur lors de la récupération de la commande.',
      error: error.message,
    });
  }
};
