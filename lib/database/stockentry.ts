import { prisma } from "."

export const stockEntry = {
  async GetAllStockEntry(companyIds: string[]) {
    return await prisma.stockEntry.findMany({
      where:
        companyIds?.length > 0
          ? {
              warehouse: {
                companyId: {
                  in: companyIds,
                },
              },
            }
          : undefined,
      include: {
        item: {
          select: {
            id: true,
            name: true,
            stockEntries: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        warehouse: {
          include: {
            company: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  },
}
