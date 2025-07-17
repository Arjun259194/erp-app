"use server";

import { AcceptedRegistrerRequest } from "@/emails/AcceptedRegisterRequest";
import { RejectedRegisterRequest } from "@/emails/RejectedRegisterRequest";
import { DB } from "@/lib/database";
import SMTPGmailService, { MailBuilder } from "@/lib/email";
import BcryptPasswordHasher from "@/lib/hash";
import { render } from "@react-email/components";

export async function acceptRegistractionRequest({
  id,
  customMessage,
}: {
  id: string;
  customMessage?: string;
}) {
  const request = await DB.FindRegisterRequest(id);
  if (!request) throw new Error("Request not found");

  const hasher = BcryptPasswordHasher.getInstance();

  const hashPass = await hasher.hash(request.password);

  // Create user in the database
  const newUser = await DB.CreateUser({
    name: request.name,
    email: request.email,
    password: hashPass,
    role: "User", // Default role for new users
    status: "Active", // Set status to active
  });

  await DB.ChangeRegisterRequestState(id, "Approved");

  const mailer = SMTPGmailService.getInstance({
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_TOKEN,
  });

  const loginRedirectURL = new URL(
    "/auth/login",
    process.env.NEXT_PUBLIC_APP_URL,
  );

  loginRedirectURL.searchParams.set(
    "message",
    encodeURIComponent(
      "Your registration request has been accepted \n You can now login with your credentials.",
    ),
  );

  const mailbody: string = await render(
    <AcceptedRegistrerRequest
      loginUrl={loginRedirectURL.toString()}
      username={newUser.name}
      customMessage={customMessage}
    />,
  );

  const mailConfig = await MailBuilder.create()
    .to(newUser.email)
    .from("quesher4@gmail.com")
    .subject("Registraction Request Accepted")
    .build(mailbody);

  await mailer.sendMail(mailConfig);

  return;
}

export async function rejectRegistractionRequest({
  id,
  customMessage,
}: {
  id: string;
  customMessage?: string;
}) {
  const request = await DB.FindRegisterRequest(id);
  if (!request) throw new Error("Request not found");

  await DB.ChangeRegisterRequestState(id, "Rejected");

  const mailer = SMTPGmailService.getInstance({
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_TOKEN,
  });

  const mailbody: string = await render(
    <RejectedRegisterRequest
      username={request.name}
      customMessage={customMessage}
    />,
  );

  const mailConfig = await MailBuilder.create()
    .to(request.email)
    .from("quesher4@gmail.com")
    .subject("Reset Password")
    .build(mailbody);

  await mailer.sendMail(mailConfig);

  return;
}
