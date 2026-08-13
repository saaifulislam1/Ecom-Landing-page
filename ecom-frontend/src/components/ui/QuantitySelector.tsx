"use client";

import { FiMinus, FiPlus } from "react-icons/fi";

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="inline-flex h-11 overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface)]">
      <button
        type="button"
        className="w-11 text-lg hover:bg-[var(--color-background)]"
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label="Decrease quantity"
      >
        <FiMinus className="mx-auto" aria-hidden="true" />
      </button>
      <span className="grid w-12 place-items-center border-x border-[var(--color-border)] text-sm font-semibold">
        {value}
      </span>
      <button
        type="button"
        className="w-11 text-lg hover:bg-[var(--color-background)]"
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label="Increase quantity"
      >
        <FiPlus className="mx-auto" aria-hidden="true" />
      </button>
    </div>
  );
}
