import type { ReactNode } from "react";

export interface NavItem {
  to: string;
  /** Key under `nav.*` holding the label and description. */
  key: "dashboard" | "ask" | "activity" | "profile";
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
    key: "dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" {...stroke}>
        <path d="M2 11c2-4 4-6 7-6s5 2 7 6" />
        <circle cx="9" cy="11" r="1.4" fill="currentColor" stroke="none" />
        <path d="M9 11l3-2.5" />
      </svg>
    ),
  },
  {
    to: "/app/ask",
    key: "ask",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" {...stroke}>
        <path d="M4 2.5v13" />
        <path d="M7 5.5h7" />
        <path d="M7 9h5.5" />
        <path d="M7 12.5h3.5" />
      </svg>
    ),
  },
  {
    to: "/app/activity",
    key: "activity",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" {...stroke}>
        <path d="M2 9h3l2-5 2 11 2-7 1.5 3H16" />
      </svg>
    ),
  },
  {
    to: "/app/profile",
    key: "profile",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" {...stroke}>
        <circle cx="9" cy="6" r="3" />
        <path d="M3.5 15c1-3 3.5-4 5.5-4s4.5 1 5.5 4" />
      </svg>
    ),
  },
];
