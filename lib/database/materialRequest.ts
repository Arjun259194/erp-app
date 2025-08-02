import { prisma } from "."

export const materialRequest = {
  async GetAllMaterialRequests() {
    return prisma.materialRequest.findMany({
      include: {
        requester: {
          select: { id: true, name: true },
        },
        department: {
          select: { id: true, name: true },
        },
        costCenter: {
          select: { id: true, name: true },
        },
        items: {
          include: {
            item: {
              select: {
                id: true,
                sku: true,
                name: true,
              },
            },
          },
        },
      },
    })
  },

  async GetMaterialRequestByID(id: string) {
    return prisma.materialRequest.findUnique({
      where: { id },
      include: {
        company: true,
        requester: true,
        department: true,
        costCenter: true,
        items: {
          include: {
            item: true,
          },
        },
        workOrders: true,
        purchaseOrders: true,
      },
    })
  },
}
