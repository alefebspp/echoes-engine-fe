import { httpClient } from "@/shared/api/httpClient";
import type { LoginInput, RegisterInput } from "./schemas";
import type { User } from "@/features/users/types";

interface LoginResponse {
  token?: string;
}

/** Authenticate — the API sets the `access_token` HttpOnly cookie. */
export async function login(input: LoginInput): Promise<void> {
  await httpClient.post<LoginResponse>("/auth/login", input, { anonymous: true });
}

export async function register(input: RegisterInput): Promise<User> {
  return httpClient.post<User>("/users", input, { anonymous: true });
}

/** Clear the auth cookie on the server. */
export async function logout(): Promise<void> {
  await httpClient.post<{ ok: boolean }>("/auth/logout", undefined, { anonymous: true });
}
