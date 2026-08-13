"use client";

import { useState } from "react";
import { FiCopy } from "react-icons/fi";
import { AdminButton } from "@/components/admin/ui/AdminButton";

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <AdminButton
      type="button"
      variant="outline"
      onClick={() => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      }}
    >
      <FiCopy aria-hidden="true" /> {copied ? "Copied" : label}
    </AdminButton>
  );
}
