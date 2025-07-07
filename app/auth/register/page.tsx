import { DB } from "@/lib/database";
import { gotError } from "@/lib/redirects";
import { notFound, redirect } from "next/navigation";

export default async function page() {
  const settings = await DB.GetSettings()
  if (!settings) return gotError("Settings not loading", "Settings where not able to load, try again or check with admin")
  if (settings.public_registration === false) return notFound()

  return <div>
    Registraction page
  </div>
}
