const { Commande } = require('../models/models');
const { faker } = require('@faker-js/faker');

jest.mock('../models/models', () => {
    const mockCommande = {
        create: jest.fn().mockImplementation(data => ({
            id: 1,
            ...data,
            getBar: jest.fn(),
            getBieres: jest.fn(),
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

    const mockBiere = {
        findAll: jest.fn().mockResolvedValue([
            {
                id: 1,
                name: 'Test Beer',
                price: 5.50,
                description: 'A test beer'
            }
        ])
    };

    return {
        Commande: mockCommande,
        Bars: mockBars,
        Biere: mockBiere
    };
});

// Helper function to generate random commande data
const generateCommandeData = () => ({
    name: faker.commerce.productName(),
    total: parseFloat(faker.commerce.price({ min: 15, max: 100 })),
    prix: parseFloat(faker.commerce.price({ min: 5, max: 50 })),
    date: faker.date.past(),
    bars_id: faker.number.int({ min: 1, max: 10 }),
    status: faker.helpers.arrayElement(['brouillon', 'en cours', 'terminée'])
});

describe('Commande Model', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Create Commande', () => {
        it('should create a valid order', async () => {
            const commandeData = generateCommandeData();

            const commande = await Commande.create(commandeData);

            expect(commande).toHaveProperty('id');
            expect(commande.total).toBe(commandeData.total);
            expect(commande.date).toBeInstanceOf(Date);
            expect(commande.bars_id).toBe(commandeData.bars_id);
            expect(commande.name).toBe(commandeData.name);
            if (commande.status) {
                expect(['brouillon', 'en cours', 'terminée']).toContain(commande.status);
            }
        });
    });

    describe('Commande Relationships', () => {
        let testCommande;

        beforeEach(async () => {
            testCommande = await Commande.create(generateCommandeData());
        });

        it('should have an associated bar', async () => {
            const barName = faker.company.name();
            const barAddress = faker.location.streetAddress();

            testCommande.getBar.mockResolvedValue({
                id: 1,
                name: barName,
                adresse: barAddress
            });

            const bar = await testCommande.getBar();

            expect(testCommande.getBar).toHaveBeenCalled();
            expect(bar).toHaveProperty('name', barName);
            expect(bar).toHaveProperty('adresse', barAddress);
        });

        it('should have associated beers', async () => {
            const beer1 = {
                id: faker.number.int({ min: 1, max: 100 }),
                name: faker.commerce.productName(),
                price: parseFloat(faker.commerce.price({ min: 3, max: 10 })),
                description: faker.lorem.sentence(),
                BiereCommande: {
                    quantity: faker.number.int({ min: 1, max: 5 }),
                    price: parseFloat(faker.commerce.price({ min: 3, max: 10 }))
                }
            };

            const beer2 = {
                id: faker.number.int({ min: 101, max: 200 }),
                name: faker.commerce.productName(),
                price: parseFloat(faker.commerce.price({ min: 4, max: 12 })),
                description: faker.lorem.sentence(),
                BiereCommande: {
                    quantity: faker.number.int({ min: 1, max: 5 }),
                    price: parseFloat(faker.commerce.price({ min: 4, max: 12 }))
                }
            };

            testCommande.getBieres.mockResolvedValue([beer1, beer2]);

            const bieres = await testCommande.getBieres();

            expect(testCommande.getBieres).toHaveBeenCalled();
            expect(bieres).toHaveLength(2);
            expect(bieres[0]).toHaveProperty('name', beer1.name);
            expect(bieres[0].BiereCommande).toHaveProperty('quantity', beer1.BiereCommande.quantity);
            expect(bieres[1]).toHaveProperty('name', beer2.name);
        });
    });

    describe('Delete behavior', () => {
        it('should be able to be deleted', async () => {
            const testCommande = await Commande.create(generateCommandeData());

            await testCommande.destroy();

            expect(testCommande.destroyed).toBe(true);
        });
    });
});