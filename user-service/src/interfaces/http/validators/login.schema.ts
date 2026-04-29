import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .trim()
    .email("Invalid email address")
    .toLowerCase(),
  password: z
    .string({ message: "Password is required" })
    .min(1, "Password is required"),
});
