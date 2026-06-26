import { z } from "zod";

/**
 * Profile updates map to PATCH /users/:id. Password is optional and only sent
 * when provided. `superRefine` enforces "at least one changed field" against the
 * current values, since an empty PATCH is meaningless to the backend.
 */
export const profileSchema = z.object({
  name: z.string().trim().min(1, "Enter a name.").max(100, "Max 100 characters."),
  surname: z.string().trim().min(1, "Enter a surname.").max(100, "Max 100 characters."),
  email: z.string().min(1, "Enter an email.").email("Use a valid email address."),
  password: z
    .union([
      z.string().min(8, "Password must be at least 8 characters.").max(72, "Max 72 characters."),
      z.literal(""),
    ])
    .optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;

export interface ProfileSnapshot {
  name: string;
  surname: string;
  email: string;
}

/** Returns only the fields that actually changed (plus password when set). */
export function diffProfile(
  values: ProfileInput,
  original: ProfileSnapshot,
): Partial<Record<keyof ProfileInput, string>> {
  const changes: Partial<Record<keyof ProfileInput, string>> = {};
  if (values.name.trim() !== original.name) changes.name = values.name.trim();
  if (values.surname.trim() !== original.surname) changes.surname = values.surname.trim();
  if (values.email.trim() !== original.email) changes.email = values.email.trim();
  if (values.password && values.password.length > 0) changes.password = values.password;
  return changes;
}
