import { useEffect } from "react";
import type { ReactNode } from "react";
import { bootstrapSession } from "./bootstrapSession";

/** On first load, ask the API who is signed in via the auth cookie. */
export function SessionBootstrap({ children }: { children: ReactNode }) {
  useEffect(() => {
    void bootstrapSession();
  }, []);

  return <>{children}</>;
}
