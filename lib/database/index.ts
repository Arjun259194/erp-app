import { PrismaClient } from "@/generated/prisma"
import { user } from "./user"
import { forgotPassword } from "./forgotPasswordRequest"
import { emailLogin } from "./emailLogin"
const prisma = new PrismaClient()
export default prisma

export const DB = {
  ...user,
  ...forgotPassword,
  ...emailLogin
}
