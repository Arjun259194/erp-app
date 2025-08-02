import { prisma } from "."

export const forgotPassword = {
  async FindLatestForgotPasswordRequest(
    userId: string,
  ) {
    return await prisma.forgotPasswordRequest.findFirst(
      {
        where: {
          userId,
          createdAt: {
            gte: new Date(
              Date.now() - 10 * 60 * 1000,
            ),
          },
        },
      },
    )
  },

  async CreateNewForgotPasswordRequest(
    userId: string,
  ) {
    await prisma.forgotPasswordRequest.create({
      data: {
        userId,
      },
    })
  },

  async ClearAllPastForgotPasswordRequest(
    reqId: string,
    userId: string,
  ) {
    await prisma.forgotPasswordRequest.deleteMany(
      {
        where: {
          OR: [{ userId }, { id: reqId }],
        },
      },
    )
  },
}
