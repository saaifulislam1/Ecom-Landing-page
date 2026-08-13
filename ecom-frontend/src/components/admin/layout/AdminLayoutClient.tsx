"use client";

import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { AdminTopbar } from "@/components/admin/layout/AdminTopbar";
import { AdminBreadcrumbs } from "@/components/admin/layout/AdminBreadcrumbs";
import type { AdminLoginState } from "@/lib/api";
import { canAccessAdminPath, getFirstAdminPath } from "@/lib/adminAccess";

export function AdminLayoutClient({ children, role }: { children: React.ReactNode; role: AdminLoginState }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (role !== "LOGIN_REQUIRED" && role !== "NO_ACCESS" && !canAccessAdminPath(role, pathname)) {
      router.replace(getFirstAdminPath(role));
    }
  }, [pathname, role, router]);

  if (role === "LOGIN_REQUIRED") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <div className="fixed inset-y-0 left-0 z-40 hidden w-72 lg:block">
        <AdminSidebar role={role} />
      </div>
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-slate-950/40" aria-label="Close admin menu" onClick={() => setOpen(false)} />
          <div className="relative h-full w-72">
            <AdminSidebar role={role} onNavigate={() => setOpen(false)} />
            <button className="absolute right-3 top-3 rounded-md bg-white/10 p-2 text-white" onClick={() => setOpen(false)} aria-label="Close admin menu">
              <FiX aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}
      <div className="lg:pl-72">
        <AdminTopbar role={role} onOpenSidebar={() => setOpen(true)} />
        <main className="mx-auto w-full max-w-[1680px] px-4 py-5 sm:px-5 lg:px-8 lg:py-6">
          <AdminBreadcrumbs />
          {role === "NO_ACCESS" ? (
            <section className="rounded-lg border border-[#E2E8F0] bg-white p-8">
              <h1 className="text-xl font-bold">Admin access inactive</h1>
              <p className="mt-2 text-sm text-[#64748B]">Your staff access is inactive for this store. Contact an owner or manager.</p>
            </section>
          ) : children}
        </main>
      </div>
    </div>
  );
}
