import { FiPlus } from "react-icons/fi";
import { getAdminStaff } from "@/lib/api";
import { AdminButtonLink } from "@/components/admin/ui/AdminButton";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { StaffAdminClient } from "@/components/admin/staff/StaffAdminClient";

export default async function AdminStaffPage() {
  const staff = await getAdminStaff();
  return (
    <>
      <PageHeader title="Staff and roles" description="Create staff accounts and manage role/status access." actions={<AdminButtonLink href="#add-staff"><FiPlus /> Add staff</AdminButtonLink>} />
      <StaffAdminClient staff={staff} />
    </>
  );
}
