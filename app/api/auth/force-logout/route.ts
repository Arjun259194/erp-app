// app/auth/force-logout/route.ts
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  console.log("endpoint hit")
  const cookieStore = await cookies()

  cookieStore.set({
    name: "authToken",
    value: "",
    path: "/",
    httpOnly: true,
    expires: new Date(0),
  })

  const url = new URL(req.url)
  const message =
    url.searchParams.get("message") ||
    "Logged out"

  const redirectURL = new URL(
    "/auth/login",
    process.env.NEXT_PUBLIC_APP_URL,
  )

  redirectURL.searchParams.set("message", message)

  return NextResponse.redirect(
    redirectURL.toString(),
  )
}
