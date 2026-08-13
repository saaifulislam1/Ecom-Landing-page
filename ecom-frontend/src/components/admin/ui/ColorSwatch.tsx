export function ColorSwatch({ color, label }: { color: string; label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs text-[#64748B]">
      <span className="h-5 w-5 rounded-full border border-[#E2E8F0]" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
