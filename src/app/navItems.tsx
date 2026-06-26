import type { ReactNode } from "react";

export interface NavItem {
  to: string;
  label: string;
  description: string;
  icon: ReactNode;
  end?: boolean;
}

/** Minimal line icons drawn to match the observatory line-weight. */
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const navItems: NavItem[] = [
  {
    to: "/app/dashboard",
    label: "Dashboard",
    description: "Overview of recent signals",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" {...stroke}>
        <path d="M2 11c2-4 4-6 7-6s5 2 7 6" />
        <circle cx="9" cy="11" r="1.4" fill="currentColor" stroke="none" />
        <path d="M9 11l3-2.5" />
      </svg>
    ),
  },
  {
    to: "/app/activity",
    label: "Activity",
    description: "Rhythm and domains",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" {...stroke}>
        <path d="M2 9h3l2-5 2 11 2-7 1.5 3H16" />
      </svg>
    ),
  },
  {
    to: "/app/events/test",
    label: "Send test event",
    description: "Developer utility",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" {...stroke}>
        <path d="M3 9h9" />
        <path d="M9 5l4 4-4 4" />
        <path d="M15 3v12" />
      </svg>
    ),
  },
  {
    to: "/app/profile",
    label: "Profile",
    description: "Your account",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" {...stroke}>
        <circle cx="9" cy="6" r="3" />
        <path d="M3.5 15c1-3 3.5-4 5.5-4s4.5 1 5.5 4" />
      </svg>
    ),
  },
  {
    to: "/app/users",
    label: "Users",
    description: "Internal management",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" {...stroke}>
        <circle cx="6.5" cy="6.5" r="2.6" />
        <path d="M2 15c.8-2.5 2.6-3.6 4.5-3.6S10 12.5 10.8 15" />
        <path d="M12 4.2a2.6 2.6 0 0 1 0 4.8" />
        <path d="M12.5 11.6c1.7.2 3 1.3 3.5 3.4" />
      </svg>
    ),
  },
];
