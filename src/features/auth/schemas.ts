import { z } from "zod";

// Messages are i18n keys, resolved at render time by `useFieldError`.

export const loginSchema = z.object({
  email: z.string().min(1, "validation.emailRequired").email("validation.emailInvalid"),
  password: z.string().min(1, "validation.passwordRequired"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "validation.firstNameRequired")
    .max(100, "validation.firstNameMax"),
  surname: z
    .string()
    .trim()
    .min(1, "validation.surnameRequired")
    .max(100, "validation.surnameMax"),
  email: z.string().min(1, "validation.emailRequired").email("validation.emailInvalid"),
  password: z
    .string()
    .min(8, "validation.passwordMin")
    .max(72, "validation.passwordMax"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
