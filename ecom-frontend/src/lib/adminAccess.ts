import type { AdminLoginState } from "@/lib/api";

const ownerRoutes = [
  "/admin",
  "/admin/products",
  "/admin/categories",
  "/admin/homepage",
  "/admin/orders",
  "/admin/customers",
  "/admin/coupons",
  "/admin/marketing",
  "/admin/appearance",
  "/admin/settings",
  "/admin/staff",
  "/admin/onboarding",
];

const roleRoutes: Record<Exclude<AdminLoginState, "LOGIN_REQUIRED" | "NO_ACCESS">, string[]> = {
  OWNER: ownerRoutes,
  MANAGER: ownerRoutes,
  MARKETING_OFFICER: ownerRoutes.filter((route) => route !== "/admin/staff"),
  DIGITAL_MARKETER: ["/admin/products", "/admin/marketing"],
};

export function getFirstAdminPath(role: AdminLoginState) {
  if (role === "LOGIN_REQUIRED" || role === "NO_ACCESS") return "/admin/login";
  return roleRoutes[role][0] ?? "/admin";
}

export function canAccessAdminPath(role: AdminLoginState, pathname: string) {
  if (role === "LOGIN_REQUIRED") return pathname === "/admin/login";
  if (role === "NO_ACCESS") return true;

  const allowedRoutes = roleRoutes[role];
  return allowedRoutes.some((route) => pathname === route || (route !== "/admin" && pathname.startsWith(`${route}/`)));
}
