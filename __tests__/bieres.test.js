const request = require('supertest');
const { faker } = require('@faker-js/faker');
const app = require('../index');
const { Bars, Biere } = require('../models/models');

describe('Bieres API', () => {
  let testBar;

  beforeAll(async () => {
    testBar = await Bars.create({
      name: faker.company.name(),
      adresse: faker.location.streetAddress(),
      email: faker.internet.email()
    });
  });

  describe('POST /bars/:id_bar/biere', () => {
    it('should add a beer to a bar', async () => {
      const biereData = {
        name: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        degree: faker.number.float({ min: 4, max: 12, precision: 0.1 }),
        prix: faker.number.float({ min: 3, max: 10, precision: 0.01 })
      };

      const response = await request(app)
          .post(`/bars/${testBar.id}/biere`)
          .send(biereData)
          .expect(201);

      expect(response.body).toHaveProperty('message', 'Bière ajoutée avec succès au bar.');
      expect(response.body.biere).toHaveProperty('name', biereData.name);
    });
  });

  describe('GET /bars/:id_bar/biere', () => {
    it('should retrieve all beers for a bar', async () => {
      // Add some test beers to the bar
      await Biere.create({
        name: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        degree: 5.5,
        prix: 4.5,
        bars_id: testBar.id
      });

      const response = await request(app)
          .get(`/bars/${testBar.id}/biere`)
          .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should filter beers by price range', async () => {
      // Create beers with different prices
      await Biere.create({
        name: 'Cheap Beer',
        degree: 4.0,
        prix: 3.0,
        bars_id: testBar.id
      });

      await Biere.create({
        name: 'Expensive Beer',
        degree: 8.0,
        prix: 9.0,
        bars_id: testBar.id
      });

      const response = await request(app)
          .get(`/bars/${testBar.id}/biere?prix_min=8&prix_max=10`)
          .expect(200);

      expect(response.body.length).toBeGreaterThanOrEqual(1);
      expect(response.body[0]).toHaveProperty('name', 'Expensive Beer');
    });
  });

  describe('PUT /biere/:id_biere', () => {
    it('should update a beer', async () => {
      const biere = await Biere.create({
        name: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        degree: 5.5,
        prix: 4.5,
        bars_id: testBar.id
      });

      const updateData = {
        name: 'Updated Beer Name',
        prix: 5.5
      };

      const response = await request(app)
          .put(`/biere/${biere.id}`)
          .send(updateData)
          .expect(200);

      expect(response.body.biere).toHaveProperty('name', updateData.name);
    });
  });

  describe('DELETE /biere/:id_biere', () => {
    it('should delete a beer', async () => {
      const biere = await Biere.create({
        name: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        degree: 5.5,
        prix: 4.5,
        bars_id: testBar.id
      });

      await request(app)
          .delete(`/biere/${biere.id}`)
          .expect(200);

      // Verify the beer is deleted
      const deletedBiere = await Biere.findByPk(biere.id);
      expect(deletedBiere).toBeNull();
    });
  });
});