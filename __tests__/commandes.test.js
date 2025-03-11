const request = require('supertest');
const { faker } = require('@faker-js/faker');
const app = require('../index');
const sequelize = require('../config/database');
const { Bars, Commande } = require('../models/models');

describe('Commandes API', () => {
  let testBar;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    testBar = await Bars.create({
      name: faker.company.name(),
      adresse: faker.location.streetAddress(),
      email: faker.internet.email()
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /bars/:id_bar/commandes', () => {
    it('should create a new order for a bar', async () => {
      const orderData = {
        name: `Order ${faker.string.uuid()}`,
        prix: faker.number.float({ min: 10, max: 100, precision: 0.01 }),
        date: faker.date.past(),
        status: 'en cours'
      };

      const response = await request(app)
        .post(`/bars/${testBar.id}/commandes`)
        .send(orderData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Commande ajoutée avec succès au bar.');
    });
  });

  describe('GET /bars/:id_bar/commandes', () => {
    it('should retrieve all orders for a bar', async () => {
      // Create a test order
      await Commande.create({
        name: `Order ${faker.string.uuid()}`,
        prix: 25.50,
        bars_id: testBar.id,
        date: new Date('2023-01-01'),
        status: 'terminée'
      });

      const response = await request(app)
        .get(`/bars/${testBar.id}/commandes`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should filter orders by date', async () => {
      const testDate = '2023-05-15';

      // Create an order with the specific date
      await Commande.create({
        name: `Dated Order`,
        prix: 30.00,
        bars_id: testBar.id,
        date: new Date(testDate),
        status: 'terminée'
      });

      const response = await request(app)
        .get(`/bars/${testBar.id}/commandes?date=${testDate}`)
        .expect(200);

      expect(response.body.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('PUT /commandes/:id_commande', () => {
    it('should update an order', async () => {
      const commande = await Commande.create({
        name: `Order ${faker.string.uuid()}`,
        prix: 25.50,
        bars_id: testBar.id,
        date: new Date('2023-01-01'),
        status: 'brouillon'
      });

      const updateData = {
        name: 'Updated Order Name',
        status: 'en cours'
      };

      const response = await request(app)
        .put(`/commandes/${commande.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Commande mise à jour avec succès.');
    });

    it('should not update a completed order', async () => {
      const commande = await Commande.create({
        name: `Completed Order`,
        prix: 45.00,
        bars_id: testBar.id,
        date: new Date('2023-01-01'),
        status: 'terminée'
      });

      await request(app)
        .put(`/commandes/${commande.id}`)
        .send({ name: 'Try to update' })
        .expect(500); // Should fail as completed orders can't be modified
    });
  });

  describe('DELETE /commandes/:id_commande', () => {
    it('should delete an order', async () => {
      const commande = await Commande.create({
        name: `Order to delete`,
        prix: 15.00,
        bars_id: testBar.id,
        date: new Date('2023-01-01'),
        status: 'brouillon'
      });

      await request(app)
        .delete(`/commandes/${commande.id}`)
        .expect(200);

      // Verify the order is deleted
      const deletedOrder = await Commande.findByPk(commande.id);
      expect(deletedOrder).toBeNull();
    });
  });
});