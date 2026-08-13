"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FiDownload, FiEye } from "react-icons/fi";
import { BackendOrder } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { DataTable } from "@/components/admin/ui/DataTable";
import { Field, FormInput, FormSelect } from "@/components/admin/ui/AdminForm";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";

export function OrdersAdminClient({ orders }: { orders: BackendOrder[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [paymentMethod, setPaymentMethod] = useState("all");

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesQuery = !normalizedQuery || [order.orderNumber, order.customerName, order.customerPhone].some((value) => value.toLowerCase().includes(normalizedQuery));
      const matchesStatus = status === "all" || order.status === status;
      const matchesPayment = paymentMethod === "all" || order.paymentMethod === paymentMethod;
      return matchesQuery && matchesStatus && matchesPayment;
    });
  }, [orders, paymentMethod, query, status]);

  function exportCsv() {
    const rows = [
      ["Order ID", "Customer", "Phone", "Coupon", "Discount", "Total", "Payment", "Delivery", "Order status", "Payment status", "Date"],
      ...filtered.map((order) => [order.orderNumber, order.customerName, order.customerPhone, order.couponCode ?? "", String(order.discountAmount), String(order.total), order.paymentMethod, order.deliveryMethod, order.status, order.paymentStatus, order.createdAt]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "orders.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <PageHeader title="Orders" description="Review customer orders, payment status, delivery method, and fulfillment status." actions={<AdminButton type="button" variant="outline" onClick={exportCsv}><FiDownload aria-hidden="true" /> Export</AdminButton>} />
      <div className="mb-4 grid gap-3 rounded-lg border border-[#E2E8F0] bg-white p-4 md:grid-cols-3">
        <Field label="Search"><FormInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Order ID, customer, phone" /></Field>
        <Field label="Status"><FormSelect value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All statuses</option>{["PENDING", "PROCESSING", "DELIVERED", "CANCELLED"].map((item) => <option key={item} value={item}>{item}</option>)}</FormSelect></Field>
        <Field label="Payment method"><FormSelect value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}><option value="all">All methods</option>{["COD", "BKASH", "NAGAD", "BANK_TRANSFER", "CARD"].map((item) => <option key={item} value={item}>{item}</option>)}</FormSelect></Field>
      </div>
      <DataTable columns={["Order ID", "Customer", "Phone", "Total", "Payment", "Delivery", "Order status", "Payment status", "Date", "Action"]}>
        {filtered.map((order) => (
          <tr key={order.id}>
            <td className="px-4 py-3 font-bold">{order.orderNumber}</td>
            <td className="px-4 py-3">{order.customerName}</td>
            <td className="px-4 py-3">{order.customerPhone}</td>
            <td className="px-4 py-3 price-text">{formatCurrency(order.total)}</td>
            <td className="px-4 py-3">{order.paymentMethod}</td>
            <td className="px-4 py-3">{order.deliveryMethod}</td>
            <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
            <td className="px-4 py-3"><StatusBadge status={order.paymentStatus} /></td>
            <td className="px-4 py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
            <td className="px-4 py-3"><Link className="inline-flex cursor-pointer items-center gap-1 font-semibold text-[#2563EB]" href={`/admin/orders/${order.id}`}><FiEye aria-hidden="true" /> View</Link></td>
          </tr>
        ))}
      </DataTable>
    </>
  );
}
