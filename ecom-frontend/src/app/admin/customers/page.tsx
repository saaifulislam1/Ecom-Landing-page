import { getAdminCustomers } from "@/lib/api";
import { CustomersAdminClient } from "@/components/admin/customer/CustomersAdminClient";

export default async function AdminCustomersPage() {
  const adminCustomers = await getAdminCustomers();
  return <CustomersAdminClient customers={adminCustomers} />;
}
