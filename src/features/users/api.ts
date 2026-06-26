import { httpClient } from "@/shared/api/httpClient";
import type { User } from "./types";

export async function fetchCurrentUser(): Promise<User> {
  return httpClient.get<User>("/users/me");
}

export async function fetchUsers(): Promise<User[]> {
  return httpClient.get<User[]>("/users");
}

export async function fetchUser(id: string): Promise<User> {
  return httpClient.get<User>(`/users/${id}`);
}

export async function updateUser(
  id: string,
  changes: Partial<Pick<User, "name" | "surname" | "email">> & { password?: string },
): Promise<User> {
  return httpClient.patch<User>(`/users/${id}`, changes);
}

export async function deleteUser(id: string): Promise<void> {
  await httpClient.delete<void>(`/users/${id}`);
}

export const userKeys = {
  all: ["users"] as const,
  me: ["users", "me"] as const,
  detail: (id: string) => ["users", id] as const,
};
