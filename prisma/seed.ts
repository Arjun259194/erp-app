import BcryptPasswordHasher from "@/lib/hash";
import { PrismaClient } from "../generated/prisma";
import env from "../lib/env"

env()
const prisma = new PrismaClient()

type DummyUserData = Parameters<PrismaClient['user']['create']>[0]['data']

const dummyUsers: Omit<DummyUserData, "password">[] = [
  {
    email: "dummy1@gmail.com",
    name: "Dymmy 1",
  },
  {
    email: "dummy2@gmail.com",
    name: "Dymmy 2",
  },
  {
    email: "dummy3@gmail.com",
    name: "Dymmy 3",
  },
  {
    email: "dummy4@gmail.com",
    name: "Dymmy 4",
  }
]

async function main() {
  const hasher = BcryptPasswordHasher.getInstance()
  const pass = await hasher.hash(process.env.ADMIN_PASS)
  const userPass = await hasher.hash("12345678")

  await prisma.user.upsert({
    where: {
      email: process.env.ADMIN_EMAIL
    },
    update: {
      name: "admin",
      password: pass,
      role: "Admin",
    },
    create: {
      name: "admin",
      email: process.env.ADMIN_EMAIL,
      password: pass,
      role: "Admin"
    }
  })

  console.log(`Admin created 🌱`)

  await prisma.user.createMany({
    data: dummyUsers.map(user => {
      return { ...user, password: userPass }
    })
  })


  console.log("Dummy users created 🌱")

  const setting = await prisma.globalSettings.findFirst({
    where: {
      id: 1
    }
  })

  if (!setting) {
    await prisma.globalSettings.create({})
  }

  console.log("Default settings created 🌱")

}

main().catch(err => {
  console.error("There is an error: ", err)
})
