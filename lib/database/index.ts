import { PrismaClient } from "@/generated/prisma"
import { user } from "./user"
import { forgotPassword } from "./forgotPasswordRequest"
import { emailLogin } from "./emailLogin"
import { settings } from "./settings"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export const DB = {
  ...user,
  ...forgotPassword,
  ...emailLogin,
  ...settings
}
