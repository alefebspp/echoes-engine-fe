interface FieldErrorProps {
  id?: string;
  message?: string;
}

/**
 * Announces validation messages politely so screen readers pick them up without
 * stealing focus. Keeps the live region mounted (min height) so layout is stable.
 */
export function FieldError({ id, message }: FieldErrorProps) {
  return (
    <p
      id={id}
      className="flex min-h-[1.1rem] items-center gap-1.5 text-sm text-danger"
      role="alert"
      aria-live="polite"
    >
      {message && (
        <>
          <span
            className="size-[5px] shrink-0 rounded-full bg-danger"
            aria-hidden="true"
          />
          {message}
        </>
      )}
    </p>
  );
}
