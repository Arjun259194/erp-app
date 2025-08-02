import { GlobalSettings } from "@/generated/prisma"
import { prisma } from "./database"

export class Settings {
  private constructor(
    private data: GlobalSettings,
  ) {}

  static async getInstance(): Promise<Settings | null> {
    const settings =
      await prisma.globalSettings.findFirst({
        where: { id: 1 },
      })

    if (!settings) {
      console.log("No settings found")
      return null
    }

    return new Settings(settings)
  }

  public getState() {
    return this.data
  }

  public publicRegistration() {
    return this.data.public_registration
  }
}
