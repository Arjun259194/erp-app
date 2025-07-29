"use server";

import { JWToken } from "@/lib/auth";
import { DB } from "@/lib/database";
import BcryptPasswordHasher from "@/lib/hash";
import { ServerAction } from "@/types";
import { z } from "zod";

export const resetPassword: ServerAction = async form => {
  const safe = z.string().min(6).safeParse(form.get("password"));
  if (!safe.success) throw new Error(safe.error.issues[0].message);

  const password = safe.data;

  const token = form.get("token");
  if (typeof token !== "string") throw new Error("No valid token");

  const jwtoken = JWToken.getInstance();
  const payload = jwtoken.deserialize(token);
  if (!payload) throw new Error("Not valid token, try again");

  const user = await DB.FindUserById(payload.data.id);
  if (!user) throw new Error("404 - User not found");

  const hasher = BcryptPasswordHasher.getInstance();
  const passHash = await hasher.hash(password);

  const request = await DB.FindLatestForgotPasswordRequest(user.id);
  if (!request) throw new Error("Request expired or not valid");

  try {
    await DB.UpdateUserById(user.id, {
      password: passHash,
    });

    await DB.ClearAllPastForgotPasswordRequest(request.id, user.id);

    return;
  } catch (err) {
    console.error(err);
    throw new Error("Error while updating password, try again later");
  }
};
