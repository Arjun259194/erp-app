"use server";

import { UserRole, UserStatus } from "@/generated/prisma";
import { DB } from "@/lib/database";
import BcryptPasswordHasher from "@/lib/hash";
import { z } from "zod";

const userRoles = [
  "Admin",
  "User",
  "Accountant",
  "Sales",
  "Purchase",
  "HR",
  "Manufacturing",
  "ProjectManager",
  "Support",
] satisfies [UserRole, ...UserRole[]];

const CreateSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(userRoles),
});

const UpdateSchema = z.object({
  id: z.string().cuid(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(userRoles).optional(),
  status: z
    .enum(["Active", "Inactive", "Suspended", "Pending"] satisfies [
      UserStatus,
      ...UserStatus[],
    ])
    .optional(),
});

export async function createUser(formdata: FormData) {
  const rawData = {
    name: formdata.get("name"),
    email: formdata.get("email"),
    password: formdata.get("password"),
    role: formdata.get("role"),
  };

  const result = CreateSchema.safeParse(rawData);
  if (!result.success) {
    console.log("failed to parse");
    console.log("rawData:", Object.fromEntries(formdata.entries()));
    throw new Error("not valid data");
  }

  const { ...cred } = result.data;

  try {
    await DB.CreateUser({
      email: cred.email,
      name: cred.name,
      password: cred.password,
      role: cred.role,
    });
  } catch (err) {
    console.error(err);
    throw new Error("Something went wrong");
  }
  return;
}

export async function updateUser(formdata: FormData) {
  const rawData = {
    id: formdata.get("id"),
    name: formdata.get("name"),
    email: formdata.get("email"),
    password: formdata.get("password"),
    role: formdata.get("role"),
    status: formdata.get("status"),
  } as Record<string, string | null | undefined>;

  if (rawData.password === null || rawData.password === "") {
    rawData.password = undefined;
  }

  console.log("rawData:", Object.fromEntries(formdata.entries()));

  const result = UpdateSchema.safeParse(rawData);
  if (!result.success) {
    console.log("failed to parse: ", result.error.message);
    console.log("rawData:", Object.fromEntries(formdata.entries()));
    throw new Error(result.error.issues[0].message);
  }

  const { id, password, ...cred } = result.data;

  const safePassword = password
    ? await BcryptPasswordHasher.getInstance().hash(password)
    : undefined;

  try {
    console.log("cred:", cred);
    await DB.UpdateUserById(id, {
      ...cred,
      password: safePassword,
    });
  } catch (err) {
    console.error(err);
    throw new Error("Something went wrong");
  }
  return;
}

export async function deleteUser(formadat: FormData) {
  const id = formadat.get("id");
  if (typeof id !== "string" || !id) throw new Error("Invalid user ID");

  try {
    await DB.DeleteUserById(id);
  } catch (err) {
    console.error(err);
    throw new Error("Something went wrong");
  }
  return;
}

export async function fetchUsers() {
  return await DB.FetchAllUsers();
}
