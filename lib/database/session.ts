import { prisma } from ".";

export const session = {
  async GetSession(userId: string) {
    return await prisma.session.findFirst({
      where: {
        userId
      }
    })
  },

  async RevokeSession(userId: string) {
    return await prisma.session.update({
      data: { revoked: true },
      where: { userId: userId }
    })
  },

  async ClearPastSessions(userId: string) {
    return await prisma.session.deleteMany({
      where: {
        userId
      }
    })
  },

  async RenewOrCreateSession(userId: string, newToken: string, expiresInMs = 1000 * 60 * 60 * 24 * 7) {
    const now = new Date();
    const expiresAt = new Date(Date.now() + expiresInMs);

    const existing = await prisma.session.findFirst({
      where: {
        userId,
        revoked: false,
        expiresAt: { gt: now },
      },
    });

    if (existing) {
      return await prisma.session.update({
        where: { token: existing.token },
        data: {
          token: newToken,
          expiresAt,
        },
      });
    }

    return await prisma.session.create({
      data: {
        token: newToken,
        userId,
        expiresAt,
      },
    });
  },
}
