const Commande = require('../models/commande');
const PDFDocument = require('pdfkit'); // <-- import de pdfkit pour la méthode PDF

// Ajouter une commande à un bar
exports.addCommandeToBar = async (req, res) => {
  try {
    const { id_bar } = req.params;
    const { items, totalPrice } = req.body;

    const newCommande = await Commande.create({
      barId: id_bar,
      items,
      totalPrice,
    });

    return res.status(201).json({
      message: 'Commande ajoutée avec succès au bar.',
      commande: newCommande,
    });
  } catch (error) {
    console.error('Erreur lors de l’ajout de la commande :', error);
    return res.status(500).json({
      message: 'Une erreur est survenue lors de l’ajout de la commande.',
      error: error.message,
    });
  }
};

// Modifier une commande d'un bar
exports.updateCommande = async (req, res) => {
  try {
    const { id_commande } = req.params;
    const { items, totalPrice } = req.body;

    const commande = await Commande.findByPk(id_commande);
    if (!commande) {
      return res.status(404).json({ message: 'Commande introuvable.' });
    }

    commande.items = items || commande.items;
    commande.totalPrice = totalPrice || commande.totalPrice;

    await commande.save();

    return res.status(200).json({
      message: 'Commande mise à jour avec succès.',
      commande,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la commande :', error);
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
    console.error('Erreur lors de la suppression de la commande :', error);
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

    const commandes = await Commande.findAll({
      where: { barId: id_bar },
    });

    return res.status(200).json(commandes);
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes du bar :', error);
    return res.status(500).json({
      message: 'Une erreur est survenue lors de la récupération des commandes du bar.',
      error: error.message,
    });
  }
};

// Détail d'une commande d'un bar
exports.getCommandeById = async (req, res) => {
  try {
    const { id } = req.params;

    const commande = await Commande.findByPk(id);
    if (!commande) {
      return res.status(404).json({ message: 'Commande introuvable.' });
    }

    return res.status(200).json(commande);
  } catch (error) {
    console.error('Erreur lors de la récupération de la commande :', error);
    return res.status(500).json({
      message: 'Une erreur est survenue lors de la récupération de la commande.',
      error: error.message,
    });
  }
};

/**
 * Générer un PDF contenant les détails d'une commande
 * GET /commande/details/:id_commande
 *
 * Cette méthode utilise la librairie pdfkit pour créer un PDF
 * et l'envoyer dans la réponse.
 */
exports.getCommandeDetailsPdf = async (req, res) => {
  try {
    const { id_commande } = req.params;

    // Récupérer la commande par son ID
    const commande = await Commande.findByPk(id_commande);
    if (!commande) {
      return res.status(404).json({ message: 'Commande introuvable.' });
    }

    // Création du document PDF
    const doc = new PDFDocument();

    // Définir le header comme PDF
    res.setHeader('Content-Type', 'application/pdf');
    // Optionnel : pour forcer le téléchargement, on peut faire :
    // res.setHeader('Content-Disposition', 'attachment; filename="commande.pdf"');

    // Pipe le flux du PDF vers la réponse
    doc.pipe(res);

    // Contenu du PDF (personnalise selon tes champs)
    doc.fontSize(18).text(`Détails de la commande #${commande.id}`, { underline: true });
    doc.moveDown();
    // Par exemple, on peut afficher "items" et "totalPrice" si le modèle contient ces champs
    doc.fontSize(14).text(`Items : ${commande.items}`);
    doc.text(`Total Price : ${commande.totalPrice}`);
    
    // Si tu as un champ "createdAt" ou "date", tu peux l'afficher ici :
    // doc.text(`Date : ${commande.createdAt}`);

    doc.moveDown();
    doc.fontSize(12).text('Merci pour votre commande !', { align: 'center' });

    // Finaliser le PDF
    doc.end();
  } catch (error) {
    console.error('Erreur lors de la génération du PDF :', error);
    return res.status(500).json({
      message: 'Erreur lors de la génération du PDF.',
      error: error.message,
    });
  }
};
