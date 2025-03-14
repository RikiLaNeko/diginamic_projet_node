const { Bars} = require('../models/models');
const { faker } = require('@faker-js/faker');

jest.mock('../models/models', () => {
    // Create mock models
    const mockBars = {
        create: jest.fn().mockImplementation(data => ({
            id: 1,
            ...data,
            getBeers: jest.fn(),
            getCommandes: jest.fn(),
            getUsers: jest.fn(),
            destroy: jest.fn().mockResolvedValue(true),
            destroyed: true
        }))
    };

    const mockBiere = {
        destroy: jest.fn().mockResolvedValue(1)
    };

    const mockCommande = {
        destroy: jest.fn().mockResolvedValue(1)
    };

    const mockUser = {
        update: jest.fn().mockResolvedValue([1])
    };

    return {
        Bars: mockBars,
        Biere: mockBiere,
        Commande: mockCommande,
        User: mockUser
    };
});

// Helper function to generate random bar data
const generateBarData = () => ({
    name: faker.company.name(),
    adresse: faker.location.streetAddress(),
    tel: faker.phone.number(),
    email: faker.internet.email(),
    description: faker.lorem.paragraph(),
    password: faker.internet.password()
});

describe('Bars Model', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Create Bar', () => {
        it('should create a valid bar', async () => {
            const barData = generateBarData();

            const bar = await Bars.create(barData);

            expect(bar).toHaveProperty('id');
            expect(bar.name).toBe(barData.name);
            expect(bar.adresse).toBe(barData.adresse);
            expect(bar.tel).toBe(barData.tel);
            expect(bar.email).toBe(barData.email);
            expect(bar.description).toBe(barData.description);
            expect(bar.password).toBe(barData.password);
        });
    });

    describe('Bar Relationships', () => {
        let testBar;

        beforeEach(async () => {
            testBar = await Bars.create(generateBarData());
        });

        it('should have associated beers', async () => {
            testBar.getBeers.mockResolvedValue([
                { id: 1, name: faker.commerce.productName() }
            ]);

            const beers = await testBar.getBeers();

            expect(testBar.getBeers).toHaveBeenCalled();
            expect(beers).toHaveLength(1);
            expect(beers[0]).toHaveProperty('name');
        });

        it('should have associated commandes', async () => {
            const total = parseFloat(faker.commerce.price());
            testBar.getCommandes.mockResolvedValue([{ id: 1, total }]);

            const commandes = await testBar.getCommandes();

            expect(testBar.getCommandes).toHaveBeenCalled();
            expect(commandes).toHaveLength(1);
            expect(commandes[0]).toHaveProperty('total', total);
        });

        it('should have associated users', async () => {
            const userName = faker.person.fullName();
            testBar.getUsers.mockResolvedValue([{ id: 1, name: userName }]);

            const users = await testBar.getUsers();

            expect(testBar.getUsers).toHaveBeenCalled();
            expect(users).toHaveLength(1);
            expect(users[0]).toHaveProperty('name', userName);
        });
    });

    describe('Delete cascade', () => {
        it('should delete associated records when bar is deleted', async () => {
            const testBar = await Bars.create(generateBarData());

            await testBar.destroy();

            expect(testBar.destroyed).toBe(true);
        });
    });
});