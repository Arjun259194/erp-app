"use server";

import { z } from "zod";
import { DB } from "@/lib/database";

const MetaSchema = z.object({
  id: z.string().cuid(),
  isDisabled: z.string().optional(),
});

export async function metaAction(fd: FormData) {
  const data = Object.fromEntries(fd);
  const parsed = MetaSchema.parse(data);

  await DB.UpdateItemById(parsed.id, {
    isDisabled: parsed.isDisabled === "on",
  });
}
