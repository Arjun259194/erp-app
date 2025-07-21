"use server";

import { z } from "zod";
import { DB } from "@/lib/database";

const InventorySchema = z.object({
  id: z.string().cuid(),
  maintainStock: z.string().optional(), // checkbox comes as "on" or undefined
});

export async function inventoryAction(fd: FormData) {
  const data = Object.fromEntries(fd);
  const parsed = InventorySchema.parse(data);

  await DB.UpdateItemById(parsed.id, {
    maintainStock: parsed.maintainStock === "on",
  });
}
