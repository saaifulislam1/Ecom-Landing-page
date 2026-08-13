"use client";

import { ColorSwatch } from "@/components/admin/ui/ColorSwatch";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { ThemePreset } from "@/types";

export function ThemeCard({ theme, bestFor, selected, onApply }: { theme: ThemePreset; bestFor: string; selected?: boolean; onApply?: () => void }) {
  return (
    <div className="rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold">{theme.name}</h3>
          <p className="mt-1 text-sm text-[#64748B]">Best for: {bestFor}</p>
        </div>
        {selected ? <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">Selected</span> : null}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {[theme.primary, theme.secondary, theme.accent, theme.background, theme.text, theme.border].map((color) => <ColorSwatch key={color} color={color} />)}
      </div>
      <div className="mt-5 flex gap-2">
        <AdminButton type="button" onClick={onApply}>Apply</AdminButton>
      </div>
    </div>
  );
}
