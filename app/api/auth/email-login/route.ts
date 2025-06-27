import JWToken from "@/lib/auth";
import { DB } from "@/lib/database";
import { gotError } from "@/lib/redirects";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const token = searchParams.get("token")
  if (!token)
    return gotError("Not valid URL", "The link which you are using for logging in is not a valid url")

  const payload = JWToken.getInstance().deserialize(token)
  if (!payload)
    return gotError("Token expired", "Your link is expired and can't be used")


  const user = await DB.FindUserById(payload.data.id)
  if (!user)
    return gotError("User not found", "You are not in our database records, check you email or try again")

  const req = await DB.FindLatestEmailLoginRequest(user.id)

  if (!req)
    return gotError("Request expired", "Your email login request is expired, try again")

  const response = NextResponse.redirect(new URL('/home', request.url));

  response.cookies.set({
    name: 'authToken',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 // 1 day
  })

  await DB.ClearAllPastEmailLoginRequest(req.id, user.id)

  return response
}
