import JWToken from "@/lib/auth"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { ReactNode } from "react"


interface Props {
  children: ReactNode
}

export default async function AuthorizedLayout({ children }: Props) {
  const cookieStore = await cookies()
  const token = cookieStore.get("authToken")?.value

  if (!token) {
    redirect("/auth/login?message=" + encodeURIComponent("You must be logged in to access this page"))
  }

  const auth = JWToken.getInstance()
  const payload = auth.deserialize(token)

  if (!payload) {
    redirect("/auth/login?message=" + encodeURIComponent("Session expired or invalid. Please log in again."))
  }

  // You can also pass user info via context or props if needed

  return <>{children}</>
}

