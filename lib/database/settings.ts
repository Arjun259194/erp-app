import { GlobalSettings } from "@/generated/prisma"
import { prisma } from "."

export const settings = {
  async GetSettings() {
    return await prisma.globalSettings.findUnique({
      where: { id: 1 }
    })
  },

  async UpdateSettings(input: Partial<Omit<GlobalSettings, "id">>) {
    return await prisma.globalSettings.update({
      where: { id: 1 },
      data: { ...input }
    })
  }
}
