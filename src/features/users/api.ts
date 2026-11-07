import { httpClient } from "@/shared/api/httpClient";
import type { User } from "./types";

export async function fetchCurrentUser(): Promise<User> {
  return httpClient.get<User>("/users/me");
}

export async function updateUser(
  id: string,
  changes: Partial<Pick<User, "name" | "surname" | "email">> & { password?: string },
): Promise<User> {
  return httpClient.patch<User>(`/users/${id}`, changes);
}

export const userKeys = {
  me: ["users", "me"] as const,
};
