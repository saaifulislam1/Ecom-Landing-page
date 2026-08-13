export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full bg-[var(--color-accent)] px-2.5 py-1 text-xs font-bold text-white shadow-sm">
      {children}
    </span>
  );
}
