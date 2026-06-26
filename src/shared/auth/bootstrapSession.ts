import { ApiError } from "@/shared/api/apiErrors";
import { fetchCurrentUser } from "@/features/users/api";
import { authStore } from "./authStore";

/** Ask the API who is signed in via the auth cookie. */
export async function bootstrapSession(): Promise<void> {
  try {
    const me = await fetchCurrentUser();
    authStore.setSession(me);
  } catch (error) {
    if (error instanceof ApiError && error.isUnauthorized) {
      authStore.clear();
      return;
    }
    // Network or server errors during bootstrap — treat as signed out so the user
    // can still reach login/register.
    authStore.clear();
  }
}
