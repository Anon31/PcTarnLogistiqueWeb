import { PrismaClient, Role, SiteType, VehicleType, VehicleStatus, ItemCategory, Condition, TypeMovement } from '@prisma/client';
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

    await prisma.$transaction(async (tx) => {
        // ----------------------------------------------------
        // 1. CRÉATION DES MODÈLES DE SACS (BagTemplate)
        // ----------------------------------------------------
        console.log('📋 Création des modèles de sacs (Référentiel FSD)...');
        const lotA = await tx.bagTemplate.upsert({
            where: { name: 'LOT A' },
            update: {},
            create: { name: 'LOT A' },
        });

        const lotB = await tx.bagTemplate.upsert({
            where: { name: 'LOT B' },
            update: {},
            create: { name: 'LOT B' },
        });

        // ----------------------------------------------------
        // 2. CRÉATION DES SITES "INDOOR" (Les Antennes Locales)
        // ----------------------------------------------------
        console.log('🏗️ Création des Antennes (Sites INDOOR)...');
        const siteAlbi = await tx.site.upsert({
            where: { code: 'ALB' },
            update: {},
            create: {
                name: "Antenne d'Albi",
                code: 'ALB',
                type: SiteType.INDOOR,
                address: {
                    create: { number: 8, street: 'Avenue de Lattre de Tassigny', city: 'Albi', zipcode: '81000', state: 'France' },
                },
            },
        });

        const siteCastres = await tx.site.upsert({
            where: { code: 'CST' },
            update: {},
            create: {
                name: 'Antenne de Castres',
                code: 'CST',
                type: SiteType.INDOOR,
                address: {
                    create: { number: 12, street: 'Zone de Melou', city: 'Castres', zipcode: '81100', state: 'France' },
                },
            },
        });

        // ----------------------------------------------------
        // 3. CRÉATION DES UTILISATEURS
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
                siteId: siteAlbi.id,
                address: { number: 10, street: 'Rue de la Paix', city: 'Paris', zipcode: '75000', state: 'France' },
            },
            {
                email: 'manager@test.com',
                firstname: 'Marie',
                lastname: 'Manager',
                phone: '0612345678',
                birthdate: new Date('1985-05-15'),
                role: Role.MANAGER,
                siteId: siteAlbi.id,
                address: { number: 42, street: 'Avenue Foch', city: 'Lyon', zipcode: '69000', state: 'France' },
            },
            {
                email: 'benevole@test.com',
                firstname: 'Paul',
                lastname: 'Bénévole',
                phone: '0698765432',
                birthdate: new Date('1995-12-25'),
                role: Role.BENEVOLE,
                siteId: siteCastres.id,
                address: { number: 5, street: 'Vieux Port', city: 'Marseille', zipcode: '13000', state: 'France' },
            },
        ];

        // FIX: Removed unused `User` type import. Use the return type of upsert directly.
        let adminUserId: number | null = null;

        for (const u of users) {
            const createdUser = await tx.user.upsert({
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
            if (createdUser.role === Role.ADMIN) adminUserId = createdUser.id;
            console.log(`  - 👤 Utilisateur traité : ${u.email} (${u.role})`);
        }

        // ----------------------------------------------------
        // 4. CRÉATION DE LA FLOTTE (Véhicules)
        // ----------------------------------------------------
        console.log('🚑 Création des véhicules...');
        const vpsp814 = await tx.vehicle.upsert({
            where: { licensePlate: 'AB-814-CD' },
            update: {},
            create: {
                name: 'VPSP 814',
                type: VehicleType.VPSP,
                licensePlate: 'AB-814-CD',
                status: VehicleStatus.OPERATIONAL,
                mileage: 154000,
                siteId: siteAlbi.id,
            },
        });

        // ----------------------------------------------------
        // 5. CRÉATION DES SACS (Sites OUTDOOR) + BagTemplateSite
        // ----------------------------------------------------
        // FIX: `Site` has no `bagTemplateId` field and no `bagTemplate` relation.
        // The link between a Site and a BagTemplate is through the `BagTemplateSite`
        // join model, which must be created separately.
        console.log("🎒 Création des sacs d'intervention (Sites OUTDOOR)...");

        const sac814A = await tx.site.upsert({
            where: { code: '814A' },
            update: {},
            create: {
                name: 'Lot A (Tente) - VPSP 814',
                code: '814A',
                type: SiteType.OUTDOOR,
            },
        });

        // FIX: Create the BagTemplateSite join record to link sac814A → lotA.
        // `siteId` is @unique on BagTemplateSite, so upsert is safe on re-runs.
        await tx.bagTemplateSite.upsert({
            where: { siteId: sac814A.id },
            update: { bagTemplateId: lotA.id },
            create: { siteId: sac814A.id, bagTemplateId: lotA.id },
        });

        const sac814B = await tx.site.upsert({
            where: { code: '814B' },
            update: {},
            create: {
                name: 'Lot B (Secours) - VPSP 814',
                code: '814B',
                type: SiteType.OUTDOOR,
            },
        });

        // FIX: Same join record for sac814B → lotB.
        await tx.bagTemplateSite.upsert({
            where: { siteId: sac814B.id },
            update: { bagTemplateId: lotB.id },
            create: { siteId: sac814B.id, bagTemplateId: lotB.id },
        });

        // ----------------------------------------------------
        // 6. CATALOGUE PRODUITS
        // ----------------------------------------------------
        console.log('📦 Création du catalogue de produits...');
        const products = [
            { name: 'Compresses Stériles 10x10', category: ItemCategory.PLAIE, isPerishable: true, minThreshold: 20 },
            { name: 'Sérum Physiologique', category: ItemCategory.PLAIE, isPerishable: true, minThreshold: 50 },
            { name: 'Collier Cervical Adulte', category: ItemCategory.TRAUMA, isPerishable: false, minThreshold: 5 },
            { name: 'Bouteille Oxygène 5L', category: ItemCategory.OXY, isPerishable: false, minThreshold: 2 },
            { name: 'Défibrillateur (DSA)', category: ItemCategory.BILAN, isPerishable: false, minThreshold: 1 },
        ];

        const catalog: Record<string, { id: number }> = {};
        for (const p of products) {
            const prod = await tx.product.upsert({
                where: { name: p.name },
                update: {},
                create: p,
            });
            catalog[p.name] = prod;
        }

        // ----------------------------------------------------
        // 7. BAG TEMPLATE ITEMS
        // ----------------------------------------------------
        console.log('🔗 Liaison des produits aux modèles de sacs...');
        await tx.bagTemplateItem.upsert({
            where: {
                bagTemplateId_productId: {
                    bagTemplateId: lotB.id,
                    productId: catalog['Compresses Stériles 10x10'].id,
                },
            },
            update: { expectedQuantity: 6 },
            create: {
                bagTemplateId: lotB.id,
                productId: catalog['Compresses Stériles 10x10'].id,
                expectedQuantity: 6,
            },
        });

        // ----------------------------------------------------
        // 8. INJECTION DE STOCK INITIAL
        // ----------------------------------------------------
        if (adminUserId) {
            console.log('✅ Remplissage des étagères et des sacs...');
            await tx.stock.create({
                data: {
                    quantity: 100,
                    condition: Condition.BON,
                    productId: catalog['Compresses Stériles 10x10'].id,
                    siteId: siteAlbi.id,
                },
            });

            await tx.stockMovement.create({
                data: {
                    type: TypeMovement.INPUT,
                    quantity: 100,
                    userId: adminUserId,
                    productId: catalog['Compresses Stériles 10x10'].id,
                    siteId: siteAlbi.id,
                },
            });

            await tx.stock.create({
                data: {
                    quantity: 1,
                    condition: Condition.BON,
                    productId: catalog['Défibrillateur (DSA)'].id,
                    siteId: sac814B.id,
                },
            });

            await tx.stockMovement.create({
                data: {
                    type: TypeMovement.INPUT,
                    quantity: 1,
                    userId: adminUserId,
                    productId: catalog['Défibrillateur (DSA)'].id,
                    siteId: sac814B.id,
                },
            });
        }

        console.log('🚀 Seeding ADPC 81 terminé avec succès !');
    });
}

main()
    .catch((e) => {
        console.error('❌ Erreur durant le seeding:', e);
        process.exit(1);
    })
    .finally(async () => await prisma.$disconnect());