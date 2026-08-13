export function ChartPlaceholder({ title = "Revenue chart" }: { title?: string }) {
  return (
    <div className="rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <h2 className="font-bold text-[#0F172A]">{title}</h2>
      <div className="mt-6 flex h-64 items-end gap-3 rounded-md bg-[#F8FAFC] p-4">
        {[38, 56, 42, 72, 64, 88, 76, 94, 69, 82, 96, 78].map((height, index) => (
          <div key={index} className="flex-1 rounded-t bg-[#2563EB]" style={{ height: `${height}%`, opacity: 0.45 + index / 28 }} />
        ))}
      </div>
    </div>
  );
}
