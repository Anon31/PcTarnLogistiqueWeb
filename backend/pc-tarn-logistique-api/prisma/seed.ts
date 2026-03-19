import {
  PrismaClient,
  Role,
  SiteType,
  VehicleType,
  VehicleStatus,
  ItemCategory,
  Condition,
  TypeMovement,
} from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding started...')

  await prisma.$transaction(async (tx) => {
    // --------------------------------------------------
    // 1. BAG TEMPLATES
    // --------------------------------------------------
    const lotA = await tx.bagTemplate.upsert({
      where: { name: 'LOT A' },
      update: {},
      create: { name: 'LOT A' },
    })

    const lotB = await tx.bagTemplate.upsert({
      where: { name: 'LOT B' },
      update: {},
      create: { name: 'LOT B' },
    })

    // --------------------------------------------------
    // 2. SITES (MANDATORY RELATION)
    // --------------------------------------------------
    const siteAlbi = await tx.site.upsert({
      where: { code: 'ALB' },
      update: {},
      create: {
        name: "Antenne d'Albi",
        code: 'ALB',
        type: SiteType.INDOOR,
        bagTemplate: { connect: { id: lotA.id } },
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
    })

    const sac814B = await tx.site.upsert({
      where: { code: '814B' },
      update: {},
      create: {
        name: 'Lot B - VPSP 814',
        code: '814B',
        type: SiteType.OUTDOOR,
        bagTemplate: { connect: { id: lotB.id } },
      },
    })

    // --------------------------------------------------
    // 3. USERS
    // --------------------------------------------------
    const password = await bcrypt.hash('Secret123!', 10)

    const admin = await tx.user.upsert({
      where: { email: 'admin@test.com' },
      update: {},
      create: {
        firstname: 'Admin',
        lastname: 'User',
        email: 'admin@test.com',
        password,
        role: Role.ADMIN,
        enabled: true,
        siteId: siteAlbi.id,
      },
    })

    // --------------------------------------------------
    // 4. PRODUCTS
    // --------------------------------------------------
    const compresses = await tx.product.upsert({
      where: { name: 'Compresses' },
      update: {},
      create: {
        name: 'Compresses',
        category: ItemCategory.PLAIE,
        minThreshold: 20,
        isPerishable: true,
      },
    })

    const defib = await tx.product.upsert({
      where: { name: 'Défibrillateur' },
      update: {},
      create: {
        name: 'Défibrillateur',
        category: ItemCategory.BILAN,
        minThreshold: 1,
        isPerishable: false,
      },
    })

    // --------------------------------------------------
    // 5. BAG TEMPLATE ITEMS (COMPOSITE UNIQUE ✅)
    // --------------------------------------------------
    await tx.bagTemplateItem.upsert({
      where: {
        bagTemplateId_productId: {
          bagTemplateId: lotB.id,
          productId: compresses.id,
        },
      },
      update: {
        expectedQuantity: 5,
      },
      create: {
        bagTemplateId: lotB.id,
        productId: compresses.id,
        expectedQuantity: 5,
      },
    })

    // --------------------------------------------------
    // 6. VEHICLE
    // --------------------------------------------------
    const vehicle = await tx.vehicle.upsert({
      where: { licensePlate: 'AB-123-CD' },
      update: {},
      create: {
        name: 'VPSP 1',
        type: VehicleType.VPSP,
        licensePlate: 'AB-123-CD',
        status: VehicleStatus.OPERATIONAL,
        siteId: siteAlbi.id,
      },
    })

    // --------------------------------------------------
    // 7. STOCK + MOVEMENTS
    // --------------------------------------------------
    await tx.stock.create({
      data: {
        quantity: 100,
        condition: Condition.BON,
        productId: compresses.id,
        siteId: siteAlbi.id,
      },
    })

    await tx.stockMovement.create({
      data: {
        type: TypeMovement.INPUT,
        quantity: 100,
        userId: admin.id,
        productId: compresses.id,
        siteId: siteAlbi.id,
      },
    })

    await tx.stock.create({
      data: {
        quantity: 1,
        condition: Condition.BON,
        productId: defib.id,
        siteId: sac814B.id,
      },
    })

    await tx.stockMovement.create({
      data: {
        type: TypeMovement.INPUT,
        quantity: 1,
        userId: admin.id,
        productId: defib.id,
        siteId: sac814B.id,
      },
    })

    console.log('✅ Seeding completed')
  })
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
