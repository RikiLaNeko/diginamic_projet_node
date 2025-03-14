/**
 * biere_commandeController.js
 *
 * Ce contrôleur gère l'association entre une bière  et une commande 
 * via la table pivot BiereCommande.
 *
 * Endpoints :
 *   - POST /commandes/:id_commande/biere/:id_biere  => addBiereToCommande
 *   - DELETE /commandes/:id_commande/biere/:id_biere => deleteBiereFromCommande
 *
 * Contraintes :
 *   - La commande et la bière doivent exister.
 *   - La quantité est optionnelle (valeur par défaut 1).
 */

const { Commande, Biere, BiereCommande } = require('../models/models');

/**
 * Récupérer toutes les bières d'une commande.
 * GET /commandes/:id_commande/biere
 *
 * @param {Object} req - Requête Express.
 * @param {Object} res - Réponse Express.
 * @returns {Object} - JSON contenant les bières de la commande.
 */
exports.getBieresFromCommande = async (req, res) => {
  try {
    const { id_commande } = req.params;

    // Vérifier que la commande existe
    const commande = await Commande.findByPk(id_commande);
    if (!commande) {
      return res.status(404).json({ message: 'Commande introuvable.' });
    }

    // Récupérer la commande avec ses bières associées
    const commandeWithBieres = await Commande.findByPk(id_commande, {
      include: [{
        model: Biere,
        through: {
          model: BiereCommande,
          attributes: ['quantity']
        }
      }]
    });

    if (!commandeWithBieres.Bieres) {
      return res.status(200).json([]);
    }

    return res.status(200).json(commandeWithBieres.Bieres);
  } catch (error) {
    console.error('Erreur dans getBieresFromCommande:', error);
    return res.status(500).json({
      message: "Erreur lors de la récupération des bières de la commande.",
      error: error.message,
    });
  }
};


/**
 * Ajouter une bière à une commande.
 * POST /commandes/:id_commande/biere/:id_biere
 *
 * @param {Object} req - Requête Express.
 * @param {Object} res - Réponse Express.
 * @returns {Object} - JSON contenant l'association créée.
 */
exports.addBiereToCommande = async (req, res) => {
  try {
    const { id_commande, id_biere } = req.params;
    const { quantity = 1 } = req.body; // Quantité par défaut à 1

    // on vérifier que la commande existe.
    const commande = await Commande.findByPk(id_commande);
    if (!commande) {
      return res.status(404).json({ message: 'Commande introuvable.' });
    }

    // on vérifie que la bière existe.
    const biere = await Biere.findByPk(id_biere);
    if (!biere) {
      return res.status(404).json({ message: 'Bière introuvable.' });
    }

    // Créer l'association dans la table BiereCommande.
    // Remarque : Les clés étrangères sont définies dans le modèle BiereCommande en tant que "biere_id" et "commande_id".
    const newAssociation = await BiereCommande.create({
      commande_id: id_commande,
      biere_id: id_biere,
      quantity,
    });

    return res.status(201).json({
      message: 'Bière ajoutée à la commande avec succès.',
      biereCommande: newAssociation,
    });
  } catch (error) {
    console.error('Erreur dans addBiereToCommande :', error);
    return res.status(500).json({
      message: "Erreur lors de l'ajout de la bière à la commande.",
      error: error.message,
    });
  }
};

/**
 * Supprimer une bière d'une commande.
 * DELETE /commandes/:id_commande/biere/:id_biere
 *
 * @param {Object} req - Requête Express.
 * @param {Object} res - Réponse Express.
 * @returns {Object} - JSON confirmant la suppression de l'association.
 */
exports.deleteBiereFromCommande = async (req, res) => {
  try {
    const { id_commande, id_biere } = req.params;

    // Rechercher l'association entre la commande et la bière.
    const association = await BiereCommande.findOne({
      where: {
        commande_id: id_commande,
        biere_id: id_biere,
      },
    });

    if (!association) {
      return res.status(404).json({ message: 'Association non trouvée ou déjà supprimée.' });
    }

    // Supprimer l'association.
    await association.destroy();

    return res.status(200).json({ message: 'Bière supprimée de la commande avec succès.' });
  } catch (error) {
    console.error('Erreur dans deleteBiereFromCommande :', error);
    return res.status(500).json({
      message: "Erreur lors de la suppression de la bière de la commande.",
      error: error.message,
    });
  }
};
