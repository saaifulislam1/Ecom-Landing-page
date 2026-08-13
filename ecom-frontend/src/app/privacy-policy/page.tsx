import { PolicyPage } from "@/components/marketing/PolicyPage";

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      sections={[
        "We collect customer information needed to process orders, support requests, and store operations.",
        "Order, customer, catalog, and admin records are stored in the connected backend database.",
        "Payment gateways and external marketing processors should be documented here before production launch.",
      ]}
    />
  );
}
