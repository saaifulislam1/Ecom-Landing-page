import { OnboardingSetupForm } from "@/components/admin/onboarding/OnboardingSetupForm";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { getAdminMarketingSettings, getAdminStore, getAdminStoreSettings, getAdminTheme } from "@/lib/api";

export default async function AdminOnboardingPage() {
  const [store, settings, theme, marketing] = await Promise.all([getAdminStore(), getAdminStoreSettings(), getAdminTheme(), getAdminMarketingSettings()]);

  return (
    <>
      <PageHeader title="Setup wizard" description="Complete the store setup checklist and save real storefront settings." />
      <OnboardingSetupForm initialStore={store} initialSettings={settings} initialTheme={theme} initialMarketing={marketing} />
    </>
  );
}
