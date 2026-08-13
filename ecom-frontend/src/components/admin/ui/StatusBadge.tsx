import { cx } from "@/lib/format";

const toneMap: Record<string, string> = {
  Published: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Delivered: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Draft: "bg-slate-100 text-slate-700 ring-slate-200",
  Hidden: "bg-slate-100 text-slate-700 ring-slate-200",
  Pending: "bg-amber-50 text-amber-700 ring-amber-200",
  Processing: "bg-blue-50 text-blue-700 ring-blue-200",
  Confirmed: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  Shipped: "bg-cyan-50 text-cyan-700 ring-cyan-200",
  Cancelled: "bg-red-50 text-red-700 ring-red-200",
  Returned: "bg-red-50 text-red-700 ring-red-200",
  Unpaid: "bg-amber-50 text-amber-700 ring-amber-200",
  Refunded: "bg-purple-50 text-purple-700 ring-purple-200",
  Inactive: "bg-slate-100 text-slate-700 ring-slate-200",
  VIP: "bg-yellow-50 text-yellow-700 ring-yellow-200",
  Repeat: "bg-blue-50 text-blue-700 ring-blue-200",
  New: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Risky: "bg-red-50 text-red-700 ring-red-200",
};

export function StatusBadge({ status }: { status: string }) {
  return <span className={cx("inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1", toneMap[status] ?? toneMap.Draft)}>{status}</span>;
}
