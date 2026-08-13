"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiPhone, FiPrinter, FiSave } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { BackendOrder, updateAdminOrder, updateAdminOrderStatus, updateAdminPaymentStatus } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { Field, FormSelect, FormTextarea } from "@/components/admin/ui/AdminForm";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { OrderStatusTimeline } from "@/components/admin/dashboard/OrderStatusTimeline";

type OrderStatus = "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNED";
type PaymentStatus = "UNPAID" | "PAID" | "REFUNDED";

export function OrderDetailClient({ order }: { order: BackendOrder }) {
  const router = useRouter();
  const [orderStatus, setOrderStatus] = useState<OrderStatus>(order.status as OrderStatus);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(order.paymentStatus as PaymentStatus);
  const [note, setNote] = useState(order.notes ?? "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const phoneHref = `tel:${order.customerPhone}`;
  const whatsappHref = `https://wa.me/${order.customerPhone.replace(/[^\d]/g, "")}`;
  const emailHref = order.customerEmail ? `mailto:${order.customerEmail}?subject=${encodeURIComponent(`Order ${order.orderNumber}`)}` : undefined;

  async function saveStatus() {
    setMessage("");
    setError("");
    setSubmitting(true);
    try {
      await Promise.all([
        orderStatus !== order.status ? updateAdminOrderStatus(order.id, orderStatus) : Promise.resolve(),
        paymentStatus !== order.paymentStatus ? updateAdminPaymentStatus(order.id, paymentStatus) : Promise.resolve(),
        note !== (order.notes ?? "") ? updateAdminOrder(order.id, { notes: note || undefined }) : Promise.resolve(),
      ]);
      setMessage("Order saved successfully.");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not update order status.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHeader title={`Order ${order.orderNumber}`} description="Order detail and status controls populated from the backend database." actions={<AdminButton type="button" variant="outline" onClick={() => window.print()}><FiPrinter aria-hidden="true" /> Print invoice</AdminButton>} />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <Panel title="Order summary">
            <div className="grid gap-3 md:grid-cols-3">
              <Info label="Total" value={formatCurrency(order.total)} />
              <Info label="Coupon" value={order.couponCode ? `${order.couponCode} (${formatCurrency(order.discountAmount)})` : "None"} />
              <Info label="Order status" value={<StatusBadge status={orderStatus} />} />
              <Info label="Payment status" value={<StatusBadge status={paymentStatus} />} />
            </div>
          </Panel>
          <Panel title="Ordered products">
            <div className="space-y-3">{(order.orderItems ?? []).map((item) => <div key={item.id} className="flex items-center justify-between gap-4 border-b border-[#E2E8F0] pb-3 last:border-0"><span className="font-semibold">{item.productTitle} x {item.quantity}</span><span>{formatCurrency(item.total)}</span></div>)}</div>
          </Panel>
          <Panel title="Customer information">
            <div className="grid gap-3 md:grid-cols-2">
              <Info label="Name" value={order.customerName} />
              <Info label="Phone" value={order.customerPhone} />
              <Info label="Email" value={order.customerEmail ?? "Not provided"} />
              <Info label="Address" value={order.deliveryAddress} />
              <Info label="Payment method" value={order.paymentMethod} />
              <Info label="Delivery method" value={order.deliveryMethod} />
              <Info label="Discount" value={formatCurrency(order.discountAmount)} />
            </div>
            <p className="mt-4 text-sm text-[#64748B]">Order notes: {order.notes || "No notes"}</p>
          </Panel>
        </section>
        <aside className="space-y-6">
          <Panel title="Update status">
            <Field label="Order status">
              <FormSelect value={orderStatus} onChange={(event) => setOrderStatus(event.target.value as OrderStatus)}>
                {["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"].map((item) => <option key={item} value={item}>{item}</option>)}
              </FormSelect>
            </Field>
            <Field label="Payment status">
              <FormSelect value={paymentStatus} onChange={(event) => setPaymentStatus(event.target.value as PaymentStatus)}>
                {["UNPAID", "PAID", "REFUNDED"].map((item) => <option key={item} value={item}>{item}</option>)}
              </FormSelect>
            </Field>
            <AdminButton type="button" onClick={saveStatus} disabled={submitting}><FiSave aria-hidden="true" />{submitting ? "Saving..." : "Save status"}</AdminButton>
            {message ? <p className="text-sm font-semibold text-emerald-700">{message}</p> : null}
            {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}
          </Panel>
          <Panel title="Contact customer">
            <div className="grid gap-2">
              <AdminButton type="button" variant="outline" onClick={() => window.location.href = phoneHref}><FiPhone aria-hidden="true" /> Call</AdminButton>
              <AdminButton type="button" variant="outline" onClick={() => window.open(whatsappHref, "_blank", "noopener,noreferrer")}><FaWhatsapp aria-hidden="true" /> WhatsApp</AdminButton>
              <AdminButton type="button" variant="outline" disabled={!emailHref} onClick={() => { if (emailHref) window.location.href = emailHref; }}><FiMail aria-hidden="true" /> Email</AdminButton>
            </div>
          </Panel>
          <Panel title="Timeline"><OrderStatusTimeline current={orderStatus} /></Panel>
          <Panel title="Internal note"><FormTextarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Write internal note" /></Panel>
        </aside>
      </div>
    </>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-sm"><h2 className="mb-4 font-bold">{title}</h2>{children}</section>;
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return <div><p className="text-xs font-bold uppercase text-[#64748B]">{label}</p><div className="mt-1 text-sm font-semibold">{value}</div></div>;
}
