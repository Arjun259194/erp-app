"use server";

import { z } from "zod";
import { DB } from "@/lib/database";
import { redirect } from "next/navigation";

const InventorySchema = z.object({
  id: z.string().cuid(),
  maintainStock: z.string().optional(), // checkbox comes as "on" or undefined
});

export async function inventoryAction(fd: FormData) {
  console.log(fd);
  const data = Object.fromEntries(fd);
  console.log(data);
  const parsed = InventorySchema.parse(data);

  await DB.UpdateItemById(parsed.id, {
    maintainStock: parsed.maintainStock === "on",
  });
  redirect(`/item/${parsed.id}`);
}
