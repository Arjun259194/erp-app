"use server";

import { ItemData } from "@/hook/useItemTable";
import { DB } from "@/lib/database";
import { ServerAction } from "@/types";
import { z } from "zod";

const schema = z.object({
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  unit: z.string().min(1, "Unit is required"),
  price: z.number().min(0, "Price must be a positive number"),
  status: z.enum(["active", "inactive", "template"]).default("active"),
  itemGroupId: z.string().optional(),
});

export default async function createItem(record: Record<string, unknown>) {
  const parsed = schema.safeParse(record);
  if (!parsed.success) {
    console.error(parsed.error);
    throw new Error(parsed.error.issues[0].message);
  }

  const data = parsed.data;
  console.log(data)

  try {
    await DB.NewItem(data);
  } catch (error) {
    console.error("Error creating item:", error);
    throw new Error("Failed to create item. Please try again later.");
  }

  return;
}

export const getallitems: ServerAction<ItemData[], void> = async () =>
  await DB.GetAllItems();
