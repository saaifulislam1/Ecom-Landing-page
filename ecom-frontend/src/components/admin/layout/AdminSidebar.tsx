"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiBarChart2,
  FiGrid,
  FiHome,
  FiLayers,
  FiPackage,
  FiPercent,
  FiRadio,
  FiSettings,
  FiShoppingCart,
  FiUsers,
} from "react-icons/fi";
import { cx } from "@/lib/format";
import type { AdminLoginState } from "@/lib/api";

const items = [
  { href: "/admin", label: "Dashboard", icon: FiHome, roles: ["OWNER", "MANAGER", "MARKETING_OFFICER"] },
  { href: "/admin/products", label: "Products", icon: FiPackage, roles: ["OWNER", "MANAGER", "MARKETING_OFFICER", "DIGITAL_MARKETER"] },
  { href: "/admin/categories", label: "Categories", icon: FiGrid, roles: ["OWNER", "MANAGER", "MARKETING_OFFICER"] },
  { href: "/admin/homepage", label: "Homepage", icon: FiLayers, roles: ["OWNER", "MANAGER", "MARKETING_OFFICER"] },
  { href: "/admin/orders", label: "Orders", icon: FiShoppingCart, roles: ["OWNER", "MANAGER", "MARKETING_OFFICER"] },
  { href: "/admin/customers", label: "Customers", icon: FiUsers, roles: ["OWNER", "MANAGER", "MARKETING_OFFICER"] },
  { href: "/admin/coupons", label: "Coupons", icon: FiPercent, roles: ["OWNER", "MANAGER", "MARKETING_OFFICER"] },
  { href: "/admin/marketing", label: "Marketing", icon: FiRadio, roles: ["OWNER", "MANAGER", "MARKETING_OFFICER", "DIGITAL_MARKETER"] },
  { href: "/admin/appearance", label: "Appearance", icon: FiLayers, roles: ["OWNER", "MANAGER", "MARKETING_OFFICER"] },
  { href: "/admin/settings", label: "Settings", icon: FiSettings, roles: ["OWNER", "MANAGER", "MARKETING_OFFICER"] },
  { href: "/admin/staff", label: "Staff", icon: FiUsers, roles: ["OWNER", "MANAGER"] },
  { href: "/admin/onboarding", label: "Onboarding", icon: FiBarChart2, roles: ["OWNER", "MANAGER", "MARKETING_OFFICER"] },
];

export function AdminSidebar({ role, onNavigate }: { role: Exclude<AdminLoginState, "LOGIN_REQUIRED">; onNavigate?: () => void }) {
  const pathname = usePathname();
  const visibleItems = role === "NO_ACCESS" ? [] : items.filter((item) => item.roles.includes(role));
  return (
    <aside className="flex h-full flex-col bg-[#0F172A] text-white">
      <div className="border-b border-white/10 p-5">
        <Link href="/admin" className="text-xl font-black">PlugCommerce</Link>
        <p className="mt-1 text-xs text-slate-400">Store admin</p>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {visibleItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cx(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition",
                active ? "bg-[#2563EB] text-white" : "text-slate-300 hover:bg-white/10 hover:text-white",
              )}
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
