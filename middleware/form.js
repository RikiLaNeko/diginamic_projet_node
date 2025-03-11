const { body, param, query } = require('express-validator');

const validateBar = [
    body('name').isString().notEmpty().withMessage('Le nom du bar est obligatoire et doit être une chaîne de caractères.'),
    body('adresse').isString().notEmpty().withMessage('L\'adresse du bar est obligatoire et doit être une chaîne de caractères.'),
    body('email').isEmail().withMessage('L\'email doit être valide.'),
    body('tel').optional().isString().withMessage('Le téléphone doit être une chaîne de caractères.'),
    body('description').optional().isString().withMessage('La description doit être une chaîne de caractères.')
];

const validateBiere = [
    body('name').isString().notEmpty().withMessage('Le nom de la bière est obligatoire et doit être une chaîne de caractères.'),
    body('degree').isFloat({ min: 0 }).withMessage('Le degré d\'alcool doit être un nombre positif.'),
    body('prix').isFloat({ min: 0 }).withMessage('Le prix doit être un nombre positif.'),
    body('description').optional().isString().withMessage('La description doit être une chaîne de caractères.')
];

const validateCommande = [
    body('name').isString().notEmpty().withMessage('Le nom de la commande est obligatoire et doit être une chaîne de caractères.'),
    body('prix').isFloat({ min: 0 }).withMessage('Le prix doit être un nombre positif.'),
    body('date').isISO8601().withMessage('La date doit être valide.'),
    body('status').isIn(['brouillon', 'en cours', 'terminée']).withMessage('Le statut doit être "brouillon", "en cours" ou "terminée".')
];

const validateBiereCommande = [
    param('id').isInt().withMessage('L\'ID de la commande doit être un entier.'),
    param('id_biere').isInt().withMessage('L\'ID de la bière doit être un entier.')
];

const validateQueryParams = [
    query('date').optional().isISO8601().withMessage('La date doit être valide.'),
    query('prix_min').optional().isFloat({ min: 0 }).withMessage('Le prix minimum doit être un nombre positif.'),
    query('prix_max').optional().isFloat({ min: 0 }).withMessage('Le prix maximum doit être un nombre positif.'),
    query('degree_min').optional().isFloat({ min: 0 }).withMessage('Le degré minimum doit être un nombre positif.'),
    query('degree_max').optional().isFloat({ min: 0 }).withMessage('Le degré maximum doit être un nombre positif.'),
    query('sort').optional().isIn(['asc', 'desc']).withMessage('Le tri doit être "asc" ou "desc".'),
    query('limit').optional().isInt({ min: 1 }).withMessage('La limite doit être un entier positif.'),
    query('offset').optional().isInt({ min: 0 }).withMessage('L\'offset doit être un entier positif.')
];

module.exports = {
    validateBar,
    validateBiere,
    validateCommande,
    validateBiereCommande,
    validateQueryParams
};