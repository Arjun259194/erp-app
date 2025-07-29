import z from "zod";

export const loginSchema = z.object({
  email: z
    .string({ message: "Email is not valid" })
    .email({ message: "Must be a valid email address" }),
  password: z
    .string({ message: "Password is not valid" })
    .min(6, { message: "Password must be atleast 6 characters" })
    .max(16, { message: "password must be under 16 characters" }),
});

// Your `ItemState` enum has these values in the Prisma schema
export const itemStatusOptions = ["Active", "InActive", "OutOfStock", "PreOrder"] as const;

export type ItemState = (typeof itemStatusOptions)[number];

// Utility Zod parser to handle checkbox values
const checkboxToBool = z.union([z.literal("on"), z.undefined()]).transform(val => val === "on");

// ✅ Zod schema for your Item form (server action compatible)
export const ItemFormSchema = z.object({
  id: z.string().min(3).max(100),
  sku: z.string().min(1, { message: "SKU is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  itemGroupId: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  unit: z.string().min(1, { message: "Unit is required" }),

  price: z.coerce.number().nonnegative({ message: "Price must be ≥ 0" }),
  overDeliveryAllowance: z.coerce.number().default(0),
  overBillingAllowance: z.coerce.number().default(0),
  taxCode: z.string().optional().nullable(),

  isDisabled: checkboxToBool.optional(),
  allowAlternativeItem: checkboxToBool.optional(),
  maintainStock: checkboxToBool.optional(),
  hasVariants: checkboxToBool.optional(),
  isFixedAsset: checkboxToBool.optional(),
  isZeroRated: checkboxToBool.optional(),
  isExempt: checkboxToBool.optional(),

  status: z.enum(itemStatusOptions, {
    required_error: "Status is required",
  }),
});

export type ItemFormInput = z.infer<typeof ItemFormSchema>;
