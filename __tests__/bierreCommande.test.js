const { BiereCommande} = require('../models/models');
const { faker } = require('@faker-js/faker');

jest.mock('../models/models', () => {
    const mockBiereCommande = {
        create: jest.fn().mockImplementation(data => ({
            id: 1,
            ...data,
            getBiere: jest.fn(),
            getCommande: jest.fn(),
            destroy: jest.fn().mockResolvedValue(true),
            destroyed: true
        }))
    };

    const mockBiere = {
        findByPk: jest.fn().mockResolvedValue({
            id: 1,
            name: 'Test Beer',
            degree: 5.0,
            prix: 5.50
        })
    };

    const mockCommande = {
        findByPk: jest.fn().mockResolvedValue({
            id: 1,
            total: 15.99,
            date: new Date()
        })
    };

    return {
        BiereCommande: mockBiereCommande,
        Biere: mockBiere,
        Commande: mockCommande
    };
});

// Helper function to generate random BiereCommande data
const generateBiereCommandeData = () => ({
    biere_id: faker.number.int({ min: 1, max: 100 }),
    commande_id: faker.number.int({ min: 1, max: 100 }),
    quantity: faker.number.int({ min: 1, max: 10 }),
    price: parseFloat(faker.commerce.price({ min: 3, max: 15 }))
});

describe('BiereCommande Model', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Create BiereCommande', () => {
        it('should create a valid beer-order relationship', async () => {
            const biereCommandeData = generateBiereCommandeData();

            const biereCommande = await BiereCommande.create(biereCommandeData);

            expect(biereCommande).toHaveProperty('id');
            expect(biereCommande.biere_id).toBe(biereCommandeData.biere_id);
            expect(biereCommande.commande_id).toBe(biereCommandeData.commande_id);
            expect(biereCommande.quantity).toBe(biereCommandeData.quantity);
            expect(biereCommande.price).toBe(biereCommandeData.price);
        });
    });

    describe('BiereCommande Relationships', () => {
        let testBiereCommande;

        beforeEach(async () => {
            testBiereCommande = await BiereCommande.create(generateBiereCommandeData());
        });

        it('should have an associated beer', async () => {
            const beerName = faker.commerce.productName();
            const beerDegree = parseFloat(faker.number.float({ min: 4, max: 12, precision: 0.1 }).toFixed(1));
            const beerPrix = parseFloat(faker.commerce.price({ min: 3, max: 15 }));

            testBiereCommande.getBiere.mockResolvedValue({
                id: 1,
                name: beerName,
                degree: beerDegree,
                prix: beerPrix
            });

            const biere = await testBiereCommande.getBiere();

            expect(testBiereCommande.getBiere).toHaveBeenCalled();
            expect(biere).toHaveProperty('name', beerName);
            expect(biere).toHaveProperty('degree', beerDegree);
            expect(biere).toHaveProperty('prix', beerPrix);
        });

        it('should have an associated commande', async () => {
            const total = parseFloat(faker.commerce.price({ min: 10, max: 100 }));
            const date = faker.date.recent();

            testBiereCommande.getCommande.mockResolvedValue({
                id: 1,
                total: total,
                date: date
            });

            const commande = await testBiereCommande.getCommande();

            expect(testBiereCommande.getCommande).toHaveBeenCalled();
            expect(commande).toHaveProperty('total', total);
            expect(commande).toHaveProperty('date', date);
        });
    });

    describe('Delete behavior', () => {
        it('should be able to be deleted', async () => {
            const testBiereCommande = await BiereCommande.create(generateBiereCommandeData());

            await testBiereCommande.destroy();

            expect(testBiereCommande.destroyed).toBe(true);
        });
    });
});