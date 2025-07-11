import { faker } from "@faker-js/faker";
import BcryptPasswordHasher from "@/lib/hash";
import { PrismaClient } from "../generated/prisma";
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
  .catch((err) => {
    console.error("❌ Error seeding DB:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

