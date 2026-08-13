export function StatCard({ label, value, icon, hint }: { label: string; value: string; icon?: React.ReactNode; hint?: string }) {
  return (
    <div className="min-w-0 rounded-lg border border-[#E2E8F0] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="break-words text-sm font-semibold leading-5 text-[#64748B]">{label}</p>
          <p className="mt-2 break-words text-2xl font-black leading-tight text-[#0F172A]">{value}</p>
        </div>
        {icon ? <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-[#2563EB]">{icon}</div> : null}
      </div>
      {hint ? <p className="mt-3 text-xs text-[#64748B]">{hint}</p> : null}
    </div>
  );
}
