import { PrismaPg } from '@prisma/adapter-pg';
import { BatchStatus, Condition, ItemCategory, PrismaClient, Role, SiteType, TypeMovement, VehicleStatus, VehicleType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';

type BagTemplateName = 'LOT A' | 'LOT B';

type SeedAddress = {
    number: number;
    street: string;
    city: string;
    zipcode: string;
    state: string;
};

type SeedSite = {
    name: string;
    code: string;
    type: SiteType;
    address?: SeedAddress;
    bagTemplateName?: BagTemplateName;
};

type SeedProduct = {
    name: string;
    category: ItemCategory;
    isPerishable: boolean;
    minThreshold: number;
};

type SeedTemplateItem = {
    bagTemplateName: BagTemplateName;
    productName: string;
    expectedQuantity: number;
};

type SeedBatch = {
    key: string;
    number: string;
    expiryDate?: Date;
    status: BatchStatus;
};

type SeedStock = {
    siteCode: string;
    productName: string;
    quantity: number;
    condition: Condition;
    batchKey?: string;
};

type SeedStockProfile = {
    indoor: number;
    outdoor: number;
    batchKey?: string;
};

type SeedStockOverride = {
    siteCode: string;
    productName: string;
    quantity: number;
};

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const indoorSites: SeedSite[] = [
    {
        name: "Antenne d'Albi",
        code: 'ALB',
        type: SiteType.INDOOR,
        address: {
            number: 8,
            street: 'Avenue de Lattre de Tassigny',
            city: 'Albi',
            zipcode: '81000',
            state: 'France',
        },
    },
    {
        name: 'Antenne de Castres',
        code: 'CST',
        type: SiteType.INDOOR,
        address: {
            number: 12,
            street: 'Zone de Melou',
            city: 'Castres',
            zipcode: '81100',
            state: 'France',
        },
    },
    {
        name: 'Antenne de Gaillac',
        code: 'GAI',
        type: SiteType.INDOOR,
        address: {
            number: 3,
            street: 'Rue de la Madeleine',
            city: 'Gaillac',
            zipcode: '81600',
            state: 'France',
        },
    },
    {
        name: 'Antenne de Mazamet',
        code: 'MZT',
        type: SiteType.INDOOR,
        address: {
            number: 22,
            street: 'Boulevard Soult',
            city: 'Mazamet',
            zipcode: '81200',
            state: 'France',
        },
    },
];

const outdoorSites: SeedSite[] = [
    {
        name: 'Lot A (Tente) - VPSP 814',
        code: '814A',
        type: SiteType.OUTDOOR,
        bagTemplateName: 'LOT A',
    },
    {
        name: 'Lot B (Secours) - VPSP 814',
        code: '814B',
        type: SiteType.OUTDOOR,
        bagTemplateName: 'LOT B',
    },
    {
        name: 'Lot A (Tente) - VPSP 816',
        code: '816A',
        type: SiteType.OUTDOOR,
        bagTemplateName: 'LOT A',
    },
    {
        name: 'Lot B (Secours) - VPSP 816',
        code: '816B',
        type: SiteType.OUTDOOR,
        bagTemplateName: 'LOT B',
    },
];

const allSites: SeedSite[] = [...indoorSites, ...outdoorSites];

const products: SeedProduct[] = [
    { name: 'Compresses Stériles 10x10', category: ItemCategory.PLAIE, isPerishable: true, minThreshold: 20 },
    { name: 'Sérum Physiologique', category: ItemCategory.PLAIE, isPerishable: true, minThreshold: 50 },
    { name: 'Pansements Adhésifs Assortis', category: ItemCategory.PLAIE, isPerishable: true, minThreshold: 80 },
    { name: 'Bandage Extensible 3m', category: ItemCategory.PLAIE, isPerishable: false, minThreshold: 30 },
    { name: 'Gants Nitrile Taille M', category: ItemCategory.HYGIENE, isPerishable: false, minThreshold: 200 },
    { name: 'Masques Chirurgicaux', category: ItemCategory.HYGIENE, isPerishable: false, minThreshold: 100 },
    { name: 'Collier Cervical Adulte', category: ItemCategory.TRAUMA, isPerishable: false, minThreshold: 5 },
    { name: 'Attelle Souple Universelle', category: ItemCategory.TRAUMA, isPerishable: false, minThreshold: 4 },
    { name: 'Couverture Isothermique', category: ItemCategory.TRAUMA, isPerishable: false, minThreshold: 10 },
    { name: 'Bouteille Oxygène 5L', category: ItemCategory.OXY, isPerishable: false, minThreshold: 2 },
    { name: 'Masque Haute Concentration', category: ItemCategory.OXY, isPerishable: true, minThreshold: 12 },
    { name: 'Défibrillateur (DSA)', category: ItemCategory.BILAN, isPerishable: false, minThreshold: 1 },
    { name: 'Oxymètre de Pouls', category: ItemCategory.BILAN, isPerishable: false, minThreshold: 3 },
    { name: 'Tensiomètre Brassard Adulte', category: ItemCategory.BILAN, isPerishable: false, minThreshold: 3 },
    { name: 'Gel Glucose Oral', category: ItemCategory.MALAISE, isPerishable: true, minThreshold: 15 },
    { name: 'Lampe Frontale LED', category: ItemCategory.LOGISTIQUE, isPerishable: false, minThreshold: 4 },
];

const templateItems: SeedTemplateItem[] = [
    { bagTemplateName: 'LOT A', productName: 'Compresses Stériles 10x10', expectedQuantity: 12 },
    { bagTemplateName: 'LOT A', productName: 'Sérum Physiologique', expectedQuantity: 10 },
    { bagTemplateName: 'LOT A', productName: 'Pansements Adhésifs Assortis', expectedQuantity: 15 },
    { bagTemplateName: 'LOT A', productName: 'Bandage Extensible 3m', expectedQuantity: 6 },
    { bagTemplateName: 'LOT A', productName: 'Gants Nitrile Taille M', expectedQuantity: 20 },
    { bagTemplateName: 'LOT A', productName: 'Masques Chirurgicaux', expectedQuantity: 10 },
    { bagTemplateName: 'LOT A', productName: 'Couverture Isothermique', expectedQuantity: 2 },
    { bagTemplateName: 'LOT A', productName: 'Gel Glucose Oral', expectedQuantity: 2 },
    { bagTemplateName: 'LOT B', productName: 'Collier Cervical Adulte', expectedQuantity: 1 },
    { bagTemplateName: 'LOT B', productName: 'Attelle Souple Universelle', expectedQuantity: 1 },
    { bagTemplateName: 'LOT B', productName: 'Bouteille Oxygène 5L', expectedQuantity: 1 },
    { bagTemplateName: 'LOT B', productName: 'Masque Haute Concentration', expectedQuantity: 2 },
    { bagTemplateName: 'LOT B', productName: 'Défibrillateur (DSA)', expectedQuantity: 1 },
    { bagTemplateName: 'LOT B', productName: 'Oxymètre de Pouls', expectedQuantity: 1 },
    { bagTemplateName: 'LOT B', productName: 'Tensiomètre Brassard Adulte', expectedQuantity: 1 },
];

const productBatches: SeedBatch[] = [
    {
        key: 'compresses-2027-01',
        number: 'LOT-COMP-2027-01',
        expiryDate: new Date('2027-01-31T00:00:00.000Z'),
        status: BatchStatus.VALID,
    },
    {
        key: 'compresses-2027-09',
        number: 'LOT-COMP-2027-09',
        expiryDate: new Date('2027-09-30T00:00:00.000Z'),
        status: BatchStatus.VALID,
    },
    {
        key: 'compresses-2028-04',
        number: 'LOT-COMP-2028-04',
        expiryDate: new Date('2028-04-30T00:00:00.000Z'),
        status: BatchStatus.VALID,
    },
    {
        key: 'serum-2027-06',
        number: 'LOT-SER-2027-06',
        expiryDate: new Date('2027-06-30T00:00:00.000Z'),
        status: BatchStatus.VALID,
    },
    {
        key: 'pansement-2028-03',
        number: 'LOT-PAN-2028-03',
        expiryDate: new Date('2028-03-31T00:00:00.000Z'),
        status: BatchStatus.VALID,
    },
    {
        key: 'mask-hc-2027-09',
        number: 'LOT-MHC-2027-09',
        expiryDate: new Date('2027-09-30T00:00:00.000Z'),
        status: BatchStatus.VALID,
    },
    {
        key: 'glucose-2027-11',
        number: 'LOT-GLU-2027-11',
        expiryDate: new Date('2027-11-30T00:00:00.000Z'),
        status: BatchStatus.VALID,
    },
];

const productStockProfiles: Record<string, SeedStockProfile> = {
    'Compresses Stériles 10x10': { indoor: 60, outdoor: 4, batchKey: 'compresses-2027-01' },
    'Sérum Physiologique': { indoor: 40, outdoor: 3, batchKey: 'serum-2027-06' },
    'Pansements Adhésifs Assortis': { indoor: 90, outdoor: 4, batchKey: 'pansement-2028-03' },
    'Bandage Extensible 3m': { indoor: 40, outdoor: 2 },
    'Gants Nitrile Taille M': { indoor: 200, outdoor: 8 },
    'Masques Chirurgicaux': { indoor: 120, outdoor: 6 },
    'Collier Cervical Adulte': { indoor: 3, outdoor: 1 },
    'Attelle Souple Universelle': { indoor: 2, outdoor: 1 },
    'Couverture Isothermique': { indoor: 8, outdoor: 1 },
    'Bouteille Oxygène 5L': { indoor: 2, outdoor: 1 },
    'Masque Haute Concentration': { indoor: 8, outdoor: 1, batchKey: 'mask-hc-2027-09' },
    'Défibrillateur (DSA)': { indoor: 1, outdoor: 1 },
    'Oxymètre de Pouls': { indoor: 2, outdoor: 1 },
    'Tensiomètre Brassard Adulte': { indoor: 2, outdoor: 1 },
    'Gel Glucose Oral': { indoor: 12, outdoor: 1, batchKey: 'glucose-2027-11' },
    'Lampe Frontale LED': { indoor: 4, outdoor: 1 },
};

const stockOverrides: SeedStockOverride[] = [
    { siteCode: 'ALB', productName: 'Compresses Stériles 10x10', quantity: 180 },
    { siteCode: 'ALB', productName: 'Sérum Physiologique', quantity: 120 },
    { siteCode: 'ALB', productName: 'Pansements Adhésifs Assortis', quantity: 240 },
    { siteCode: 'ALB', productName: 'Bandage Extensible 3m', quantity: 90 },
    { siteCode: 'ALB', productName: 'Gants Nitrile Taille M', quantity: 400 },
    { siteCode: 'ALB', productName: 'Masques Chirurgicaux', quantity: 250 },
    { siteCode: 'ALB', productName: 'Collier Cervical Adulte', quantity: 8 },
    { siteCode: 'ALB', productName: 'Attelle Souple Universelle', quantity: 6 },
    { siteCode: 'ALB', productName: 'Couverture Isothermique', quantity: 20 },
    { siteCode: 'ALB', productName: 'Bouteille Oxygène 5L', quantity: 6 },
    { siteCode: 'ALB', productName: 'Masque Haute Concentration', quantity: 18 },
    { siteCode: 'ALB', productName: 'Défibrillateur (DSA)', quantity: 2 },
    { siteCode: 'ALB', productName: 'Oxymètre de Pouls', quantity: 5 },
    { siteCode: 'ALB', productName: 'Tensiomètre Brassard Adulte', quantity: 4 },
    { siteCode: 'ALB', productName: 'Gel Glucose Oral', quantity: 40 },
    { siteCode: 'ALB', productName: 'Lampe Frontale LED', quantity: 8 },
    { siteCode: 'CST', productName: 'Compresses Stériles 10x10', quantity: 140 },
    { siteCode: 'CST', productName: 'Sérum Physiologique', quantity: 100 },
    { siteCode: 'CST', productName: 'Pansements Adhésifs Assortis', quantity: 180 },
    { siteCode: 'CST', productName: 'Gants Nitrile Taille M', quantity: 320 },
    { siteCode: 'CST', productName: 'Masques Chirurgicaux', quantity: 180 },
    { siteCode: 'CST', productName: 'Collier Cervical Adulte', quantity: 6 },
    { siteCode: 'CST', productName: 'Attelle Souple Universelle', quantity: 5 },
    { siteCode: 'CST', productName: 'Couverture Isothermique', quantity: 16 },
    { siteCode: 'CST', productName: 'Bouteille Oxygène 5L', quantity: 4 },
    { siteCode: 'CST', productName: 'Masque Haute Concentration', quantity: 12 },
    { siteCode: 'CST', productName: 'Défibrillateur (DSA)', quantity: 1 },
    { siteCode: 'CST', productName: 'Oxymètre de Pouls', quantity: 3 },
    { siteCode: 'CST', productName: 'Tensiomètre Brassard Adulte', quantity: 3 },
    { siteCode: 'CST', productName: 'Gel Glucose Oral', quantity: 24 },
    { siteCode: 'GAI', productName: 'Compresses Stériles 10x10', quantity: 90 },
    { siteCode: 'GAI', productName: 'Sérum Physiologique', quantity: 60 },
    { siteCode: 'GAI', productName: 'Bandage Extensible 3m', quantity: 60 },
    { siteCode: 'GAI', productName: 'Gants Nitrile Taille M', quantity: 220 },
    { siteCode: 'GAI', productName: 'Masques Chirurgicaux', quantity: 140 },
    { siteCode: 'GAI', productName: 'Couverture Isothermique', quantity: 12 },
    { siteCode: 'GAI', productName: 'Gel Glucose Oral', quantity: 18 },
    { siteCode: 'GAI', productName: 'Lampe Frontale LED', quantity: 6 },
    { siteCode: 'MZT', productName: 'Compresses Stériles 10x10', quantity: 80 },
    { siteCode: 'MZT', productName: 'Sérum Physiologique', quantity: 50 },
    { siteCode: 'MZT', productName: 'Pansements Adhésifs Assortis', quantity: 120 },
    { siteCode: 'MZT', productName: 'Gants Nitrile Taille M', quantity: 180 },
    { siteCode: 'MZT', productName: 'Masques Chirurgicaux', quantity: 120 },
    { siteCode: 'MZT', productName: 'Collier Cervical Adulte', quantity: 4 },
    { siteCode: 'MZT', productName: 'Bouteille Oxygène 5L', quantity: 3 },
    { siteCode: 'MZT', productName: 'Gel Glucose Oral', quantity: 16 },
    { siteCode: '814A', productName: 'Compresses Stériles 10x10', quantity: 12 },
    { siteCode: '814A', productName: 'Sérum Physiologique', quantity: 10 },
    { siteCode: '814A', productName: 'Pansements Adhésifs Assortis', quantity: 15 },
    { siteCode: '814A', productName: 'Bandage Extensible 3m', quantity: 6 },
    { siteCode: '814A', productName: 'Gants Nitrile Taille M', quantity: 20 },
    { siteCode: '814A', productName: 'Masques Chirurgicaux', quantity: 10 },
    { siteCode: '814A', productName: 'Couverture Isothermique', quantity: 2 },
    { siteCode: '814A', productName: 'Gel Glucose Oral', quantity: 2 },
    { siteCode: '814B', productName: 'Collier Cervical Adulte', quantity: 2 },
    { siteCode: '814B', productName: 'Attelle Souple Universelle', quantity: 2 },
    { siteCode: '814B', productName: 'Bouteille Oxygène 5L', quantity: 2 },
    { siteCode: '814B', productName: 'Masque Haute Concentration', quantity: 2 },
    { siteCode: '814B', productName: 'Défibrillateur (DSA)', quantity: 1 },
    { siteCode: '814B', productName: 'Oxymètre de Pouls', quantity: 1 },
    { siteCode: '814B', productName: 'Tensiomètre Brassard Adulte', quantity: 1 },
    { siteCode: '816A', productName: 'Compresses Stériles 10x10', quantity: 10 },
    { siteCode: '816A', productName: 'Sérum Physiologique', quantity: 8 },
    { siteCode: '816A', productName: 'Pansements Adhésifs Assortis', quantity: 12 },
    { siteCode: '816A', productName: 'Bandage Extensible 3m', quantity: 5 },
    { siteCode: '816A', productName: 'Gants Nitrile Taille M', quantity: 18 },
    { siteCode: '816A', productName: 'Masques Chirurgicaux', quantity: 8 },
    { siteCode: '816A', productName: 'Couverture Isothermique', quantity: 2 },
    { siteCode: '816A', productName: 'Gel Glucose Oral', quantity: 2 },
    { siteCode: '816B', productName: 'Collier Cervical Adulte', quantity: 2 },
    { siteCode: '816B', productName: 'Attelle Souple Universelle', quantity: 2 },
    { siteCode: '816B', productName: 'Bouteille Oxygène 5L', quantity: 2 },
    { siteCode: '816B', productName: 'Masque Haute Concentration', quantity: 2 },
    { siteCode: '816B', productName: 'Défibrillateur (DSA)', quantity: 1 },
    { siteCode: '816B', productName: 'Oxymètre de Pouls', quantity: 1 },
];

const stockOverrideMap = new Map(stockOverrides.map((stock) => [`${stock.siteCode}::${stock.productName}`, stock]));

const initialStocks: SeedStock[] = allSites.flatMap((site) =>
    products.map((product) => {
        const stockProfile = productStockProfiles[product.name];

        if (!stockProfile) {
            throw new Error(`Missing stock profile for product "${product.name}"`);
        }

        const override = stockOverrideMap.get(`${site.code}::${product.name}`);

        return {
            siteCode: site.code,
            productName: product.name,
            quantity: override?.quantity ?? (site.type === SiteType.INDOOR ? stockProfile.indoor : stockProfile.outdoor),
            condition: Condition.BON,
            batchKey: stockProfile.batchKey,
        };
    }),
);

const additionalStocks: SeedStock[] = [
    {
        siteCode: 'CST',
        productName: 'Compresses Stériles 10x10',
        quantity: 45,
        condition: Condition.BON,
        batchKey: 'compresses-2027-09',
    },
    {
        siteCode: 'CST',
        productName: 'Compresses Stériles 10x10',
        quantity: 35,
        condition: Condition.BON,
        batchKey: 'compresses-2028-04',
    },
];

async function main() {
    console.log('Starting ADPC 81 seed...');

    await prisma.$transaction(
        async (tx) => {
            console.log('Creating bag templates...');
            const lotA = await tx.bagTemplate.upsert({
                where: { name: 'LOT A' },
                update: { name: 'LOT A' },
                create: { name: 'LOT A' },
            });

            const lotB = await tx.bagTemplate.upsert({
                where: { name: 'LOT B' },
                update: { name: 'LOT B' },
                create: { name: 'LOT B' },
            });

            const bagTemplates: Record<BagTemplateName, { id: number }> = {
                'LOT A': lotA,
                'LOT B': lotB,
            };

            console.log('Creating sites...');
            const siteCatalog: Record<string, { id: number }> = {};

            for (const site of allSites) {
                const { address, bagTemplateName, ...siteData } = site;
                const createdSite = await tx.site.upsert({
                    where: { code: site.code },
                    update: {
                        ...siteData,
                        address: address
                            ? {
                                  upsert: {
                                      create: address,
                                      update: address,
                                  },
                              }
                            : undefined,
                    },
                    create: {
                        ...siteData,
                        address: address ? { create: address } : undefined,
                    },
                });

                siteCatalog[site.code] = createdSite;

                if (bagTemplateName) {
                    await tx.bagTemplateSite.upsert({
                        where: { siteId: createdSite.id },
                        update: { bagTemplateId: bagTemplates[bagTemplateName].id },
                        create: {
                            siteId: createdSite.id,
                            bagTemplateId: bagTemplates[bagTemplateName].id,
                        },
                    });
                }
            }

            console.log('Creating users...');
            const password = await bcrypt.hash('Secret123!', 10);
            const users = [
                {
                    email: 'admin@test.com',
                    firstname: 'Jean',
                    lastname: 'Admin',
                    phone: '0601020304',
                    birthdate: new Date('1980-01-01'),
                    role: Role.ADMIN,
                    siteCode: 'ALB',
                    address: { number: 10, street: 'Rue de la Paix', city: 'Paris', zipcode: '75000', state: 'France' },
                },
                {
                    email: 'manager@test.com',
                    firstname: 'Marie',
                    lastname: 'Manager',
                    phone: '0612345678',
                    birthdate: new Date('1985-05-15'),
                    role: Role.MANAGER,
                    siteCode: 'ALB',
                    address: { number: 42, street: 'Avenue Foch', city: 'Lyon', zipcode: '69000', state: 'France' },
                },
                {
                    email: 'benevole@test.com',
                    firstname: 'Paul',
                    lastname: 'Bénévole',
                    phone: '0698765432',
                    birthdate: new Date('1995-12-25'),
                    role: Role.BENEVOLE,
                    siteCode: 'CST',
                    address: { number: 5, street: 'Vieux Port', city: 'Marseille', zipcode: '13000', state: 'France' },
                },
                {
                    email: 'gaillac.manager@test.com',
                    firstname: 'Sophie',
                    lastname: 'Durand',
                    phone: '0677001122',
                    birthdate: new Date('1988-08-12'),
                    role: Role.MANAGER,
                    siteCode: 'GAI',
                    address: { number: 14, street: 'Rue des Freres Delga', city: 'Gaillac', zipcode: '81600', state: 'France' },
                },
                {
                    email: 'mazamet.benevole@test.com',
                    firstname: 'Lucas',
                    lastname: 'Martin',
                    phone: '0665007788',
                    birthdate: new Date('1997-03-04'),
                    role: Role.BENEVOLE,
                    siteCode: 'MZT',
                    address: { number: 9, street: 'Rue de la Richarde', city: 'Mazamet', zipcode: '81200', state: 'France' },
                },
            ];

            let adminUserId: number | null = null;

            for (const user of users) {
                const createdUser = await tx.user.upsert({
                    where: { email: user.email },
                    update: {
                        firstname: user.firstname,
                        lastname: user.lastname,
                        phone: user.phone,
                        birthdate: user.birthdate,
                        role: user.role,
                        enabled: true,
                        siteId: siteCatalog[user.siteCode].id,
                        address: {
                            upsert: {
                                create: user.address,
                                update: user.address,
                            },
                        },
                    },
                    create: {
                        email: user.email,
                        password,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        phone: user.phone,
                        birthdate: user.birthdate,
                        role: user.role,
                        enabled: true,
                        siteId: siteCatalog[user.siteCode].id,
                        address: { create: user.address },
                    },
                });

                if (createdUser.role === Role.ADMIN) {
                    adminUserId = createdUser.id;
                }
            }

            console.log('Creating vehicles...');
            const vehicles = [
                {
                    name: 'VPSP 814',
                    type: VehicleType.VPSP,
                    licensePlate: 'AB-814-CD',
                    status: VehicleStatus.OPERATIONAL,
                    mileage: 154000,
                    siteCode: 'ALB',
                },
                {
                    name: 'VPSP 816',
                    type: VehicleType.VPSP,
                    licensePlate: 'EF-816-GH',
                    status: VehicleStatus.OPERATIONAL,
                    mileage: 126500,
                    siteCode: 'CST',
                },
                {
                    name: 'VTU 221',
                    type: VehicleType.VTU,
                    licensePlate: 'IJ-221-KL',
                    status: VehicleStatus.WARNING,
                    mileage: 98300,
                    siteCode: 'GAI',
                },
                {
                    name: 'VL 118',
                    type: VehicleType.VL,
                    licensePlate: 'MN-118-OP',
                    status: VehicleStatus.OPERATIONAL,
                    mileage: 65400,
                    siteCode: 'MZT',
                },
            ];

            for (const vehicle of vehicles) {
                const { siteCode, ...vehicleData } = vehicle;

                await tx.vehicle.upsert({
                    where: { licensePlate: vehicle.licensePlate },
                    update: {
                        ...vehicleData,
                        siteId: siteCatalog[siteCode].id,
                    },
                    create: {
                        ...vehicleData,
                        siteId: siteCatalog[siteCode].id,
                    },
                });
            }

            console.log('Creating products...');
            const productCatalog: Record<string, { id: number }> = {};

            for (const product of products) {
                const createdProduct = await tx.product.upsert({
                    where: { name: product.name },
                    update: product,
                    create: product,
                });

                productCatalog[product.name] = createdProduct;
            }

            console.log('Linking products to bag templates...');
            for (const templateItem of templateItems) {
                await tx.bagTemplateItem.upsert({
                    where: {
                        bagTemplateId_productId: {
                            bagTemplateId: bagTemplates[templateItem.bagTemplateName].id,
                            productId: productCatalog[templateItem.productName].id,
                        },
                    },
                    update: { expectedQuantity: templateItem.expectedQuantity },
                    create: {
                        bagTemplateId: bagTemplates[templateItem.bagTemplateName].id,
                        productId: productCatalog[templateItem.productName].id,
                        expectedQuantity: templateItem.expectedQuantity,
                    },
                });
            }

            console.log('Creating product batch numbers...');
            const batchCatalog: Record<string, { id: number }> = {};

            for (const batch of productBatches) {
                const existingBatch = await tx.productBatchNumber.findFirst({
                    where: { number: batch.number },
                });

                const savedBatch = existingBatch
                    ? await tx.productBatchNumber.update({
                          where: { id: existingBatch.id },
                          data: {
                              number: batch.number,
                              expiryDate: batch.expiryDate,
                              status: batch.status,
                          },
                      })
                    : await tx.productBatchNumber.create({
                          data: {
                              number: batch.number,
                              expiryDate: batch.expiryDate,
                              status: batch.status,
                          },
                      });

                batchCatalog[batch.key] = savedBatch;
            }

            if (adminUserId) {
                console.log('Injecting stock in every site...');

                for (const stockSeed of [...initialStocks, ...additionalStocks]) {
                    const siteId = siteCatalog[stockSeed.siteCode].id;
                    const productId = productCatalog[stockSeed.productName].id;
                    const batchId = stockSeed.batchKey ? batchCatalog[stockSeed.batchKey].id : null;

                    const existingStocks = await tx.stock.findMany({
                        where: {
                            productId,
                            siteId,
                            condition: stockSeed.condition,
                            ProductBatchNumberId: batchId,
                        },
                        orderBy: { id: 'asc' },
                    });

                    if (existingStocks.length > 0) {
                        await tx.stock.update({
                            where: { id: existingStocks[0].id },
                            data: { quantity: stockSeed.quantity },
                        });

                        const duplicateStockIds = existingStocks.slice(1).map((stock) => stock.id);
                        if (duplicateStockIds.length > 0) {
                            await tx.stock.deleteMany({
                                where: {
                                    id: { in: duplicateStockIds },
                                },
                            });
                        }
                    } else {
                        await tx.stock.create({
                            data: {
                                quantity: stockSeed.quantity,
                                condition: stockSeed.condition,
                                productId,
                                siteId,
                                ProductBatchNumberId: batchId ?? undefined,
                            },
                        });
                    }

                    const existingMovement = await tx.stockMovement.findFirst({
                        where: {
                            type: TypeMovement.INPUT,
                            quantity: stockSeed.quantity,
                            userId: adminUserId,
                            productId,
                            siteId,
                            productBatchNumberId: batchId,
                        },
                    });

                    if (!existingMovement) {
                        await tx.stockMovement.create({
                            data: {
                                type: TypeMovement.INPUT,
                                quantity: stockSeed.quantity,
                                userId: adminUserId,
                                productId,
                                siteId,
                                productBatchNumberId: batchId ?? undefined,
                            },
                        });
                    }
                }
            }

            console.log('ADPC 81 seed completed successfully.');
        },
        {
            maxWait: 20000,
            timeout: 120000,
        },
    );
}

main()
    .catch((error) => {
        console.error('Seed failed:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
