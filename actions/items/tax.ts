"use server"

import { z } from "zod"
import { DB } from "@/lib/database"
import { redirect } from "next/navigation"

const TaxSchema = z.object({
  id: z.string().cuid(),
  isZeroRated: z.string().optional(),
  isExempt: z.string().optional(),
  taxCode: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
})

export async function taxAction(fd: FormData) {
  const data = Object.fromEntries(fd)
  const parsed = TaxSchema.parse(data)

  await DB.UpdateItemById(parsed.id, {
    isZeroRated: parsed.isZeroRated === "on",
    isExempt: parsed.isExempt === "on",
    taxCode: parsed.taxCode || undefined,
  })

  redirect(`/item/${parsed.id}`)
}
