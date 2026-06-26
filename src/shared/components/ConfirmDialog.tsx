import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { Button } from "./Button";

interface ConfirmDialogProps {
  open: boolean;
  title: ReactNode;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  isWorking?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Confirmation built on the native <dialog>, so focus trapping, Esc-to-close,
 * and the backdrop come for free and behave accessibly.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isWorking = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      ref={ref}
      onCancel={(event) => {
        event.preventDefault();
        if (!isWorking) onCancel();
      }}
      className="panel m-auto w-[min(92vw,420px)] p-6 text-lilac backdrop:bg-[rgba(7,8,20,0.7)] backdrop:backdrop-blur-sm"
      aria-labelledby="confirm-title"
    >
      <h2 id="confirm-title" className="text-h3 font-semibold">
        {title}
      </h2>
      <p className="mt-2 text-sm text-ink_text-muted">{description}</p>
      <div className="mt-6 flex justify-end gap-2.5">
        <Button variant="secondary" onClick={onCancel} disabled={isWorking}>
          {cancelLabel}
        </Button>
        <Button
          variant="danger"
          onClick={onConfirm}
          isLoading={isWorking}
          loadingText="Working…"
        >
          {confirmLabel}
        </Button>
      </div>
    </dialog>
  );
}
