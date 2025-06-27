import prisma from "."

export const emailLogin = {
  async FindLatestEmailLoginRequest(userId: string) {
    return await prisma.emailLoginRequest.findFirst({
      where: {
        userId,
        createdAt: {
          gte: new Date(Date.now() - 10 * 60 * 1000)
        }
      },
    })
  },

  async CreateNewEmailLoginRequest(userId: string) {
    await prisma.emailLoginRequest.create({
      data: {
        userId,
      }
    })
  },

  async ClearAllPastEmailLoginRequest(reqId: string, userId: string) {
    await prisma.emailLoginRequest.deleteMany({
      where: {
        OR: [
          { userId },
          { id: reqId }
        ]
      },
    })
  }
}
