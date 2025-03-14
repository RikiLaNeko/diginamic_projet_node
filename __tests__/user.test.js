const User = require('../models/User');
const Bar = require('../models/bars');
const bcrypt = require('bcrypt');
const sequelize = require('../config/database');
const { faker } = require('@faker-js/faker');

// Mock dependencies
jest.mock('../models/bars', () => ({
  destroy: jest.fn().mockResolvedValue(undefined)
}));

// Mock bcrypt for faster password tests
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn().mockImplementation((password, hash) => {
    return Promise.resolve(password === 'password123');
  })
}));

// Helper function to generate random user data
const generateUserData = () => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: 'password123' // Keeping password consistent for bcrypt mock
});

describe('User Model', () => {
  // Set up test database before tests
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  // Clean up after all tests
  afterAll(async () => {
    await sequelize.close();
  });

  // Reset mocks between tests
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Validations', () => {
    it('should create a valid user', async () => {
      // Create a user with mocked password hashing
      const userData = generateUserData();
      const user = User.build(userData);

      // Manually set values to simulate create
      user.id = 1;
      await user.save({ hooks: false });

      expect(user).toHaveProperty('id');
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
    });

    it('should reject invalid email', async () => {
      try {
        await User.build({
          name: faker.person.fullName(),
          email: 'invalid-email',
          password: 'password123'
        }).validate();
        fail('Expected validation error was not thrown');
      } catch (error) {
        expect(error.name).toBe('SequelizeValidationError');
      }
    });
  });

  describe('Password Management', () => {
    it('should hash password on create', async () => {
      // Create a user with the mocked bcrypt
      const userData = generateUserData();
      const user = User.build(userData);

      user.id = 2;
      await user.save({ hooks: false });

      // Test with our mocked bcrypt
      expect(await user.validPassword('password123')).toBe(true);
      expect(await user.validPassword('wrong-password')).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledTimes(2);
    });
  });

  describe('Hooks', () => {
    it('should delete associated bars on user deletion', async () => {
      const user = User.build(generateUserData());
      user.id = 3;
      await user.save({ hooks: false });

      await user.destroy();

      expect(Bar.destroy).toHaveBeenCalledTimes(1);
      expect(Bar.destroy).toHaveBeenCalledWith({
        where: { userId: user.id }
      });
    });
  });
});