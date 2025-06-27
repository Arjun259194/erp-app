import prisma from "."

type UserUpdateParam = Parameters<typeof prisma.user.update>[0]['data']

export const user = {
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
}
