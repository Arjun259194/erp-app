import { PublicRegistrationForm } from "@/components/PublicRegistractionForm"
import { MessageDialog } from "@/components/MessageDialog"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { DB } from "@/lib/database"
import { gotError } from "@/lib/redirects"
import { notFound } from "next/navigation"
import { register } from "./action"

export default async function page() {
  const settings = await DB.GetSettings()
  if (!settings)
    return gotError(
      "Settings not loading",
      "Settings where not able to load, try again or check with admin",
    )
  if (settings.public_registration === false)
    return notFound()

  return (
    <>
      <MessageDialog />
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="flex flex-col w-full md:w-1/3 items-center gap-6">
          {/* Logo and Title */}
          <div className="text-center">
            <div className="text-4xl text-foreground font-bold mb-2">
              ERP
            </div>
            <h1 className="text-xl font-semibold text-secondary-foreground">
              Login to ERPAPP
            </h1>
          </div>

          {/* Card Container */}
          <Card className="w-full">
            <CardContent className="p-6 space-y-4">
              <PublicRegistrationForm
                action={register}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
