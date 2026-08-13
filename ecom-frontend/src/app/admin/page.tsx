import { FiCheckCircle, FiClock, FiDollarSign, FiPackage, FiShoppingCart, FiXCircle } from "react-icons/fi";
import { getAdminAnalytics, getAdminOrders, getAdminProducts } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { AdminButtonLink } from "@/components/admin/ui/AdminButton";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { StatCard } from "@/components/admin/ui/StatCard";
import { ChartPlaceholder } from "@/components/admin/ui/ChartPlaceholder";
import { RecentOrdersTable } from "@/components/admin/dashboard/RecentOrdersTable";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";

export default async function AdminDashboardPage() {
  const [analytics, orders, products] = await Promise.all([getAdminAnalytics(), getAdminOrders(), getAdminProducts()]);
  const lowStock = products.filter((product) => product.stock < 20).slice(0, 5);
  const topSelling = products.filter((product) => product.bestSeller).slice(0, 5);
  const delivered = orders.filter((order) => order.status === "DELIVERED").length;
  const pending = orders.filter((order) => order.status === "PENDING").length;
  const cancelled = orders.filter((order) => order.status === "CANCELLED").length;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Store performance, order health, inventory alerts, and quick actions."
        actions={<>
          <AdminButtonLink href="/admin/products/new">Add product</AdminButtonLink>
          <AdminButtonLink href="/admin/orders" variant="outline">View orders</AdminButtonLink>
          <AdminButtonLink href="/admin/appearance" variant="outline">Customize theme</AdminButtonLink>
          <AdminButtonLink href="/admin/marketing" variant="secondary">Setup Pixel</AdminButtonLink>
        </>}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        <StatCard label="Total revenue" value={formatCurrency(analytics.revenue)} icon={<FiDollarSign />} hint="Calculated from seeded orders" />
        <StatCard label="Total orders" value={String(analytics.orders)} icon={<FiShoppingCart />} />
        <StatCard label="Pending orders" value={String(pending)} icon={<FiClock />} />
        <StatCard label="Delivered orders" value={String(delivered)} icon={<FiCheckCircle />} />
        <StatCard label="Cancelled orders" value={String(cancelled)} icon={<FiXCircle />} />
        <StatCard label="Conversion rate" value={`${analytics.conversionRate}%`} icon={<FiPackage />} hint="Backend fallback metric" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <ChartPlaceholder />
        <section className="rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <h2 className="font-bold">Order status summary</h2>
          <div className="mt-4 space-y-3">
            {["Pending", "Processing", "Delivered", "Cancelled"].map((status) => (
              <div key={status} className="flex items-center justify-between text-sm">
                <StatusBadge status={status} />
                <span>{orders.filter((order) => order.status === status.toUpperCase()).length} orders</span>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section>
          <h2 className="mb-3 text-lg font-bold">Recent orders</h2>
          <RecentOrdersTable orders={orders} />
        </section>
        <div className="grid gap-6">
          <section className="rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <h2 className="font-bold">Top-selling products</h2>
            <div className="mt-4 space-y-3">{topSelling.map((product) => <Row key={product.id} title={product.title} value={formatCurrency(Number(product.salePrice ?? product.price))} />)}</div>
          </section>
          <section className="rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <h2 className="font-bold">Low-stock products</h2>
            <div className="mt-4 space-y-3">{lowStock.map((product) => <Row key={product.id} title={product.title} value={`${product.stock} left`} />)}</div>
          </section>
        </div>
      </div>
    </>
  );
}

function Row({ title, value }: { title: string; value: string }) {
  return <div className="flex justify-between gap-3 text-sm"><span className="font-medium">{title}</span><span className="text-[#64748B]">{value}</span></div>;
}
