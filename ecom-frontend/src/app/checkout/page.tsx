"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiCheckCircle } from "react-icons/fi";
import { Input, Select, Textarea } from "@/components/ui/FormControls";
import { Button } from "@/components/ui/Button";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { useCart } from "@/context/CartContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { BackendStoreSettings, createPublicOrder, getPublicStoreSettings, PublicOrderPayload, validatePublicCoupon } from "@/lib/api";
import { createEventId, trackInitiateCheckout, trackPurchase } from "@/lib/metaPixel";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart, appliedCoupon, setAppliedCoupon, removeCoupon } = useCart();
  const { customer, token } = useCustomerAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<PublicOrderPayload["deliveryMethod"]>("INSIDE_CITY");
  const [storeSettings, setStoreSettings] = useState<BackendStoreSettings | null>(null);
  const deliveryCharge = calculateDeliveryCharge(deliveryMethod, subtotal, storeSettings);

  useEffect(() => {
    let mounted = true;
    getPublicStoreSettings().then((settings) => {
      if (mounted) setStoreSettings(settings);
    });
    return () => {
      mounted = false;
    };
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setApiError("");
    const form = new FormData(event.currentTarget);
    const nextErrors: Record<string, string> = {};
    ["fullName", "phone", "address", "city"].forEach((field) => {
      if (!String(form.get(field) ?? "").trim()) nextErrors[field] = "Required";
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    if (!items.length) return;

    let discountAmount = 0;
    let couponCode: string | undefined;

    try {
      setSubmitting(true);
      if (appliedCoupon) {
        const validatedCoupon = await validatePublicCoupon(appliedCoupon.code, subtotal, deliveryCharge);
        setAppliedCoupon(validatedCoupon);
        discountAmount = validatedCoupon.discountAmount;
        couponCode = validatedCoupon.code;
      }
      const total = subtotal + deliveryCharge - discountAmount;
      const phone = String(form.get("phone"));
      const initiateCheckoutEventId = createEventId("checkout");
      const purchaseEventId = createEventId("purchase");
      trackInitiateCheckout({
        content_ids: items.map((item) => item.product.id),
        num_items: items.reduce((sum, item) => sum + item.quantity, 0),
        value: subtotal,
        currency: "BDT",
      }, initiateCheckoutEventId);
      const payload: PublicOrderPayload = {
        customerName: String(form.get("fullName")),
        customerPhone: phone,
        customerEmail: String(form.get("email") || "") || undefined,
        deliveryAddress: String(form.get("address")),
        city: String(form.get("city")),
        notes: String(form.get("notes") || "") || undefined,
        subtotal,
        deliveryCharge,
        couponCode,
        discountAmount,
        total,
        paymentMethod: mapPaymentMethod(String(form.get("payment"))),
        deliveryMethod,
        metaEventId: purchaseEventId,
        items: items.map((item) => {
          const price = item.product.salePrice ?? item.product.price;
          return {
            productId: item.product.id,
            productTitle: item.product.title,
            productImage: item.product.images[0],
            price,
            quantity: item.quantity,
            total: price * item.quantity,
            variant: item.selectedVariants,
          };
        }),
      };
      const order = await createPublicOrder(payload, token);
      trackPurchase({
        content_ids: items.map((item) => item.product.id),
        num_items: items.reduce((sum, item) => sum + item.quantity, 0),
        value: total,
        currency: "BDT",
      }, purchaseEventId);
      clearCart();
      router.push(`/order-success?order=${encodeURIComponent(order.orderNumber)}&phone=${encodeURIComponent(phone)}`);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Could not place order");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black">Checkout</h1>
      <div className="mt-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm text-[var(--color-muted)]">
        {customer ? (
          <p>Ordering as <strong className="text-[var(--color-text)]">{customer.name}</strong>. You can edit the delivery details below for this order.</p>
        ) : (
          <p>You can place this order as a guest, or sign in to save it to your account.</p>
        )}
      </div>
      <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <section className="space-y-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Full name" error={errors.fullName} required><Input name="fullName" defaultValue={customer?.name ?? ""} required /></Field>
            <Field label="Phone number" error={errors.phone} required><Input name="phone" defaultValue={customer?.phone ?? ""} required /></Field>
            <Field label="Email optional"><Input name="email" type="email" defaultValue={customer?.email ?? ""} /></Field>
            <Field label="Area / city" error={errors.city} required><Input name="city" defaultValue={customer?.city ?? ""} required /></Field>
          </div>
          <Field label="Delivery address" error={errors.address} required><Textarea name="address" defaultValue={customer?.address ?? ""} required /></Field>
          <Field label="Order notes"><Textarea name="notes" placeholder="Optional delivery instructions" /></Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Payment method" required>
              <Select name="payment" required>
                <option>Cash on Delivery</option>
                <option>bKash</option>
                <option>Nagad</option>
                <option>Bank Transfer</option>
              </Select>
            </Field>
            <Field label="Delivery method" required>
              <Select name="delivery" value={deliveryMethod} onChange={(event) => setDeliveryMethod(event.target.value as PublicOrderPayload["deliveryMethod"])} required>
                <option value="INSIDE_CITY">Inside city</option>
                <option value="OUTSIDE_CITY">Outside city</option>
              </Select>
            </Field>
          </div>
          <Button type="submit" disabled={!items.length || submitting}><FiCheckCircle aria-hidden="true" /> {submitting ? "Placing order..." : "Place order"}</Button>
          {!items.length ? <p className="text-sm text-red-600">Your cart is empty. Add products before placing an order.</p> : null}
          {apiError ? <p className="text-sm text-red-600">{apiError}</p> : null}
        </section>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <OrderSummary
            subtotal={subtotal}
            deliveryCharge={deliveryCharge}
            appliedCoupon={appliedCoupon}
            onCouponApplied={setAppliedCoupon}
            onCouponRemoved={removeCoupon}
          />
        </div>
      </form>
    </div>
  );
}

function calculateDeliveryCharge(deliveryMethod: PublicOrderPayload["deliveryMethod"], subtotal: number, settings: BackendStoreSettings | null) {
  if (!subtotal) return 0;
  if (settings?.freeDeliveryMinAmount && subtotal >= Number(settings.freeDeliveryMinAmount)) return 0;
  return deliveryMethod === "INSIDE_CITY"
    ? Number(settings?.insideCityDeliveryCharge ?? 0)
    : Number(settings?.outsideCityDeliveryCharge ?? 0);
}

function mapPaymentMethod(value: string): PublicOrderPayload["paymentMethod"] {
  if (value === "bKash") return "BKASH";
  if (value === "Nagad") return "NAGAD";
  if (value === "Bank Transfer") return "BANK_TRANSFER";
  return "COD";
}

function Field({ label, error, required = false, children }: { label: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      <span>{label}{required ? <span className="ml-1 text-red-600" aria-label="required">*</span> : null}</span>
      {children}
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
