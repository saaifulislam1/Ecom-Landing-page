import { notFound } from "next/navigation";
import { getAdminCustomer } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { CustomerDetailActions } from "@/components/admin/customer/CustomerDetailActions";
import { DataTable } from "@/components/admin/ui/DataTable";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";

export default async function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await getAdminCustomer(id);
  if (!customer) notFound();
  const orders = customer.orders ?? [];
  const lastOrder = orders[0]?.createdAt ? new Date(orders[0].createdAt).toLocaleDateString() : "No orders";
  return (
    <>
      <PageHeader title={customer.name} description="Customer profile, notes, tags, contact details, and order history." />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard label="Total spent" value={formatCurrency(customer.totalSpent)} />
            <StatCard label="Total orders" value={String(customer.totalOrders)} />
            <StatCard label="Last order" value={lastOrder} />
          </div>
          <section className="rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-bold">Order history</h2>
            <DataTable columns={["Order", "Date", "Total", "Status"]}>
              {orders.map((order) => (
                <tr key={order.id}><td className="px-4 py-3 font-bold">{order.orderNumber}</td><td className="px-4 py-3">{new Date(order.createdAt).toLocaleDateString()}</td><td className="px-4 py-3">{formatCurrency(order.total)}</td><td className="px-4 py-3"><StatusBadge status={order.status} /></td></tr>
              ))}
            </DataTable>
          </section>
        </section>
        <aside className="space-y-6">
          <section className="rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-bold">Contact details</h2>
            <p className="text-sm">{customer.phone}</p>
            <p className="mt-2 text-sm">{customer.email}</p>
            <p className="mt-2 text-sm text-[#64748B]">{customer.address ?? customer.city ?? "No address"}</p>
            <div className="mt-4"><StatusBadge status={customer.tags[0] ?? "New"} /></div>
          </section>
          <CustomerDetailActions customer={customer} />
        </aside>
      </div>
    </>
  );
}
