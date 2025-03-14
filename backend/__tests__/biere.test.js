const { Biere } = require('../models/models');
const { faker } = require('@faker-js/faker');

jest.mock('../models/models', () => {
    const mockBiere = {
        create: jest.fn().mockImplementation(data => ({
            id: 1,
            ...data,
            getBar: jest.fn(),
            getCommandes: jest.fn(),
            destroy: jest.fn().mockResolvedValue(true),
            destroyed: true
        }))
    };

    const mockBars = {
        findByPk: jest.fn().mockResolvedValue({
            id: 1,
            name: 'Test Bar',
            adresse: '123 Test Street'
        })
    };

    const mockCommande = {
        findAll: jest.fn().mockResolvedValue([
            { id: 1, total: 15.99 }
        ])
    };

    return {
        Biere: mockBiere,
        Bars: mockBars,
        Commande: mockCommande
    };
});

// Helper function to generate random beer data
const generateBiereData = () => ({
    name: faker.commerce.productName(),
    description: faker.lorem.sentence(),
    degree: parseFloat(faker.number.float({ min: 4, max: 12, precision: 0.1 }).toFixed(1)),
    prix: parseFloat(faker.commerce.price({ min: 3, max: 15 })),
    bars_id: 1
});

describe('Biere Model', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Create Biere', () => {
        it('should create a valid beer', async () => {
            const biereData = generateBiereData();

            const biere = await Biere.create(biereData);

            expect(biere).toHaveProperty('id');
            expect(biere.name).toBe(biereData.name);
            expect(biere.prix).toBe(biereData.prix);
            expect(biere.description).toBe(biereData.description);
            expect(biere.degree).toBe(biereData.degree);
            expect(biere.bars_id).toBe(biereData.bars_id);
        });
    });

    describe('Biere Relationships', () => {
        let testBiere;

        beforeEach(async () => {
            testBiere = await Biere.create(generateBiereData());
        });

        it('should have an associated bar', async () => {
            const barName = faker.company.name();
            testBiere.getBar.mockResolvedValue({
                id: 1,
                name: barName,
                adresse: faker.location.streetAddress()
            });

            const bar = await testBiere.getBar();

            expect(testBiere.getBar).toHaveBeenCalled();
            expect(bar).toHaveProperty('name', barName);
        });

        it('should have associated commandes', async () => {
            const quantity = faker.number.int({ min: 1, max: 10 });
            const total = parseFloat(faker.commerce.price());
            testBiere.getCommandes.mockResolvedValue([
                { id: 1, quantity, total }
            ]);

            const commandes = await testBiere.getCommandes();

            expect(testBiere.getCommandes).toHaveBeenCalled();
            expect(commandes).toHaveLength(1);
            expect(commandes[0]).toHaveProperty('quantity', quantity);
        });
    });

    describe('Delete behavior', () => {
        it('should be able to be deleted', async () => {
            const testBiere = await Biere.create(generateBiereData());

            await testBiere.destroy();

            expect(testBiere.destroyed).toBe(true);
        });
    });
});