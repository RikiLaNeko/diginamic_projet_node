const request = require('supertest');
const { faker } = require('@faker-js/faker');
const app = require('../index');
const { Bars, Biere, Commande, BiereCommande } = require('../models/models');

describe('Biere-Commande API', () => {
  let testBar, testBiere, testCommande;

  beforeAll(async () => {
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
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'en cours'
    });
  });

  // No sequelize.close() needed

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

      const response = await request(app)
          .get(`/biere_commande/commandes/${testCommande.id}/biere`)
          .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
});