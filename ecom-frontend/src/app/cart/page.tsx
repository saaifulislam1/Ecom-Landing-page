"use client";

import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { useCart } from "@/context/CartContext";
import { BackendStoreSettings, getPublicStoreSettings } from "@/lib/api";

export default function CartPage() {
  const { items, subtotal, appliedCoupon, setAppliedCoupon, removeCoupon } = useCart();
  const [storeSettings, setStoreSettings] = useState<BackendStoreSettings | null>(null);
  const freeDeliveryMinAmount = Number(storeSettings?.freeDeliveryMinAmount ?? 0);
  const deliveryCharge = subtotal > 0 && (!freeDeliveryMinAmount || subtotal < freeDeliveryMinAmount)
    ? Number(storeSettings?.insideCityDeliveryCharge ?? 0)
    : 0;

  useEffect(() => {
    let mounted = true;
    getPublicStoreSettings().then((settings) => {
      if (mounted) setStoreSettings(settings);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black">Cart</h1>
      {items.length ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            {items.map((item) => <CartItemRow key={item.product.id} item={item} />)}
            <ButtonLink href="/products" variant="outline" className="mt-5">Continue shopping</ButtonLink>
          </section>
          <OrderSummary subtotal={subtotal} deliveryCharge={deliveryCharge} appliedCoupon={appliedCoupon} onCouponApplied={setAppliedCoupon} onCouponRemoved={removeCoupon} ctaHref="/checkout" ctaLabel="Proceed to checkout" />
        </div>
      ) : (
        <div className="mt-8 rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center">
          <h2 className="text-xl font-bold">Your cart is empty</h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">Add products to preview cart totals and checkout flow.</p>
          <ButtonLink href="/products" className="mt-5">Continue shopping</ButtonLink>
        </div>
      )}
    </div>
  );
}
