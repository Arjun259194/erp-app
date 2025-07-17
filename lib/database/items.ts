import { PrismaClient } from "@/generated/prisma";
import { prisma } from ".";

export const items = {
  async GetAllItems() {
    return await prisma.item.findMany({
      include: {
        ItemGroup: true,
      },
    });
  },

  async GetAllItemGroups() {
    return await prisma.itemGroup.findMany();
  },

  async NewItemGroup(name: string) {
    return await prisma.itemGroup.create({
      data: {
        name,
      },
    });
  },

  async NewItem(data: Parameters<PrismaClient["item"]["create"]>[0]["data"]) {
    return await prisma.item.create({
      data,
    });
  },

  async GetItemById(id: string) {
    return await prisma.item.findFirst({
      where: {
        id,
      },
      include: {
        ItemGroup: true,
      },
    });
  },
};
