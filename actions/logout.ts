"use server"
import { cookies } from "next/headers"

export default async function logout() {
  const cookiestore = await cookies()

  if (!cookiestore.has("authToken")) return

  cookiestore.set({
    name: "authToken",
    value: "",
    path: "/",
    expires: new Date(0),
    httpOnly: true,
  })

  return
}
