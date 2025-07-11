"use server";

import { DB } from "@/lib/database";
import z from "zod";

const schema = z.object({
  public_registration: z
    .string()
    .transform((val) => val === "true")
    .optional(),
});

export async function updateSettings(obj: Record<string, unknown>) {
  const result = await schema.safeParseAsync(obj);

  if (!result.success) {
    console.log(result.error.message);
    throw new Error(result.error.issues[0].message);
  }

  const updateData = result.data;

  return await DB.UpdateSettings(updateData);
}
