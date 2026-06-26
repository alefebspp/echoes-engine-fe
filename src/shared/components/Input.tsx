import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { FieldError } from "./FieldError";

const labelClasses =
  "font-mono text-micro font-medium uppercase tracking-[0.14em] text-ink_text-muted";

const controlBase =
  "w-full rounded-sm border bg-surface-0 px-[0.85rem] py-[0.68rem] text-ink_text-bright transition-[border-color,box-shadow] duration-150 ease-ease placeholder:text-ink_text-faint hover:enabled:border-memory focus:border-signal focus:shadow-[0_0_0_3px_var(--signal-cyan-soft)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60";

const controlInvalid =
  "border-danger focus:border-danger focus:shadow-[0_0_0_3px_var(--danger-soft)]";

const controlValid = "border-hairline-strong";

interface FieldShellProps {
  id: string;
  label: ReactNode;
  optional?: boolean;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
}

function FieldShell({ id, label, optional, hint, error, children }: FieldShellProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={labelClasses} htmlFor={id}>
        {label}
        {optional && (
          <span className="text-ink_text-faint normal-case tracking-normal">
            {" "}
            · optional
          </span>
        )}
      </label>
      {children}
      {hint && !error && <p className="text-sm text-ink_text-faint">{hint}</p>}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: ReactNode;
  optional?: boolean;
  hint?: ReactNode;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { id, label, optional, hint, error, className, ...rest },
  ref,
) {
  return (
    <FieldShell id={id} label={label} optional={optional} hint={hint} error={error}>
      <input
        id={id}
        ref={ref}
        className={`${controlBase} ${error ? controlInvalid : controlValid} ${className ?? ""}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
    </FieldShell>
  );
});

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: ReactNode;
  optional?: boolean;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
}

const chevron =
  "appearance-none cursor-pointer bg-no-repeat pr-9 bg-[length:12px] [background-position:right_0.85rem_center] bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%228%22%20viewBox=%220%200%2012%208%22%3E%3Cpath%20fill=%22%239a9bc4%22%20d=%22M1%201l5%205%205-5%22/%3E%3C/svg%3E')]";

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { id, label, optional, hint, error, className, children, ...rest },
  ref,
) {
  return (
    <FieldShell id={id} label={label} optional={optional} hint={hint} error={error}>
      <select
        id={id}
        ref={ref}
        className={`${controlBase} ${chevron} ${error ? controlInvalid : controlValid} ${className ?? ""}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      >
        {children}
      </select>
    </FieldShell>
  );
});
