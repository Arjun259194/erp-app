import { prisma } from "."
import BcryptPasswordHasher from "../hash"

type UserUpdateParam = Parameters<typeof prisma.user.update>[0]['data']

export const user = {
  async FetchAllUsers() {
    return await prisma.user.findMany({
      where: {
        NOT: [{
          email: process.env.ADMIN_EMAIL
        }]
      }
    })
  },
  async UpdateUserById(id: string, update: UserUpdateParam) {
    await prisma.user.update({
      where: { id }, data: update
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

  async CreateUser(data: Parameters<typeof prisma.user.create>[0]['data']) {
    const hasher = BcryptPasswordHasher.getInstance()
    const hashPass = await hasher.hash(data.password)

    return await prisma.user.create({
      data: {
        ...data,
        password: hashPass
      }
    })
  },

  async DeleteUserById(id: string) {
    await prisma.user.delete({
      where: { id }
    })
  }
}
