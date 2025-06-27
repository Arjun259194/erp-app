"use server"

import ForgotPasswordEmail from "@/emails/ForgotPassword"
import LoginEmail from "@/emails/LoginWithEmail"
import JWToken, { Payload } from "@/lib/auth"
import { DB } from "@/lib/database"
import SMTPGmailService, { defMailCred, MailBuilder } from "@/lib/email"
import BcryptPasswordHasher from "@/lib/hash"
import { loginSchema } from "@/lib/schemas"
import { ServerAction } from "@/types"
import { render } from "@react-email/components"
import { cookies } from "next/headers"
import z from "zod"

export const handleLogin: ServerAction<{ name: string }> = async formdata => {
  "use server"

  const result = loginSchema.safeParse({
    email: formdata.get("email"),
    password: formdata.get("password")
  })

  if (!result.success) throw new Error(result.error.issues[0].message)

  const { email, password } = result.data

  const user = await DB.FindUserByEmail(email)
  if (!user) throw new Error("No user found")

  const hasher = BcryptPasswordHasher.getInstance()
  const isMatch = await hasher.compare(password, user.password)
  if (!isMatch) throw new Error("Password not a match")

  const jwtoken = JWToken.getInstance()
  const cookieStore = await cookies()

  const payload = new Payload({
    id: user.id,
    email: user.email
  })

  const token = jwtoken.serialize(payload)

  cookieStore.set({
    name: 'authToken',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 // 1 day
  })

  return { name: user.name }
}

export const handleForgotPass: ServerAction = async formdata => {
  const safeEmail = z.string().email().safeParse(formdata.get("email"))
  if (!safeEmail.success)
    throw new Error(safeEmail.error.issues[0].message)

  const email = safeEmail.data

  const result = await DB.FindUserByEmail(email)
  if (!result)
    throw new Error("Email doesn't exists, check credentials")

  const recent = await DB.FindLatestForgotPasswordRequest(result.id)
  if (recent)
    throw new Error("Reset link already sent recently. Please wait a few minutes.")

  const mailer = SMTPGmailService.getInstance(defMailCred)
  const jwtoken = JWToken.getInstance()

  const payload = new Payload({ id: result.id, email: result.email })

  const token = jwtoken.serialize(payload, "5 Minutes")

  try {
    await DB.CreateNewForgotPasswordRequest(result.id)
  } catch (err) {
    console.error(err)
    throw new Error("Something went wrong")
  }

  const url = new URL("/auth/reset-password", process.env.NEXT_PUBLIC_APP_URL)
  url.searchParams.set("token", token)

  const mailbody: string = await render(
    <ForgotPasswordEmail resetUrl={url.toString()} username={result.name} />
  );

  const mailConfig = await MailBuilder
    .create()
    .to(result.email)
    .from("quesher4@gmail.com")
    .subject("Reset Password")
    .build(mailbody);


  await mailer.sendMail(mailConfig)

  return
}

export const handleLoginWithEmail: ServerAction = async formdata => {
  const safeEmail = z.string().email().safeParse(formdata.get("email"))
  if (!safeEmail.success)
    throw new Error(safeEmail.error.issues[0].message)

  const email = safeEmail.data

  const result = await DB.FindUserByEmail(email)

  if (!result)
    throw new Error("Email doesn't exists, check credentials")

  const recent = await DB.FindLatestEmailLoginRequest(result.id)

  if (recent)
    throw new Error("Login link already sent recently. Please wait a few minutes.")

  const mailer = SMTPGmailService.getInstance(defMailCred)
  const jwtoken = JWToken.getInstance()

  const payload = new Payload({ id: result.id, email: result.email })

  const token = jwtoken.serialize(payload, "5 Minutes")

  try {
    await DB.CreateNewEmailLoginRequest(result.id)
  } catch (err) {
    console.error(err)
    throw new Error("Something went wrong")
  }

  const url = new URL("/api/auth/email-login", process.env.NEXT_PUBLIC_APP_URL)
  url.searchParams.set("token", token)

  const mailbody: string = await render(
    <LoginEmail loginUrl={url.toString()} username={result.name} />
  );

  const mailConfig = await MailBuilder
    .create()
    .to(result.email)
    .from("quesher4@gmail.com")
    .subject("Login to ERP-APP")
    .build(mailbody);

  await mailer.sendMail(mailConfig)

  return
}

