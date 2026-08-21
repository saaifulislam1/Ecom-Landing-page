import { PolicyPage } from "@/components/marketing/PolicyPage";
import { getPublicStoreSettings } from "@/lib/api";

export default async function PrivacyPolicyPage() {
  const settings = await getPublicStoreSettings();

  return (
    <PolicyPage
      title="Privacy Policy"
      sections={(settings?.privacyPolicy ? [settings.privacyPolicy] : [
        "We collect customer information needed to process orders, support requests, and store operations.",
        "Order, customer, catalog, and admin records are stored in the connected backend database.",
        "Payment gateways and external marketing processors should be documented here before production launch.",
      ])}
    />
  );
}
