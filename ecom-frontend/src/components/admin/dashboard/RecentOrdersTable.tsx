import Link from "next/link";
import { BackendOrder } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { DataTable } from "@/components/admin/ui/DataTable";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";

export function RecentOrdersTable({ orders }: { orders: BackendOrder[] }) {
  return (
    <DataTable columns={["Order", "Customer", "Total", "Payment", "Status", "Date", "Action"]}>
      {orders.slice(0, 5).map((order) => (
        <tr key={order.id}>
          <td className="px-4 py-3 font-bold">{order.orderNumber}</td>
          <td className="px-4 py-3">{order.customerName}</td>
          <td className="px-4 py-3 price-text">{formatCurrency(order.total)}</td>
          <td className="px-4 py-3"><StatusBadge status={order.paymentStatus} /></td>
          <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
          <td className="px-4 py-3 text-[#64748B]">{new Date(order.createdAt).toLocaleDateString()}</td>
          <td className="px-4 py-3"><Link className="font-semibold text-[#2563EB]" href={`/admin/orders/${order.id}`}>View</Link></td>
        </tr>
      ))}
    </DataTable>
  );
}
