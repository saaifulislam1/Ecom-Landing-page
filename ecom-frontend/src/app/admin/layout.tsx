import { AdminLayoutClient } from "@/components/admin/layout/AdminLayoutClient";
import { getAdminAccessRole } from "@/lib/api";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const role = await getAdminAccessRole();
  return <div className="admin-font"><AdminLayoutClient role={role}>{children}</AdminLayoutClient></div>;
}
