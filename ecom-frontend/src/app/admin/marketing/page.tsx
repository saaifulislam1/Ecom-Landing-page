import { getAdminMarketingSettings, getAdminOrders, getAdminProducts } from "@/lib/api";
import { MarketingAdminClient } from "@/components/admin/marketing/MarketingAdminClient";
import { PageHeader } from "@/components/admin/ui/PageHeader";

export default async function AdminMarketingPage() {
  const [adminProducts, orders, marketingSettings] = await Promise.all([getAdminProducts(), getAdminOrders(), getAdminMarketingSettings()]);
  return (
    <>
      <PageHeader title="Marketing Center" description="Meta settings, product feed, campaign links, and social channels." />
      <MarketingAdminClient products={adminProducts} orders={orders} settings={marketingSettings} />
    </>
  );
}
