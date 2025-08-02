import { faker } from "@faker-js/faker"

import BcryptPasswordHasher from "@/lib/hash"

import {
  PrismaClient,
  ItemState,
  MaterialRequestStatus,
  Priority,
  AccountType,
  UserRole,
  StockEntryType,
} from "../generated/prisma"

import env from "../lib/env"

env()

const prisma = new PrismaClient()

async function main() {
  const hasher =
    BcryptPasswordHasher.getInstance()

  // Hash admin and user password
  const adminPass = await hasher.hash(
    process.env.ADMIN_PASS || "adminpass",
  )
  const userPass = await hasher.hash("12345678")

  // ✅ Create or update admin user
  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL! },
    update: {
      name: "Admin",
      password: adminPass,
      role: "Admin",
      status: "Active",
    },
    create: {
      name: "Admin",
      email: process.env.ADMIN_EMAIL!,
      password: adminPass,
      role: "Admin",
      status: "Active",
    },
  })
  console.log(`✅ Admin created/updated`)

  // Creating 3 Users for testing
  let users = await Promise.all(
    [
      {
        email: "email@gmail.com",
        name: "tulsidas khan",
        password: "ttt1112233",
        role: UserRole.HR,
      },
      {
        email: "email2@gmail.com",
        name: "joshi mahir",
        password: "mahir2004",
        role: UserRole.Manufacturing,
      },
      {
        email: "email3@gmail.com",
        name: "params parmar",
        password: "heyparam2003",
        role: UserRole.Sales,
      },
    ].map(async u => {
      const hashpass = await hasher.hash(
        u.password,
      )
      return {
        ...u,
        password: hashpass,
      }
    }),
  )
  await prisma.user.createMany({ data: users })
  console.log("✅ Users for testing created")

  // 🎭 Generate 20 fake users
  const fakeUsers = Array.from({
    length: 20,
  }).map(() => ({
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
  }))
  for (const u of fakeUsers) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        password: userPass,
        role: "User",
        status: "Active",
      },
      create: {
        name: u.name,
        email: u.email,
        password: userPass,
        role: "User",
        status: "Active",
      },
    })
  }
  console.log("✅ Fake users inserted or updated")

  // ✅ Create fake registration requests
  const fakeRegistractionRequests = Array.from({
    length: 10,
  }).map(() => ({
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password({
      length: 12,
    }),
    name: faker.person.fullName(),
    reason: faker.lorem.sentence(),
  }))
  for (const r of fakeRegistractionRequests) {
    await prisma.publicRegistrationRequest.upsert(
      {
        where: { email: r.email },
        update: {
          name: r.name,
          password: r.password,
          reason: r.reason,
          state: "Pending",
        },
        create: {
          name: r.name,
          email: r.email,
          password: r.password,
          reason: r.reason,
          state: "Pending",
        },
      },
    )
  }
  console.log(
    "✅ Fake registration requests inserted or updated",
  )

  // Create a test company
  const testCompany = await prisma.company.upsert(
    {
      where: { name: "Test Company" },
      update: {},
      create: {
        name: "Test Company",
        domain: "testco.local",
      },
    },
  )
  console.log("✅ Test company created")

  // Clean up existing test data for clean re-runs
  await prisma.stockEntry.deleteMany({
    where: {
      warehouse: { companyId: testCompany.id },
    },
  })
  await prisma.materialRequestItem.deleteMany({
    where: {
      materialRequest: {
        companyId: testCompany.id,
      },
    },
  })
  await prisma.materialRequest.deleteMany({
    where: { companyId: testCompany.id },
  })
  await prisma.account.deleteMany({
    where: { companyId: testCompany.id },
  })
  await prisma.chartOfAccounts.deleteMany({
    where: { companyId: testCompany.id },
  })
  await prisma.department.deleteMany({
    where: { companyId: testCompany.id },
  })
  console.log("✅ Cleaned existing test data")

  // Create 2 test warehouses
  const warehouse1 =
    await prisma.warehouse.upsert({
      where: {
        name_companyId: {
          name: "Main Warehouse",
          companyId: testCompany.id,
        },
      },
      update: {},
      create: {
        name: "Main Warehouse",
        location: "Head Office",
        companyId: testCompany.id,
      },
    })
  const warehouse2 =
    await prisma.warehouse.upsert({
      where: {
        name_companyId: {
          name: "Secondary Warehouse",
          companyId: testCompany.id,
        },
      },
      update: {},
      create: {
        name: "Secondary Warehouse",
        location: "Branch Office",
        companyId: testCompany.id,
      },
    })
  console.log("✅ Warehouses created")

  // Create item groups
  const itemGroups = [
    {
      name: "Electronics",
      description:
        "Electronic devices and gadgets",
    },
    {
      name: "Furniture",
      description: "Home and office furniture",
    },
    {
      name: "Clothing",
      description: "Apparel and accessories",
    },
    {
      name: "Food",
      description: "Groceries and food items",
    },
    {
      name: "Tools",
      description: "Hand tools and power tools",
    },
  ]
  const itemGroupResults = await Promise.all(
    itemGroups.map(g =>
      prisma.itemGroup.upsert({
        where: { name: g.name },
        update: {},
        create: {
          name: g.name,
          description: g.description,
        },
      }),
    ),
  )
  console.log(
    "✅ Item groups created:",
    itemGroupResults.map(g => g.name),
  )

  // Create 5 items for the test company
  const itemUnits = ["pcs", "kg", "liter"]
  const itemStatuses = [
    "Active",
    "InActive",
    "PreOrder",
    "OutOfStock",
  ] satisfies ItemState[]
  const createdItems = []
  for (let i = 0; i < 5; i++) {
    const item = await prisma.item.create({
      data: {
        sku: `ITEM-${i + 1}`,
        name: faker.commerce.productName(),
        description:
          faker.commerce.productDescription(),
        unit: faker.helpers.arrayElement(
          itemUnits,
        ),
        price: parseFloat(
          faker.commerce.price({
            min: 10,
            max: 500,
          }),
        ),
        status:
          faker.helpers.arrayElement(
            itemStatuses,
          ),
        itemGroupId: faker.helpers.arrayElement(
          itemGroupResults,
        ).id,
      },
    })
    createdItems.push(item)
    await prisma.itemStock.createMany({
      data: [
        {
          itemId: item.id,
          warehouseId: warehouse1.id,
          quantity: faker.number.float({
            min: 5,
            max: 20,
          }),
        },
        {
          itemId: item.id,
          warehouseId: warehouse2.id,
          quantity: faker.number.float({
            min: 5,
            max: 20,
          }),
        },
      ],
    })
  }
  console.log("✅ Items and stock added")

  // Create departments
  const departments = [
    {
      name: "IT Department",
      description: "Information Technology",
    },
    {
      name: "HR Department",
      description: "Human Resources",
    },
    {
      name: "Finance Department",
      description: "Finance and Accounting",
    },
    {
      name: "Operations Department",
      description: "Operations and Manufacturing",
    },
    {
      name: "Sales Department",
      description: "Sales and Marketing",
    },
  ]
  const createdDepartments = []
  for (const d of departments) {
    const dept = await prisma.department.create({
      data: {
        name: d.name,
        description: d.description,
        companyId: testCompany.id,
      },
    })
    createdDepartments.push(dept)
  }
  console.log("✅ Departments created")

  // Create Chart of Accounts and Accounts for cost centers
  const chartOfAccounts =
    await prisma.chartOfAccounts.create({
      data: {
        name: "Main Chart",
        companyId: testCompany.id,
      },
    })
  const costCenterAccounts = [
    {
      name: "IT Cost Center",
      type: "Expense" as AccountType,
      code: "CC001",
    },
    {
      name: "HR Cost Center",
      type: "Expense" as AccountType,
      code: "CC002",
    },
    {
      name: "Finance Cost Center",
      type: "Expense" as AccountType,
      code: "CC003",
    },
    {
      name: "Operations Cost Center",
      type: "Expense" as AccountType,
      code: "CC004",
    },
    {
      name: "Sales Cost Center",
      type: "Expense" as AccountType,
      code: "CC005",
    },
  ]
  const createdAccounts = []
  for (const acc of costCenterAccounts) {
    createdAccounts.push(
      await prisma.account.create({
        data: {
          name: acc.name,
          type: acc.type,
          code: acc.code,
          chartId: chartOfAccounts.id,
          companyId: testCompany.id,
        },
      }),
    )
  }
  console.log("✅ Cost center accounts created")

  // Get all users
  const allUsers = await prisma.user.findMany({
    where: { status: "Active" },
  })

  // Create fake Material Requests
  const mrStatuses = [
    "DRAFT",
    "SUBMITTED",
    "APPROVED",
    "ORDERED",
    "RECEIVED",
    "CANCELLED",
  ] satisfies MaterialRequestStatus[]
  const prioritiesList = [
    "LOW",
    "MEDIUM",
    "HIGH",
    "URGENT",
  ] satisfies Priority[]
  const purposesList = [
    "Production requirements",
    "Maintenance and repair",
    "Office supplies restocking",
    "New project setup",
    "Emergency replacement",
    "Inventory replenishment",
    "Quality testing materials",
    "Customer order fulfillment",
  ]
  for (let i = 1; i <= 15; i++) {
    const mr =
      await prisma.materialRequest.create({
        data: {
          requestNumber: i,
          companyId: testCompany.id,
          requesterId:
            faker.helpers.arrayElement(allUsers)
              .id,
          departmentId:
            faker.helpers.arrayElement(
              createdDepartments,
            ).id,
          costCenterId:
            faker.helpers.arrayElement(
              createdAccounts,
            ).id,
          requiredDate: faker.date.future(),
          priority: faker.helpers.arrayElement(
            prioritiesList,
          ),
          purpose:
            faker.helpers.arrayElement(
              purposesList,
            ),
          status:
            faker.helpers.arrayElement(
              mrStatuses,
            ),
        },
      })
    const itemCount = faker.number.int({
      min: 2,
      max: 5,
    })
    for (let j = 0; j < itemCount; j++) {
      const sel =
        faker.helpers.arrayElement(createdItems)
      await prisma.materialRequestItem.create({
        data: {
          materialRequestId: mr.id,
          itemId: sel.id,
          description:
            faker.commerce.productDescription(),
          quantity: faker.number.float({
            min: 1,
            max: 50,
          }),
          uom: sel.unit,
          warehouseFromId:
            faker.helpers.arrayElement([
              warehouse1.id,
              warehouse2.id,
            ]),
          warehouseToId:
            faker.helpers.arrayElement([
              warehouse1.id,
              warehouse2.id,
            ]),
          estimatedCost: faker.number.float({
            min: 100,
            max: 5000,
          }),
        },
      })
    }
  }
  console.log(
    "✅ Material requests and items created",
  )

  // 🆕 CREATE STOCK ENTRIES
  const stockTypes = [
    "IN",
    "OUT",
    "TRANSFER",
  ] satisfies StockEntryType[]
  const references = [
    "PO-2024-001",
    "SO-2024-001",
    "MR-2024-001",
    "ADJ-2024-001",
    "PROD-2024-001",
    null,
  ]
  console.log("✅ Creating stock entries...")
  for (let i = 1; i <= 30; i++) {
    const et =
      faker.helpers.arrayElement(stockTypes)
    const selItem =
      faker.helpers.arrayElement(createdItems)
    const selWh = faker.helpers.arrayElement([
      warehouse1,
      warehouse2,
    ])
    const selUser =
      faker.helpers.arrayElement(allUsers)
    let qty = 1
    if (et === "IN")
      qty = faker.number.float({
        min: 5,
        max: 100,
      })
    if (et === "OUT")
      qty = faker.number.float({
        min: 1,
        max: 20,
      })
    if (et === "TRANSFER")
      qty = faker.number.float({
        min: 2,
        max: 50,
      })

    const entry = await prisma.stockEntry.create({
      data: {
        itemId: selItem.id,
        warehouseId: selWh.id,
        quantity: qty,
        entryType: et,
        relatedReference:
          faker.helpers.arrayElement(references),
        createdById: selUser.id,
        createdAt: faker.date.between({
          from: new Date(
            Date.now() - 30 * 24 * 60 * 60 * 1000,
          ),
          to: new Date(),
        }),
      },
    })

    const es = await prisma.itemStock.findUnique({
      where: {
        itemId_warehouseId: {
          itemId: selItem.id,
          warehouseId: selWh.id,
        },
      },
    })
    if (es) {
      let newQty = es.quantity
      if (et === "IN") newQty += qty
      if (et === "OUT")
        newQty = Math.max(0, newQty - qty)
      await prisma.itemStock.update({
        where: {
          itemId_warehouseId: {
            itemId: selItem.id,
            warehouseId: selWh.id,
          },
        },
        data: { quantity: newQty },
      })
    }
  }
  console.log(
    "✅ Stock entries created and stock levels updated",
  )

  // ✅ Create global settings if missing
  const setting =
    await prisma.globalSettings.findFirst({
      where: { id: 1 },
    })
  if (!setting) {
    await prisma.globalSettings.create({})
    console.log("✅ Default settings created")
  } else {
    console.log("ℹ️ Settings already exist")
  }
}

main()
  .catch(err => {
    console.error("❌ Error seeding DB:", err)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
