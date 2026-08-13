"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiLogOut, FiPackage } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { BackendOrder, getCustomerOrders } from "@/lib/api";
import { formatCurrency } from "@/lib/format";

export default function AccountPage() {
  const router = useRouter();
  const { customer, token, loading, logout } = useCustomerAuth();
  const [orders, setOrders] = useState<BackendOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!customer || !token) {
      router.push("/login");
      return;
    }
    getCustomerOrders(token)
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [customer, loading, router, token]);

  if (loading || !customer) {
    return <main className="mx-auto max-w-7xl px-4 py-12 text-sm text-[var(--color-muted)]">Loading account...</main>;
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">My account</h1>
          <p className="mt-2 text-sm text-[var(--color-muted)]">{customer.email}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            logout();
            router.push("/");
          }}
        >
          <FiLogOut aria-hidden="true" /> Sign out
        </Button>
      </div>

      <section className="mt-8 grid gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 md:grid-cols-2 lg:grid-cols-4">
        <Info label="Name" value={customer.name} />
        <Info label="Phone" value={customer.phone} />
        <Info label="City" value={customer.city ?? "Not set"} />
        <Info label="Total spent" value={formatCurrency(Number(customer.totalSpent))} />
      </section>

      <section className="mt-8 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <div className="flex items-center gap-2">
          <FiPackage aria-hidden="true" />
          <h2 className="text-xl font-black">Order history</h2>
        </div>
        {ordersLoading ? <p className="mt-4 text-sm text-[var(--color-muted)]">Loading orders...</p> : null}
        {!ordersLoading && !orders.length ? <p className="mt-4 text-sm text-[var(--color-muted)]">No signed-in orders yet. Guest orders can still be tracked from the track order page.</p> : null}
        {orders.length ? (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="border-b border-[var(--color-border)] text-[var(--color-muted)]">
                <tr>
                  <th className="py-3 pr-4">Order</th>
                  <th className="py-3 pr-4">Date</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Total</th>
                  <th className="py-3 pr-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-[var(--color-border)] last:border-0">
                    <td className="py-3 pr-4 font-bold">{order.orderNumber}</td>
                    <td className="py-3 pr-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 pr-4">{order.status}</td>
                    <td className="py-3 pr-4 price-text">{formatCurrency(order.total)}</td>
                    <td className="py-3 pr-4"><Link className="font-semibold text-[var(--color-secondary)]" href={`/order-success?order=${encodeURIComponent(order.orderNumber)}&phone=${encodeURIComponent(order.customerPhone)}`}>View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase text-[var(--color-muted)]">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
