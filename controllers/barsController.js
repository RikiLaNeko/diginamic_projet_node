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

exports.getAlcoholDegreeBetweenMinPriceAndMaxPrice = async (req, res) => {
  const { id_bar } = req.params;
  const { prix_min, prix_max } = req.query;

  try {
      const beers = await Biere.findAll({
          where: {
              barId: id_bar,
              price: {
                  [Sequelize.Op.between]: [prix_min, prix_max] // Filtrer par prix entre prix_min et prix_max
              }
          }
      });

      const averageDegree = beers.reduce((acc, beer) => acc + beer.degree, 0) / beers.length;
      
      res.json({ average_degree: averageDegree });
  } catch (error) {
      res.status(500).json({ message: 'Erreur lors du calcul du degré d\'alcool moyen' });
  }
};

exports.getAlcoholDegreeOfBeersFromADate = async (req, res) => {
  const { id_bar } = req.params;
  const { date } = req.query;

  try {
      // Récupérer les commandes du bar à la date donnée
      const commandes = await Commande.findAll({
          where: {
              barId: id_bar,
              date: date
          },
          include: [
              {
                  model: Biere,
                  through: { attributes: ['quantity'] } // Inclure les bières liées à la commande
              }
          ]
      });

      // Calculer le degré moyen en prenant les bières des commandes
      const totalDegree = commandes.reduce((acc, commande) => {
          return acc + commande.Bieres.reduce((acc, biere) => {
              return acc + biere.degree;
          }, 0);
      }, 0);

      const totalBeers = commandes.reduce((acc, commande) => {
          return acc + commande.Bieres.length;
      }, 0);

      const averageDegree = totalDegree / totalBeers;

      res.json({ average_degree: averageDegree });
  } catch (error) {
      res.status(500).json({ message: 'Erreur lors du calcul du degré d\'alcool moyen des commandes' });
  }
};

exports.listBarOrdersFromDateAndBetweenMinPriceAndMaxPrice =  async (req, res) => {
  const { id_bar } = req.params;
  const { date, prix_min, prix_max } = req.query;

  try {
      const commandes = await Commande.findAll({
          where: {
              barId: id_bar,
              date: date,
              totalAmount: {
                  [Sequelize.Op.between]: [prix_min, prix_max]
              }
          }
      });
      
      res.json(commandes);
  } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des commandes' });
  }
};

exports.listBarOrdersFromDateAndBetweenMinPriceAndMaxPriceAndFinishStatus = async (req, res) => {
  const { id_bar } = req.params;
  const { date, prix_min, prix_max, status } = req.query;

  try {
      const commandes = await Commande.findAll({
          where: {
              barId: id_bar,
              date: date,
              totalAmount: {
                  [Sequelize.Op.between]: [prix_min, prix_max]
              },
              status: status // Filtrer par le statut des commandes
          }
      });
      
      res.json(commandes);
  } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des commandes' });
  }
};

exports.listBarOrdersFromDateAndBetweenMinPriceAndMaxPriceAndFinishStatusAndExampleName = async (req, res) => {
  const { id_bar } = req.params;
  const { date, prix_min, prix_max, status, name } = req.query;

  try {
      const commandes = await Commande.findAll({
          where: {
              barId: id_bar,
              date: date,
              totalAmount: {
                  [Sequelize.Op.between]: [prix_min, prix_max]
              },
              status: status,
              customerName: {
                  [Sequelize.Op.like]: `%${name}%` // Filtrer par le nom de client contenant 'example'
              }
          }
      });
      
      res.json(commandes);
  } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des commandes' });
  }
};

exports.getAlphabeticSortedBeers = async (req, res) => {
  const { id_bar } = req.params;
  const { sort } = req.query; // 'asc' ou 'desc'

  try {
      const beers = await Biere.findAll({
          where: {
              barId: id_bar
          },
          order: [
              ['name', sort === 'asc' ? 'ASC' : 'DESC'] // Trier par nom de bière en fonction de l'ordre demandé
          ]
      });

      res.json(beers);
  } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des bières' });
  }
};