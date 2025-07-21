"use server";

import { z } from "zod";
import { DB } from "@/lib/database";

const BasicSchema = z.object({
  id: z.string().cuid(),
  sku: z.string().trim().min(1, "SKU is required"),
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().optional().or(z.literal("")),
  unit: z.string().trim().min(1, "Unit is required"),
  itemGroupId: z.string().cuid().optional().or(z.literal("")),
});

export async function basicAction(fd: FormData) {
  const data = Object.fromEntries(fd);
  const parsed = BasicSchema.parse(data);

  await DB.UpdateItemById(parsed.id, {
    sku: parsed.sku,
    name: parsed.name,
    description: parsed.description || undefined,
    unit: parsed.unit,
    itemGroupId: parsed.itemGroupId || undefined,
  });
}
