const request = require('supertest');
const { faker } = require('@faker-js/faker');
const app = require('../index');
const sequelize = require('../config/database');
const { Bars, Biere, Commande, BiereCommande } = require('../models/models');

describe('Biere-Commande API', () => {
  let testBar, testBiere, testCommande;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Create test data
    testBar = await Bars.create({
      name: faker.company.name(),
      adresse: faker.location.streetAddress(false),
      email: faker.internet.email()
    });

    testBiere = await Biere.create({
      name: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      degree: 5.5,
      prix: 4.5,
      bars_id: testBar.id
    });

    testCommande = await Commande.create({
      name: `Order ${faker.string.uuid()}`,
      prix: 25.50,
      bars_id: testBar.id,
      date: new Date().toISOString(), // Ensure the date is in ISO format
      status: 'en cours'
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /commandes/:id_commande/biere/:id_biere', () => {
    it('should add a beer to an order', async () => {
      const biereCommandeData = {
        quantity: 3
      };

      const response = await request(app)
          .post(`/biere_commande/commandes/${testCommande.id}/biere/${testBiere.id}`)  // Added prefix
          .send(biereCommandeData)
          .expect(201);

      expect(response.body).toHaveProperty('biereCommande');
    });
  });

  describe('GET /commandes/:id_commande/biere', () => {
    it('should get all beers for a specific order', async () => {
      // Don't create another association - already done in previous test

      const response = await request(app)
          .get(`/biere_commande/commandes/${testCommande.id}/biere`)
          .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
});