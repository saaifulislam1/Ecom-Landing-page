import { getAdminOrders } from "@/lib/api";
import { OrdersAdminClient } from "@/components/admin/order/OrdersAdminClient";

export default async function AdminOrdersPage() {
  const adminOrders = await getAdminOrders();
  return <OrdersAdminClient orders={adminOrders} />;
}
