"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/FormControls";
import { Button } from "@/components/ui/Button";
import { BackendOrder, trackPublicOrder } from "@/lib/api";
import { formatCurrency } from "@/lib/format";

const steps = [
  { label: "Order Placed", status: "PENDING" },
  { label: "Confirmed", status: "CONFIRMED" },
  { label: "Processing", status: "PROCESSING" },
  { label: "Shipped", status: "SHIPPED" },
  { label: "Delivered", status: "DELIVERED" },
];

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">Loading tracking form...</div>}>
      <TrackOrderClient />
    </Suspense>
  );
}

function TrackOrderClient() {
  const searchParams = useSearchParams();
  const [identifier, setIdentifier] = useState(searchParams.get("order") ?? "");
  const [order, setOrder] = useState<BackendOrder | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function track() {
    setError("");
    setOrder(null);
    if (!identifier.trim()) {
      setError("Enter an order ID or phone number.");
      return;
    }
    setLoading(true);
    const result = await trackPublicOrder(identifier.trim());
    setLoading(false);
    if (!result) {
      setError("No order found for that order ID or phone number.");
      return;
    }
    setOrder(result);
  }

  const activeIndex = order ? Math.max(0, steps.findIndex((step) => step.status === order.status)) : -1;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black">Track order</h1>
      <div className="mt-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <label className="grid gap-2 text-sm font-semibold">
          Order ID or phone number
          <Input placeholder="ORD-2026-000001 or phone" value={identifier} onChange={(event) => setIdentifier(event.target.value)} />
        </label>
        <Button className="mt-4" onClick={track} disabled={loading}>{loading ? "Tracking..." : "Track"}</Button>
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      </div>
      {order ? (
        <div className="mt-8 space-y-5">
          <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <h2 className="font-bold">Order {order.orderNumber}</h2>
            <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Payment:</strong> {order.paymentStatus}</p>
              <p><strong>Total:</strong> {formatCurrency(order.total)}</p>
              <p><strong>Customer:</strong> {order.customerName}</p>
            </div>
          </section>
        <ol className="mt-8 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          {steps.map((step, index) => (
            <li key={step.status} className="flex gap-4 pb-6 last:pb-0">
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold ${index <= activeIndex ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-background)] text-[var(--color-muted)]"}`}>
                {index + 1}
              </span>
              <div>
                <h2 className="font-bold">{step.label}</h2>
                <p className="text-sm text-[var(--color-muted)]">{index <= activeIndex ? "Completed" : "Pending"}</p>
              </div>
            </li>
          ))}
        </ol>
        </div>
      ) : null}
    </div>
  );
}
