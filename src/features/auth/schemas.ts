import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Enter your email.").email("Use a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter your first name.")
    .max(100, "Keep your name under 100 characters."),
  surname: z
    .string()
    .trim()
    .min(1, "Enter your surname.")
    .max(100, "Keep your surname under 100 characters."),
  email: z.string().min(1, "Enter your email.").email("Use a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(72, "Password must be 72 characters or fewer."),
});

export type RegisterInput = z.infer<typeof registerSchema>;
