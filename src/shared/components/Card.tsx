import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
  children: ReactNode;
}

export function Card({ padded = false, className, children, ...rest }: CardProps) {
  const classes = [
    "panel flex flex-col",
    padded ? "px-[1.35rem] py-5" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  /** Renders the title as the given heading level for correct document outline. */
  as?: "h2" | "h3";
}

export function CardHeader({ title, subtitle, action, as = "h3" }: CardHeaderProps) {
  const Heading = as;
  return (
    <div className="flex items-start justify-between gap-4 px-[1.35rem] pb-[0.9rem] pt-[1.1rem]">
      <div className="flex flex-col gap-1">
        <Heading className="text-h3 font-semibold">{title}</Heading>
        {subtitle && <p className="text-sm text-ink_text-muted">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function CardBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`px-[1.35rem] pb-[1.3rem] pt-[0.4rem] ${className ?? ""}`}>
      {children}
    </div>
  );
}

export function CardDivider() {
  return <div className="mx-[1.35rem] h-px bg-hairline" role="presentation" />;
}
