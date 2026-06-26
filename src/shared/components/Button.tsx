import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  isLoading?: boolean;
  loadingText?: string;
  block?: boolean;
  children: ReactNode;
}

const base =
  "relative inline-flex items-center justify-center gap-2 rounded-sm font-display text-sm font-semibold leading-none whitespace-nowrap transition-[transform,background-color,border-color,color] duration-150 ease-ease disabled:cursor-not-allowed disabled:opacity-55 enabled:hover:-translate-y-px enabled:active:translate-y-0 border";

const variants: Record<Variant, string> = {
  primary:
    "px-[1.1rem] py-[0.62rem] border-transparent bg-memory text-ink enabled:hover:bg-[#95b8ff]",
  secondary:
    "px-[1.1rem] py-[0.62rem] border-hairline-strong bg-transparent text-lilac enabled:hover:bg-surface-2 enabled:hover:border-memory",
  ghost:
    "px-[0.6rem] py-[0.62rem] border-transparent bg-transparent text-ink_text-muted enabled:hover:text-lilac",
  danger:
    "px-[1.1rem] py-[0.62rem] border-[var(--danger-soft)] bg-transparent text-danger enabled:hover:bg-[var(--danger-soft)]",
};

export function Button({
  variant = "primary",
  isLoading = false,
  loadingText,
  block = false,
  disabled,
  children,
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  const classes = [base, variants[variant], block ? "w-full" : "", className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...rest}
    >
      {isLoading && (
        <span
          className="size-[0.95em] animate-spin rounded-full border-2 border-current border-r-transparent"
          aria-hidden="true"
        />
      )}
      <span className={isLoading ? "opacity-85" : undefined}>
        {isLoading && loadingText ? loadingText : children}
      </span>
    </button>
  );
}
