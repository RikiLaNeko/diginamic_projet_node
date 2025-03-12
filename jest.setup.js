const sequelize = require('./config/database');

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

module.exports = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testTimeout: 10000
};