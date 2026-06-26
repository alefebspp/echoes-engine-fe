import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Wordmark } from "@/shared/components/Wordmark";
import { ApiStatus } from "@/shared/components/ApiStatus";
import { useAuth } from "@/shared/auth/useAuth";
import { navItems } from "./navItems";

function navLinkClasses(isActive: boolean): string {
  return [
    "group flex items-center gap-3 rounded-sm px-3 py-2.5 transition-colors duration-150",
    isActive
      ? "bg-surface-2 text-ink_text-bright"
      : "text-ink_text-muted hover:bg-surface-1 hover:text-lilac",
  ].join(" ");
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1" aria-label="Primary">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) => navLinkClasses(isActive)}
        >
          {({ isActive }) => (
            <>
              <span
                className={isActive ? "text-signal" : "text-ink_text-faint group-hover:text-memory"}
                aria-hidden="true"
              >
                {item.icon}
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-medium leading-tight">{item.label}</span>
                <span className="text-micro leading-tight text-ink_text-faint">
                  {item.description}
                </span>
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

function SignOutButton({ onSignOut }: { onSignOut: () => void }) {
  return (
    <button
      type="button"
      onClick={onSignOut}
      className="flex w-full items-center gap-2.5 rounded-sm px-3 py-2.5 text-sm text-ink_text-muted transition-colors hover:bg-surface-1 hover:text-lilac"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M7 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h3" />
        <path d="M11 12l3-3-3-3" />
        <path d="M14 9H7" />
      </svg>
      Sign out
    </button>
  );
}

export function AppShell() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-shell">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[var(--sidebar-w)] shrink-0 flex-col border-r border-hairline px-4 py-5 lg:flex">
        <NavLink to="/app/dashboard" className="px-1.5" aria-label="Echoes Engine">
          <Wordmark />
        </NavLink>
        <div className="mt-8 flex-1">
          <NavList />
        </div>
        <div className="border-t border-hairline pt-3">
          <SignOutButton onSignOut={handleSignOut} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-hairline bg-[rgba(18,21,42,0.82)] px-5 py-3 backdrop-blur-md lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden"
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((open) => !open)}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                <path d="M4 7h14M4 11h14M4 15h14" />
              </svg>
            </button>
            <span className="lg:hidden">
              <Wordmark markOnly />
            </span>
          </div>
          <ApiStatus />
        </header>

        {/* Mobile nav panel */}
        {mobileOpen && (
          <div className="border-b border-hairline bg-surface-0 px-4 py-3 lg:hidden">
            <NavList onNavigate={() => setMobileOpen(false)} />
            <div className="mt-2 border-t border-hairline pt-2">
              <SignOutButton onSignOut={handleSignOut} />
            </div>
          </div>
        )}

        <main
          key={location.pathname.startsWith("/app/users/") ? "user-detail" : location.pathname}
          className="flex-1 animate-fade-up px-5 py-6 lg:px-8 lg:py-8"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
