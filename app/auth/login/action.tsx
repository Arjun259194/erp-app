"use server";

import ForgotPasswordEmail from "@/emails/ForgotPassword";
import LoginEmail from "@/emails/LoginWithEmail";
import { JWToken } from "@/lib/auth/jwt";
import { Payload } from "@/lib/auth/Payload";
import { DB } from "@/lib/database";
import SMTPGmailService, { defMailCred, MailBuilder } from "@/lib/email";
import BcryptPasswordHasher from "@/lib/hash";
import { loginSchema } from "@/lib/schemas";
import { ServerAction } from "@/types";
import { render } from "@react-email/components";
import { cookies } from "next/headers";
import z from "zod";

export const handleLogin: ServerAction<{ name: string }> = async formdata => {
  "use server";

  const result = loginSchema.safeParse({
    email: formdata.get("email"),
    password: formdata.get("password"),
  });

  if (!result.success) throw new Error(result.error.issues[0].message);

  const { email, password } = result.data;

  const user = await DB.FindUserByEmail(email);

  if (!user) throw new Error("No user found");
  if (user.status === "Suspended") throw new Error("You have bees suspended by admin");

  const hasher = BcryptPasswordHasher.getInstance();
  const isMatch = await hasher.compare(password, user.password);
  if (!isMatch) throw new Error("Password not a match");

  const jwtoken = JWToken.getInstance();
  const cookieStore = await cookies();

  const payload = new Payload({
    id: user.id,
    email: user.email,
  });

  const token = jwtoken.serialize(payload);
  const exp = Date.now() + 60 * 60 * 24;

  cookieStore.set({
    name: "authToken",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: exp,
    expires: new Date(exp),
  });

  return { name: user.name };
};

export const handleForgotPass: ServerAction = async formdata => {
  const safeEmail = z.string().email().safeParse(formdata.get("email"));
  if (!safeEmail.success) throw new Error(safeEmail.error.issues[0].message);

  const email = safeEmail.data;

  const user = await DB.FindUserByEmail(email);
  if (!user) throw new Error("Email doesn't exists, check credentials");
  if (user.status === "Suspended") throw new Error("You have bees suspended by admin");

  const recent = await DB.FindLatestForgotPasswordRequest(user.id);
  if (recent) throw new Error("Reset link already sent recently. Please wait a few minutes.");

  const mailer = SMTPGmailService.getInstance(defMailCred);
  const jwtoken = JWToken.getInstance();

  const payload = new Payload({ id: user.id, email: user.email });

  const token = jwtoken.serialize(payload, "5 Minutes");

  try {
    await DB.CreateNewForgotPasswordRequest(user.id);
  } catch (err) {
    console.error(err);
    throw new Error("Something went wrong");
  }

  const url = new URL("/auth/reset-password", process.env.NEXT_PUBLIC_APP_URL);
  url.searchParams.set("token", token);

  const mailbody: string = await render(
    <ForgotPasswordEmail resetUrl={url.toString()} username={user.name} />,
  );

  const mailConfig = await MailBuilder.create()
    .to(user.email)
    .from("quesher4@gmail.com")
    .subject("Reset Password")
    .build(mailbody);

  await mailer.sendMail(mailConfig);

  return;
};

export const handleLoginWithEmail: ServerAction = async formdata => {
  const safeEmail = z.string().email().safeParse(formdata.get("email"));
  if (!safeEmail.success) throw new Error(safeEmail.error.issues[0].message);

  const email = safeEmail.data;

  const user = await DB.FindUserByEmail(email);

  if (!user) throw new Error("Email doesn't exists, check credentials");
  if (user.status === "Suspended") throw new Error("You have bees suspended by admin");

  const recent = await DB.FindLatestEmailLoginRequest(user.id);

  if (recent) throw new Error("Login link already sent recently. Please wait a few minutes.");

  const mailer = SMTPGmailService.getInstance(defMailCred);
  const jwtoken = JWToken.getInstance();

  const payload = new Payload({ id: user.id, email: user.email });

  const token = jwtoken.serialize(payload, "5 Minutes");

  try {
    await DB.CreateNewEmailLoginRequest(user.id);
  } catch (err) {
    console.error(err);
    throw new Error("Something went wrong");
  }

  const url = new URL("/api/auth/email-login", process.env.NEXT_PUBLIC_APP_URL);
  url.searchParams.set("token", token);

  const mailbody: string = await render(
    <LoginEmail loginUrl={url.toString()} username={user.name} />,
  );

  const mailConfig = await MailBuilder.create()
    .to(user.email)
    .from("quesher4@gmail.com")
    .subject("Login to ERP-APP")
    .build(mailbody);

  await mailer.sendMail(mailConfig);

  return;
};
