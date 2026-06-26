/**
 * In-memory session state. The JWT lives in an HttpOnly cookie set by the API —
 * this store only tracks whether the current user is known to the front-end.
 */
export type SessionStatus = "pending" | "authenticated" | "anonymous";

export interface SessionUser {
  id: string;
  name?: string;
  surname?: string;
  email?: string;
}

type Listener = () => void;

let status: SessionStatus = "pending";
let user: SessionUser | null = null;
const listeners = new Set<Listener>();

function emit(): void {
  for (const listener of listeners) listener();
}

export const authStore = {
  getStatus(): SessionStatus {
    return status;
  },

  isBootstrapping(): boolean {
    return status === "pending";
  },

  isAuthenticated(): boolean {
    return status === "authenticated";
  },

  getUser(): SessionUser | null {
    return user;
  },

  getUserId(): string | null {
    return user?.id ?? null;
  },

  setSession(next: SessionUser): void {
    status = "authenticated";
    user = next;
    emit();
  },

  clear(): void {
    status = "anonymous";
    user = null;
    emit();
  },

  /** Reset to pending before re-checking the cookie session (e.g. on full reload). */
  markPending(): void {
    status = "pending";
    user = null;
    emit();
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
