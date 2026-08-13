"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminBreadcrumbs() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  return (
    <nav className="mb-4 text-sm text-[#64748B]" aria-label="Admin breadcrumb">
      <ol className="flex flex-wrap gap-2">
        {parts.map((part, index) => {
          const href = `/${parts.slice(0, index + 1).join("/")}`;
          const label = part.replaceAll("-", " ");
          const last = index === parts.length - 1;
          return (
            <li key={href} className="flex items-center gap-2 capitalize">
              {index > 0 ? <span>/</span> : null}
              {last ? <span className="text-[#0F172A]">{label}</span> : <Link href={href}>{label}</Link>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
