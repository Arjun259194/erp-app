import { faker } from "@faker-js/faker";

import BcryptPasswordHasher from "@/lib/hash";

import {
  PrismaClient,
  ItemState,
  MaterialRequestStatus,
  Priority,
  AccountType,
} from "../generated/prisma";

import env from "../lib/env";

env();

const prisma = new PrismaClient();

async function main() {
  const hasher = BcryptPasswordHasher.getInstance();

  // Hash admin and user password

  const adminPass = await hasher.hash(process.env.ADMIN_PASS || "adminpass");

  const userPass = await hasher.hash("12345678");

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
  });

  console.log(`✅ Admin created/updated`);

  // 🎭 Generate 20 fake users

  const fakeUsers = Array.from({ length: 20 }).map(() => ({
    name: faker.person.fullName(),

    email: faker.internet.email().toLowerCase(),
  }));

  for (const user of fakeUsers) {
    await prisma.user.upsert({
      where: { email: user.email },

      update: {
        name: user.name,

        password: userPass,

        role: "User",

        status: "Active",
      },

      create: {
        name: user.name,

        email: user.email,

        password: userPass,

        role: "User",

        status: "Active",
      },
    });
  }

  console.log(`✅ Fake users inserted or updated`);

  const fakeRegistractionRequests = Array.from({ length: 10 }).map(() => ({
    email: faker.internet.email().toLowerCase(),

    password: faker.internet.password({
      length: 12,
    }),

    name: faker.person.fullName(),

    reason: faker.lorem.sentence(),
  }));

  // ✅ Create fake registration requests

  for (const request of fakeRegistractionRequests) {
    await prisma.publicRegistrationRequest.upsert({
      where: { email: request.email },

      update: {
        name: request.name,

        password: request.password,

        reason: request.reason,

        state: "Pending",
      },

      create: {
        name: request.name,

        email: request.email,

        password: request.password,

        reason: request.reason,

        state: "Pending",
      },
    });
  }

  console.log(`✅ Fake registraction requests inserted or updated`);

  // Create a test company

  const testCompany = await prisma.company.upsert({
    where: { name: "Test Company" },

    update: {},

    create: {
      name: "Test Company",

      domain: "testco.local",
    },
  });

  console.log("✅ Test company created");

  // Clean up existing test data for clean re-runs
  await prisma.materialRequestItem.deleteMany({
    where: {
      materialRequest: {
        companyId: testCompany.id,
      },
    },
  });

  await prisma.materialRequest.deleteMany({
    where: { companyId: testCompany.id },
  });

  await prisma.account.deleteMany({
    where: { companyId: testCompany.id },
  });

  await prisma.chartOfAccounts.deleteMany({
    where: { companyId: testCompany.id },
  });

  await prisma.department.deleteMany({
    where: { companyId: testCompany.id },
  });

  console.log("✅ Cleaned existing test data");

  // Create 2 test warehouses

  const warehouse1 = await prisma.warehouse.upsert({
    where: {
      name_companyId: { name: "Main Warehouse", companyId: testCompany.id },
    },

    update: {},

    create: {
      name: "Main Warehouse",

      location: "Head Office",

      companyId: testCompany.id,
    },
  });

  const warehouse2 = await prisma.warehouse.upsert({
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
  });

  console.log("✅ Warehouses created");

  // Create item groups

  const itemGroups = [
    { name: "Electronics", description: "Electronic devices and gadgets" },

    { name: "Furniture", description: "Home and office furniture" },

    { name: "Clothing", description: "Apparel and accessories" },

    { name: "Food", description: "Groceries and food items" },

    { name: "Tools", description: "Hand tools and power tools" },
  ];

  const itemGroupPromises = itemGroups.map(group =>
    prisma.itemGroup.upsert({
      where: { name: group.name },

      update: {},

      create: {
        name: group.name,

        description: group.description,
      },
    }),
  );

  const itemGroupResults = await Promise.all(itemGroupPromises);

  console.log(
    "✅ Item groups created:",

    itemGroupResults.map(g => g.name),
  );

  // Create 5 items for the test company

  const itemUnits = ["pcs", "kg", "liter"];

  const itemStatuses = ["Active", "InActive", "PreOrder", "OutOfStock"] satisfies ItemState[];

  const createdItems = [];

  // pick random itemGroup for each item

  for (let i = 0; i < 5; i++) {
    const item = await prisma.item.create({
      data: {
        sku: `ITEM-${i + 1}`,
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        unit: faker.helpers.arrayElement(itemUnits),
        price: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
        status: faker.helpers.arrayElement(itemStatuses),
        itemGroupId: faker.helpers.arrayElement(itemGroupResults).id, // Randomly assign item group
      },
    });

    createdItems.push(item);

    // Create stock in both warehouses

    await prisma.itemStock.createMany({
      data: [
        {
          itemId: item.id,

          warehouseId: warehouse1.id,

          quantity: faker.number.float({ min: 5, max: 20 }),
        },

        {
          itemId: item.id,

          warehouseId: warehouse2.id,

          quantity: faker.number.float({ min: 5, max: 20 }),
        },
      ],
    });
  }

  console.log("✅ Items and stock added");

  // Create departments

  const departments = [
    { name: "IT Department", description: "Information Technology" },

    { name: "HR Department", description: "Human Resources" },

    { name: "Finance Department", description: "Finance and Accounting" },

    {
      name: "Operations Department",
      description: "Operations and Manufacturing",
    },

    { name: "Sales Department", description: "Sales and Marketing" },
  ];

  const createdDepartments = [];

  for (const dept of departments) {
    const department = await prisma.department.create({
      data: {
        name: dept.name,

        description: dept.description,

        companyId: testCompany.id,
      },
    });

    createdDepartments.push(department);
  }

  console.log("✅ Departments created");

  // Create Chart of Accounts and Accounts for cost centers

  const chartOfAccounts = await prisma.chartOfAccounts.create({
    data: {
      name: "Main Chart",

      companyId: testCompany.id,
    },
  });

  const costCenterAccounts = [
    { name: "IT Cost Center", type: "Expense" as AccountType, code: "CC001" },

    { name: "HR Cost Center", type: "Expense" as AccountType, code: "CC002" },

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
  ];

  const createdAccounts = [];

  for (const acc of costCenterAccounts) {
    const account = await prisma.account.create({
      data: {
        name: acc.name,

        type: acc.type,

        code: acc.code,

        chartId: chartOfAccounts.id,

        companyId: testCompany.id,
      },
    });

    createdAccounts.push(account);
  }

  console.log("✅ Cost center accounts created");

  // Get all users for material requests

  const allUsers = await prisma.user.findMany({
    where: { status: "Active" },
  });

  // Create fake Material Requests

  const materialRequestStatuses = [
    "DRAFT",

    "SUBMITTED",

    "APPROVED",

    "ORDERED",

    "RECEIVED",

    "CANCELLED",
  ] satisfies MaterialRequestStatus[];

  const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"] satisfies Priority[];

  const purposes = [
    "Production requirements",

    "Maintenance and repair",

    "Office supplies restocking",

    "New project setup",

    "Emergency replacement",

    "Inventory replenishment",

    "Quality testing materials",

    "Customer order fulfillment",
  ];

  for (let i = 1; i <= 15; i++) {
    const materialRequest = await prisma.materialRequest.create({
      data: {
        requestNumber: i,

        companyId: testCompany.id,

        requesterId: faker.helpers.arrayElement(allUsers).id,

        departmentId: faker.helpers.arrayElement(createdDepartments).id,

        costCenterId: faker.helpers.arrayElement(createdAccounts).id,

        requiredDate: faker.date.future(),

        priority: faker.helpers.arrayElement(priorities),

        purpose: faker.helpers.arrayElement(purposes),

        status: faker.helpers.arrayElement(materialRequestStatuses),
      },
    });

    // Create 2-5 material request items for each request

    const itemCount = faker.number.int({ min: 2, max: 5 });

    for (let j = 0; j < itemCount; j++) {
      const selectedItem = faker.helpers.arrayElement(createdItems);

      await prisma.materialRequestItem.create({
        data: {
          materialRequestId: materialRequest.id,

          itemId: selectedItem.id,

          description: faker.commerce.productDescription(),

          quantity: faker.number.float({ min: 1, max: 50 }),

          uom: selectedItem.unit,

          warehouseFromId: faker.helpers.arrayElement([warehouse1.id, warehouse2.id]),

          warehouseToId: faker.helpers.arrayElement([warehouse1.id, warehouse2.id]),

          estimatedCost: faker.number.float({ min: 100, max: 5000 }),
        },
      });
    }
  }

  console.log("✅ Material requests and items created");

  // ✅ Create global settings if missing

  const setting = await prisma.globalSettings.findFirst({
    where: { id: 1 },
  });

  if (!setting) {
    await prisma.globalSettings.create({});

    console.log("✅ Default settings created");
  } else {
    console.log("ℹ️ Settings already exist");
  }
}

main()
  .catch(err => {
    console.error("❌ Error seeding DB:", err);
  })

  .finally(async () => {
    await prisma.$disconnect();
  });
