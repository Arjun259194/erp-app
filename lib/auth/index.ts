"use server"

import { Prisma } from "@/generated/prisma"
import { cookies } from "next/headers"
import { JWToken } from "./jwt"
import { prisma } from "../database"
import { loginRedirect } from "../redirects"

type AuthMessage = `AuthError: ${string}`
type ReturnedUser = Prisma.UserGetPayload<{
  include: {
    companies: true
  }
}>

export async function auth<T>(): Promise<
  [null, AuthMessage] | [ReturnedUser, null]
> {
  const cookieStore = await cookies()

  const token =
    cookieStore.get("authToken")?.value
  if (!token) {
    console.log("from auth(): token not found")
    return [
      null,
      "AuthError: User not Authorized",
    ]
  }

  const jwtoken = JWToken.getInstance()
  const payload = jwtoken.deserialize(token)

  const userID = payload?.data.id
  if (!userID) {
    console.log("from auth(): userID not found")
    return [
      null,
      "AuthError: Authentication expired",
    ]
  }

  let user: ReturnedUser | null

  try {
    user = await prisma.user.findFirst({
      where: {
        id: userID,
      },
      include: {
        companies: true,
      },
    })
  } catch (err) {
    console.log("From auth(): ", err)
    return [null, "AuthError: No User Found"]
  }

  if (!user)
    return [null, "AuthError: No User Found"]

  if (user.status === "Suspended") {
    loginRedirect(
      "You are suspended by the admin",
    )
  }

  return [user, null]
}
