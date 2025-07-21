"use server";

import { z } from "zod";
import { DB } from "@/lib/database";

const ManufacturingSchema = z.object({
  id: z.string().cuid(),
  hasVariants: z.string().optional(),
  isFixedAsset: z.string().optional(),
});

export async function mfgAction(fd: FormData) {
  const data = Object.fromEntries(fd);
  const parsed = ManufacturingSchema.parse(data);

  await DB.UpdateItemById(parsed.id, {
    hasVariants: parsed.hasVariants === "on",
    isFixedAsset: parsed.isFixedAsset === "on",
  });
}
