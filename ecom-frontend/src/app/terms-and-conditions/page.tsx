import { PolicyPage } from "@/components/marketing/PolicyPage";
import { getPublicStoreSettings } from "@/lib/api";

export default async function TermsAndConditionsPage() {
  const settings = await getPublicStoreSettings();

  return (
    <PolicyPage
      title="Terms and Conditions"
      sections={(settings?.termsAndConditions ? [settings.termsAndConditions] : [
        "This storefront reads catalog, checkout, and store policy data from the connected backend.",
        "Prices, stock status, promotions, delivery charges, and order statuses are managed by the store owner.",
        "Customers should review product details, delivery terms, and refund rules before placing an order.",
      ])}
    />
  );
}
