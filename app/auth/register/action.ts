"use server"

import { DB } from "@/lib/database"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  reason: z.string(),
})

export async function register(
  record: Record<string, unknown>,
): Promise<void> {
  const parsed = schema.safeParse(record)

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0].message,
    )
  }

  const data = parsed.data

  try {
    await DB.NewRequest(data)
  } catch (error) {
    console.log(error)
    throw new Error("Something went wrong")
  }

  return
}
