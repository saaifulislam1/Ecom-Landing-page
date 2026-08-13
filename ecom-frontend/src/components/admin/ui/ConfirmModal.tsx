"use client";

import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { AdminButton } from "@/components/admin/ui/AdminButton";

export function ConfirmModal({
  label = "Delete",
  title = "Confirm action",
  description = "This action cannot be undone.",
  confirmLabel = "Confirm",
  onConfirm,
}: {
  label?: string;
  title?: string;
  description?: string;
  confirmLabel?: string;
  onConfirm?: () => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function confirm() {
    setSubmitting(true);
    setError("");
    try {
      await onConfirm?.();
      setOpen(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not complete the action.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button type="button" className="inline-flex cursor-pointer items-center gap-1 text-sm font-semibold text-red-600" onClick={() => setOpen(true)}>
        <FiTrash2 aria-hidden="true" /> {label}
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl">
            <h2 className="text-lg font-bold">{title}</h2>
            <p className="mt-2 text-sm text-[#64748B]">{description}</p>
            {error ? <p className="mt-3 text-sm font-semibold text-red-600">{error}</p> : null}
            <div className="mt-5 flex justify-end gap-2">
              <AdminButton type="button" variant="outline" onClick={() => setOpen(false)} disabled={submitting}>Cancel</AdminButton>
              <AdminButton type="button" variant="danger" onClick={confirm} disabled={submitting}>{submitting ? "Deleting..." : confirmLabel}</AdminButton>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
