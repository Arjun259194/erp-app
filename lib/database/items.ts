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

  async UpdateItemById<T extends Parameters<PrismaClient["item"]["update"]>[0]["data"]>(
    id: string,
    data: T,
  ) {
    return await prisma.item.update({
      where: {
        id,
      },
      data,
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

  async GetItemGroupById(id: string) {
    return await prisma.itemGroup.findFirst({
      where: {
        id,
      },
    });
  },
};
