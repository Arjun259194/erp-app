import { updateSettings } from "@/actions/settings"
import SystemSettings from "@/components/SystemSettings"
import { auth } from "@/lib/auth"
import { Settings } from "@/lib/settings"
import { redirect } from "next/navigation"

export default async function page() {
  const [user, error] = await auth()
  if (error !== null) redirect("/auth/login?message=" + encodeURIComponent(error))
  if (user.role !== "Admin") redirect("/home?message=" + encodeURIComponent("Not authorized for this page"))

  const settings = await Settings.getInstance()
  if (!settings) redirect("/settings?message=" + encodeURIComponent("Settings not loaded, try again"))
  const data = settings.getState()

  const { id: _, ...safeData } = data

  console.log("safeData:", safeData)

  return <div>
    <SystemSettings actions={{
      update: updateSettings
    }} settings={safeData} />
  </div>
}
