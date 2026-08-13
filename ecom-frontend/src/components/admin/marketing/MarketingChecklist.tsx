import { FormCheckbox } from "@/components/admin/ui/AdminForm";

const events = ["PageView", "ViewContent", "Search", "AddToCart", "InitiateCheckout", "AddPaymentInfo", "Purchase", "Lead"];

export function MarketingChecklist() {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {events.map((event, index) => <FormCheckbox key={event} label={event} defaultChecked={index < 5} />)}
    </div>
  );
}
