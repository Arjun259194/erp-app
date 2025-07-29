"use server";

import { z } from "zod";
import { DB } from "@/lib/database";
import { redirect } from "next/navigation";

const SalesSchema = z.object({
  id: z.string().cuid(),
  allowAlternativeItem: z.string().optional(),
  overDeliveryAllowance: z
    .string()
    .transform(v => parseFloat(v || "0"))
    .refine(n => !isNaN(n) && n >= 0 && n <= 100, {
      message: "Over delivery allowance must be between 0-100%",
    }),
  overBillingAllowance: z
    .string()
    .transform(v => parseFloat(v || "0"))
    .refine(n => !isNaN(n) && n >= 0 && n <= 100, {
      message: "Over billing allowance must be between 0-100%",
    }),
});

export async function salesAction(fd: FormData) {
  const data = Object.fromEntries(fd);
  console.log(fd);
  console.log(data);
  const parsed = SalesSchema.parse(data);

  try {
    await DB.UpdateItemById(parsed.id, {
      allowAlternativeItem: parsed.allowAlternativeItem === "on",
      overDeliveryAllowance: parsed.overDeliveryAllowance,
      overBillingAllowance: parsed.overBillingAllowance,
    });
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }

  redirect(`/item/${parsed.id}`);
}
