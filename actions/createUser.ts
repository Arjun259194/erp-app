"use server"

import { UserRole } from "@/generated/prisma"
import { DB } from "@/lib/database"
import { z } from "zod"

const role = [
  "Admin",
  "User",
  "Accountant",
  "Sales",
  "Purchase",
  "HR",
  "Manufacturing",
  "ProjectManager",
  "Support",
] satisfies [UserRole, ...UserRole[]]

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(role),
  state: z.enum(role),
})

export default async function createUser(formdata: FormData) {
  const rawData = {
    email: formdata.get("email"),
    password: formdata.get("password"),
    role: formdata.get("role"),
    state: formdata.get("state"),
  }

  const result = schema.safeParse(rawData)

  if (!result.success) throw new Error("not valid data")

  const { ...cred } = result.data

  await DB.CreateUser({
    email: cred.email,
    password: cred.password,
    role: cred.role,
    status: cred.state
  })
}
