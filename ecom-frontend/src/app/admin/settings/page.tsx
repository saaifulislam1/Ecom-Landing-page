import { getAdminStore, getAdminStoreSettings } from "@/lib/api";
import { SettingsForm } from "@/components/admin/settings/SettingsForm";
import { PageHeader } from "@/components/admin/ui/PageHeader";

export default async function AdminSettingsPage() {
  const [store, settings] = await Promise.all([getAdminStore(), getAdminStoreSettings()]);
  return (
    <>
      <PageHeader title="Store settings" description="Store identity, checkout, delivery, policies, and homepage SEO settings." />
      <SettingsForm store={store} settings={settings} />
    </>
  );
}
