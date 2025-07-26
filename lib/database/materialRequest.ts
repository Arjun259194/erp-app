import { prisma } from ".";

export const materialRequest = {
  async GetAllMaterialRequests() {
    return prisma.materialRequest.findMany({
      include: {
        requester: { select: { id: true, name: true } },
        department: { select: { id: true, name: true } },
        costCenter: { select: { id: true, name: true } },
        items: { include: { item: { select: { id: true, sku: true, name: true } } } },
      },
    });
  },
};
