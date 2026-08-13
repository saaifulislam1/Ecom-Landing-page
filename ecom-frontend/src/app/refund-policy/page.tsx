import { PolicyPage } from "@/components/marketing/PolicyPage";

export default function RefundPolicyPage() {
  return (
    <PolicyPage
      title="Refund Policy"
      sections={[
        "Eligible products may be returned within 7 days in unused condition with original packaging.",
        "Digital products and opened personal care items may be marked as non-refundable based on each store policy.",
        "Refund approval, courier handling, and payment reversal should be reviewed by the store operations team before money is returned.",
      ]}
    />
  );
}
