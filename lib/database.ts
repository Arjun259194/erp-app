import { PrismaClient } from "@/generated/prisma"
const prisma = new PrismaClient()
export default prisma

type UserUpdateParam = Parameters<typeof prisma.user.update>[0]['data']

export const DB = {
  async UpdateUserById(id: string, update: UserUpdateParam) {
    await prisma.user.update({
      where: { id }, data: update
    })
  },

  async FindForgotPassReq(userId: string, token: string) {
    return await prisma.forgotPasswordRequest.findFirst({
      where: {
        userId,
        token
      },
      orderBy: {
        createdAt: "desc"
      }
    })
  },

  async FindUserById(id: string) {
    return await prisma.user.findUnique({
      where: {
        id,
      }
    })
  },

  async FindUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      }
    })
  },

  async FindLatestForgotPasswordRequest(userId: string) {
    return await prisma.forgotPasswordRequest.findFirst({
      where: {
        userId,
        createdAt: {
          gte: new Date(Date.now() - 10 * 60 * 1000) 
        }
      },
    })
  },

  async CreateNewForgotPasswordRequest(userId: string, token: string) {
    await prisma.forgotPasswordRequest.create({
      data: {
        userId,
        token
      }
    })
  }
}
