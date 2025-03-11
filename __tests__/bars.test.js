const request = require('supertest');
const { faker } = require('@faker-js/faker');
const app = require('../index');
const sequelize = require('../config/database');
const { Bars } = require('../models/models');

describe('Bars API', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /bars', () => {
    it('should create a new bar', async () => {
      const barData = {
        name: faker.company.name(),
        adresse: faker.location.streetAddress(),
        email: faker.internet.email(),
        tel: faker.phone.number(),
        description: faker.lorem.paragraph()
      };

      const response = await request(app)
        .post('/bars')
        .send(barData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Bar créé avec succès.');
      expect(response.body.bar).toHaveProperty('name', barData.name);
    });
  });

  describe('GET /bars', () => {
    it('should retrieve all bars', async () => {
      const response = await request(app)
        .get('/bars')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /bars/:id_bar', () => {
    it('should retrieve a specific bar', async () => {
      // Create a bar to test with
      const bar = await Bars.create({
        name: faker.company.name(),
        adresse: faker.location.streetAddress(),
        email: faker.internet.email()
      });

      const response = await request(app)
        .get(`/bars/${bar.id}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', bar.id);
    });

    it('should return 404 for non-existent bar', async () => {
      await request(app)
        .get('/bars/9999')
        .expect(404);
    });
  });

  describe('PUT /bars/:id_bar', () => {
    it('should update a bar', async () => {
      const bar = await Bars.create({
        name: faker.company.name(),
        adresse: faker.location.streetAddress(),
        email: faker.internet.email()
      });

      const updateData = {
        name: faker.company.name(),
        description: faker.lorem.paragraph()
      };

      const response = await request(app)
        .put(`/bars/${bar.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.bar).toHaveProperty('name', updateData.name);
    });
  });

  describe('DELETE /bars/:id_bar', () => {
    it('should delete a bar', async () => {
      const bar = await Bars.create({
        name: faker.company.name(),
        adresse: faker.location.streetAddress(),
        email: faker.internet.email()
      });

      await request(app)
        .delete(`/bars/${bar.id}`)
        .expect(200);

      // Verify the bar is deleted
      const deletedBar = await Bars.findByPk(bar.id);
      expect(deletedBar).toBeNull();
    });
  });
});