import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Début du seeding...');

    // 1. Rôles
    const roles = ['ADMIN', 'BENEVOLE', 'MANAGER'];
    for (const roleName of roles) {
        await prisma.role.upsert({
            where: { name: roleName },
            update: {},
            create: { name: roleName },
        });
    }

    // 2. Users de test
    const password = await bcrypt.hash('Secret123!', 10);

    const users = [
        {
            email: 'admin@test.com',
            firstname: 'Jean',
            lastname: 'Admin',
            phone: '0601020304',
            birthdate: new Date('1980-01-01'),
            role: 'ADMIN',
            address: {
                number: 10,
                street: 'Rue de la Paix',
                city: 'Paris',
                zipcode: '75000',
                state: 'France',
            },
        },
        {
            email: 'manager@test.com',
            firstname: 'Marie',
            lastname: 'Manager',
            phone: '0612345678',
            birthdate: new Date('1985-05-15'),
            role: 'MANAGER',
            address: {
                number: 42,
                street: 'Avenue Foch',
                city: 'Lyon',
                zipcode: '69000',
                state: 'France',
            },
        },
        {
            email: 'benevole@test.com',
            firstname: 'Paul',
            lastname: 'Bénévole',
            phone: '0698765432',
            birthdate: new Date('1995-12-25'),
            role: 'BENEVOLE',
            address: {
                number: 5,
                street: 'Vieux Port',
                city: 'Marseille',
                zipcode: '13000',
                state: 'France',
            },
        },
    ];

    // 4. Boucle de création uniquement
    for (const u of users) {
        await prisma.user.upsert({
            where: { email: u.email },
            update: {}, // Ne fait rien si l'utilisateur existe déjà (protection)
            create: {
                email: u.email,
                password: password,
                firstname: u.firstname,
                lastname: u.lastname,
                phone: u.phone,
                birthdate: u.birthdate,
                enabled: true,
                roles: { connect: { name: u.role } },
                address: {
                    create: u.address,
                },
            },
        });
        console.log(`👤 Utilisateur traité : ${u.email} (${u.role})`);
    }

    console.log('✅ Seeding terminé !');
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
