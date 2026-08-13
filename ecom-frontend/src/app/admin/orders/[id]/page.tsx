import { notFound } from "next/navigation";
import { getAdminOrder } from "@/lib/api";
import { OrderDetailClient } from "@/components/admin/order/OrderDetailClient";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getAdminOrder(id);
  if (!order) notFound();
  return <OrderDetailClient order={order} />;
}
