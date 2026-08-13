"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiBell, FiLogOut, FiMenu, FiSearch, FiUser } from "react-icons/fi";
import { FormInput, FormSelect } from "@/components/admin/ui/AdminForm";
import { ADMIN_TOKEN_COOKIE } from "@/lib/api";
import type { AdminLoginState } from "@/lib/api";

export function AdminTopbar({ role, onOpenSidebar }: { role: Exclude<AdminLoginState, "LOGIN_REQUIRED">; onOpenSidebar: () => void }) {
  const router = useRouter();

  function search(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    const query = event.currentTarget.value.trim();
    if (query) router.push(`/admin/products?search=${encodeURIComponent(query)}`);
  }

  function logout() {
    document.cookie = `${ADMIN_TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 border-b border-[#E2E8F0] bg-white">
      <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
        <button className="rounded-md border border-[#E2E8F0] p-2 lg:hidden" onClick={onOpenSidebar} aria-label="Open admin menu">
          <FiMenu aria-hidden="true" />
        </button>
        <div className="hidden w-48 md:block">
          <FormSelect aria-label="Store switcher" defaultValue="main">
            <option value="main">Main Store</option>
            <option value="demo">Demo Store</option>
          </FormSelect>
        </div>
        <div className="relative max-w-xl flex-1">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" aria-hidden="true" />
          <FormInput placeholder="Search products" className="pl-9" onKeyDown={search} />
        </div>
        <Link href="/admin/orders" className="grid h-10 w-10 place-items-center rounded-md border border-[#E2E8F0] text-[#64748B]" aria-label="Notifications">
          <FiBell aria-hidden="true" />
        </Link>
        <Link href="/admin/settings" className="hidden items-center gap-2 rounded-md border border-[#E2E8F0] px-3 py-2 text-sm font-semibold md:inline-flex">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-[#2563EB] text-xs text-white"><FiUser aria-hidden="true" /></span>
          {formatRole(role)}
        </Link>
        <button type="button" onClick={logout} className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-[#E2E8F0] px-3 text-sm font-semibold text-[#64748B] hover:border-red-200 hover:bg-red-50 hover:text-red-700">
          <FiLogOut aria-hidden="true" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}

function formatRole(role: Exclude<AdminLoginState, "LOGIN_REQUIRED">) {
  if (role === "NO_ACCESS") return "Inactive";
  return role.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}
