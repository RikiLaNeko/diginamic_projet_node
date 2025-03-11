const Commande = require('../models/commande');
const PDFDocument = require('pdfkit');

// Ajouter une commande à un bar
exports.addCommandeToBar = async (req, res) => {
  try {
    const { id_bar } = req.params;
    const { name, prix, date, status } = req.body;

    const newCommande = await Commande.create({
      name,
      prix,
      date: date || new Date(),
      status: status || 'brouillon',
      bars_id: id_bar
    });

    return res.status(201).json({
      message: 'Commande ajoutée avec succès au bar.',
      commande: newCommande,
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la commande:', error);
    return res.status(500).json({
      message: 'Une erreur est survenue lors de l\'ajout de la commande.',
      error: error.message,
    });
  }
};

// Modifier une commande d'un bar
exports.updateCommande = async (req, res) => {
  try {
    const { id_commande } = req.params;
    const { name, prix, date, status } = req.body;

    const commande = await Commande.findByPk(id_commande);
    if (!commande) {
      return res.status(404).json({ message: 'Commande introuvable.' });
    }

    // Hook in model will prevent updating if status is 'terminée'
    commande.name = name || commande.name;
    commande.prix = prix !== undefined ? prix : commande.prix;
    commande.date = date || commande.date;
    commande.status = status || commande.status;

    await commande.save();

    return res.status(200).json({
      message: 'Commande mise à jour avec succès.',
      commande,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la commande:', error);
    return res.status(500).json({
      message: 'Une erreur est survenue lors de la mise à jour de la commande.',
      error: error.message,
    });
  }
};

// Supprimer une commande d'un bar
exports.deleteCommande = async (req, res) => {
  try {
    const { id_commande } = req.params;

    const commande = await Commande.findByPk(id_commande);
    if (!commande) {
      return res.status(404).json({ message: 'Commande introuvable.' });
    }

    await commande.destroy();

    return res.status(200).json({
      message: 'Commande supprimée avec succès.',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la commande:', error);
    return res.status(500).json({
      message: 'Une erreur est survenue lors de la suppression de la commande.',
      error: error.message,
    });
  }
};


// Liste des commandes d'un bar
exports.getBarOrders = async (req, res) => {
  try {
    const { id_bar } = req.params;
    const { date, prix_min, prix_max, status, name } = req.query;

    const whereClause = { bars_id: id_bar };

    if (date) {
      whereClause.date = new Date(date);
    }

    if (prix_min && prix_max) {
      whereClause.prix = { [Op.between]: [parseFloat(prix_min), parseFloat(prix_max)] };
    } else if (prix_min) {
      whereClause.prix = { [Op.gte]: parseFloat(prix_min) };
    } else if (prix_max) {
      whereClause.prix = { [Op.lte]: parseFloat(prix_max) };
    }

    if (status) {
      whereClause.status = status;
    }

    if (name) {
      whereClause.name = { [Op.like]: `%${name}%` };
    }

    const commandes = await Commande.findAll({
      where: whereClause
    });

    return res.status(200).json(commandes);
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    return res.status(500).json({
      message: 'Une erreur est survenue lors de la récupération des commandes.',
      error: error.message,
    });
  }
};

// Détail d'une commande d'un bar
exports.getCommandeById = async (req, res) => {
  try {
    const { id_commande } = req.params;

    const commande = await Commande.findByPk(id_commande);
    if (!commande) {
      return res.status(404).json({ message: 'Commande introuvable.' });
    }

    return res.status(200).json(commande);
  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error);
    return res.status(500).json({
      message: 'Une erreur est survenue lors de la récupération de la commande.',
      error: error.message,
    });
  }
};

exports.getCommandeDetailsPdf = async (req, res) => {
  try {
    const { id_commande } = req.params;

    const commande = await Commande.findByPk(id_commande);
    if (!commande) {
      return res.status(404).json({ message: 'Commande introuvable.' });
    }

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);

    doc.fontSize(18).text(`Détails de la commande #${commande.id}`, { underline: true });
    doc.moveDown();
    doc.fontSize(14).text(`Nom : ${commande.name}`);
    doc.text(`Prix : ${commande.prix} €`);
    doc.text(`Date : ${commande.date.toLocaleDateString()}`);
    doc.text(`Statut : ${commande.status}`);

    doc.moveDown();
    doc.fontSize(12).text('Merci pour votre commande !', { align: 'center' });

    doc.end();
  } catch (error) {
    console.error('Erreur lors de la génération du PDF :', error);
    return res.status(500).json({
      message: 'Erreur lors de la génération du PDF.',
      error: error.message,
    });
  }
};