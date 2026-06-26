import { useSyncExternalStore } from "react";
import { logout } from "@/features/auth/api";
import { authStore } from "./authStore";
import type { SessionUser } from "./authStore";

/** React binding over the session store. Re-renders when auth state changes. */
export function useAuth() {
  const status = useSyncExternalStore(
    authStore.subscribe,
    authStore.getStatus,
    () => "pending" as const,
  );

  const user = useSyncExternalStore(
    authStore.subscribe,
    authStore.getUser,
    () => null,
  );

  return {
    status,
    user,
    isBootstrapping: status === "pending",
    isAuthenticated: status === "authenticated",
    userId: user?.id ?? null,
    signIn: (session: SessionUser) => authStore.setSession(session),
    signOut: async () => {
      try {
        await logout();
      } finally {
        authStore.clear();
      }
    },
  };
}
