import { PrismaClient, Role, SiteType, VehicleType, VehicleStatus, ItemCategory, Condition, TypeMovement, User } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

// Connexion via le driver PG pour correspondre à ton existant
const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Début du seeding ADPC 81...');

    // ----------------------------------------------------
    // 1. CRÉATION DES SITES "INDOOR" (Les Antennes Locales)
    // ----------------------------------------------------
    console.log('🏗️ Création des Antennes (Sites INDOOR)...');

    const siteAlbi = await prisma.site.upsert({
        where: { code: 'ALB' },
        update: {},
        create: {
            name: "Antenne d'Albi",
            code: 'ALB',
            type: SiteType.INDOOR,
            address: {
                create: {
                    number: 8,
                    street: 'Avenue de Lattre de Tassigny',
                    city: 'Albi',
                    zipcode: '81000',
                    state: 'France',
                },
            },
        },
    });

    const siteCastres = await prisma.site.upsert({
        where: { code: 'CST' },
        update: {},
        create: {
            name: 'Antenne de Castres',
            code: 'CST',
            type: SiteType.INDOOR,
            address: {
                create: {
                    number: 12,
                    street: 'Zone de Melou',
                    city: 'Castres',
                    zipcode: '81100',
                    state: 'France',
                },
            },
        },
    });

    // ----------------------------------------------------
    // 2. CRÉATION DES UTILISATEURS (Tes données)
    // ----------------------------------------------------
    console.log('👥 Création des utilisateurs...');
    const password = await bcrypt.hash('Secret123!', 10);

    const users = [
        {
            email: 'admin@test.com',
            firstname: 'Jean',
            lastname: 'Admin',
            phone: '0601020304',
            birthdate: new Date('1980-01-01'),
            role: Role.ADMIN,
            siteId: siteAlbi.id, // Admin rattaché à Albi
            address: { number: 10, street: 'Rue de la Paix', city: 'Paris', zipcode: '75000', state: 'France' },
        },
        {
            email: 'manager@test.com',
            firstname: 'Marie',
            lastname: 'Manager',
            phone: '0612345678',
            birthdate: new Date('1985-05-15'),
            role: Role.MANAGER,
            siteId: siteAlbi.id, // Manager à Albi
            address: { number: 42, street: 'Avenue Foch', city: 'Lyon', zipcode: '69000', state: 'France' },
        },
        {
            email: 'benevole@test.com',
            firstname: 'Paul',
            lastname: 'Bénévole',
            phone: '0698765432',
            birthdate: new Date('1995-12-25'),
            role: Role.BENEVOLE,
            siteId: siteCastres.id, // Bénévole à Castres
            address: { number: 5, street: 'Vieux Port', city: 'Marseille', zipcode: '13000', state: 'France' },
        },
    ];

    let adminUser: User | null = null; // On garde une réf de l'admin pour les opérations de stock plus bas

    for (const u of users) {
        const createdUser = await prisma.user.upsert({
            where: { email: u.email },
            update: { role: u.role, siteId: u.siteId },
            create: {
                email: u.email,
                password: password,
                firstname: u.firstname,
                lastname: u.lastname,
                phone: u.phone,
                birthdate: u.birthdate,
                role: u.role,
                enabled: true,
                siteId: u.siteId,
                address: { create: u.address },
            },
        });
        if (createdUser.role === Role.ADMIN) adminUser = createdUser;
        console.log(`  - 👤 Utilisateur traité : ${u.email} (${u.role})`);
    }

    // ----------------------------------------------------
    // 3. CRÉATION DE LA FLOTTE (Véhicules)
    // ----------------------------------------------------
    console.log('🚑 Création des véhicules...');

    const vpsp814 = await prisma.vehicle.upsert({
        where: { licensePlate: 'AB-814-CD' },
        update: {},
        create: {
            name: 'VPSP 814',
            type: VehicleType.VPSP,
            licensePlate: 'AB-814-CD',
            status: VehicleStatus.OPERATIONAL,
            mileage: 154000,
            siteId: siteAlbi.id, // Rattaché à Albi
        },
    });

    // ----------------------------------------------------
    // 4. CRÉATION DES SACS (Sites OUTDOOR rattachés au véhicule)
    // ----------------------------------------------------
    console.log("🎒 Création des sacs d'intervention (Sites OUTDOOR)...");

    const sac814A = await prisma.site.upsert({
        where: { code: '814A' },
        update: {},
        create: {
            name: 'Lot A (Tente) - VPSP 814',
            code: '814A',
            type: SiteType.OUTDOOR,
        },
    });

    const sac814B = await prisma.site.upsert({
        where: { code: '814B' },
        update: {},
        create: {
            name: 'Lot B (Secours) - VPSP 814',
            code: '814B',
            type: SiteType.OUTDOOR,
        },
    });

    // ----------------------------------------------------
    // 5. CATALOGUE PRODUITS
    // ----------------------------------------------------
    console.log('📦 Création du catalogue de produits...');

    const products = [
        { name: 'Compresses Stériles 10x10', category: ItemCategory.PLAIE, isPerishable: true, minThreshold: 20 },
        { name: 'Sérum Physiologique', category: ItemCategory.PLAIE, isPerishable: true, minThreshold: 50 },
        { name: 'Collier Cervical Adulte', category: ItemCategory.TRAUMA, isPerishable: false, minThreshold: 5 },
        { name: 'Bouteille Oxygène 5L', category: ItemCategory.OXY, isPerishable: false, minThreshold: 2 },
        { name: 'Défibrillateur (DSA)', category: ItemCategory.BILAN, isPerishable: false, minThreshold: 1 },
    ];

    const catalog: Record<string, any> = {};
    for (const p of products) {
        // FindFirst pour éviter de dupliquer si on relance le script
        let prod = await prisma.product.findFirst({ where: { name: p.name } });
        if (!prod) {
            prod = await prisma.product.create({ data: p });
        }
        catalog[p.name] = prod;
    }

    // ----------------------------------------------------
    // 6. INJECTION DE STOCK INITIAL
    // ----------------------------------------------------
    if (adminUser) {
        console.log('✅ Remplissage des étagères et des sacs...');

        // Ajout de 100 Compresses dans la réserve d'Albi
        await prisma.stock.create({
            data: {
                quantity: 100,
                condition: Condition.BON,
                productId: catalog['Compresses Stériles 10x10'].id,
                siteId: siteAlbi.id, // Dans le local
            },
        });

        // Et on trace cette "Entrée Initiale" dans le journal (Double Entrée : INPUT)
        await prisma.stockMovement.create({
            data: {
                type: TypeMovement.INPUT,
                quantity: 100,
                userId: adminUser.id,
                productId: catalog['Compresses Stériles 10x10'].id,
                siteId: siteAlbi.id,
            },
        });

        // On met le Défibrillateur directement dans le sac 814B (Lot Secours)
        await prisma.stock.create({
            data: {
                quantity: 1,
                condition: Condition.BON,
                productId: catalog['Défibrillateur (DSA)'].id,
                siteId: sac814B.id, // Directement dans le sac !
            },
        });

        // Trace comptable (INPUT sur le sac)
        await prisma.stockMovement.create({
            data: {
                type: TypeMovement.INPUT,
                quantity: 1,
                userId: adminUser.id,
                productId: catalog['Défibrillateur (DSA)'].id,
                siteId: sac814B.id,
            },
        });
    }

    console.log('🚀 Seeding ADPC 81 terminé avec succès !');
}

main()
    .catch((e) => {
        console.error('❌ Erreur durant le seeding:', e);
        process.exit(1);
    })
    .finally(async () => await prisma.$disconnect());
