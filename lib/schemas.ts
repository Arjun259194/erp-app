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
