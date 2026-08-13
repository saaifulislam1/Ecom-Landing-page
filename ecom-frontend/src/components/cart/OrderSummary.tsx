"use client";

import { Button, ButtonLink } from "@/components/ui/Button";
import { Input } from "@/components/ui/FormControls";
import { validatePublicCoupon } from "@/lib/api";
import type { AppliedCoupon } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { useEffect, useRef, useState } from "react";
import { FiCreditCard, FiTag, FiX } from "react-icons/fi";

export function OrderSummary({
  subtotal,
  deliveryCharge,
  appliedCoupon,
  onCouponApplied,
  onCouponRemoved,
  ctaHref,
  ctaLabel,
  showCouponForm = true,
}: {
  subtotal: number;
  deliveryCharge?: number;
  appliedCoupon?: AppliedCoupon | null;
  onCouponApplied?: (coupon: AppliedCoupon) => void;
  onCouponRemoved?: () => void;
  ctaHref?: string;
  ctaLabel?: string;
  showCouponForm?: boolean;
}) {
  const [code, setCode] = useState(appliedCoupon?.code ?? "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const lastValidatedKey = useRef("");
  const delivery = deliveryCharge ?? (subtotal > 0 ? 80 : 0);
  const discount = appliedCoupon?.discountAmount ?? 0;
  const total = subtotal + delivery - discount;

  useEffect(() => {
    if (!appliedCoupon || subtotal <= 0) {
      return;
    }

    const validationKey = `${appliedCoupon.code}:${subtotal}:${delivery}`;
    if (lastValidatedKey.current === validationKey) {
      return;
    }
    lastValidatedKey.current = validationKey;

    let cancelled = false;
    validatePublicCoupon(appliedCoupon.code, subtotal, delivery)
      .then((coupon) => {
        if (!cancelled) {
          onCouponApplied?.(coupon);
        }
      })
      .catch(() => {
        if (!cancelled) {
          onCouponRemoved?.();
          setError("Coupon was removed because it no longer applies.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [appliedCoupon, delivery, onCouponApplied, onCouponRemoved, subtotal]);

  async function applyCoupon(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    const trimmedCode = code.trim();
    if (!trimmedCode) {
      setError("Enter a coupon code.");
      return;
    }
    if (subtotal <= 0) {
      setError("Add products before applying a coupon.");
      return;
    }

    try {
      setSubmitting(true);
      const coupon = await validatePublicCoupon(trimmedCode, subtotal, delivery);
      onCouponApplied?.(coupon);
      setCode(coupon.code);
      setMessage(`${coupon.code} applied.`);
    } catch (error) {
      onCouponRemoved?.();
      setError(error instanceof Error ? error.message : "Coupon could not be applied.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <aside className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm">
      <h2 className="inline-flex items-center gap-2 text-lg font-bold"><FiCreditCard aria-hidden="true" /> Order summary</h2>
      {showCouponForm ? (
        <div className="mt-5 border-b border-[var(--color-border)] pb-5">
          {appliedCoupon ? (
            <div className="flex items-center justify-between gap-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm">
              <span><strong>{appliedCoupon.code}</strong> saved {formatCurrency(discount)}</span>
              <button
                type="button"
                className="inline-flex cursor-pointer items-center gap-1 font-semibold text-emerald-800"
                onClick={() => {
                  setCode("");
                  setMessage("");
                  setError("");
                  onCouponRemoved?.();
                }}
              >
                <FiX aria-hidden="true" /> Remove
              </button>
            </div>
          ) : (
            <form onSubmit={applyCoupon} className="grid gap-2">
              <label className="text-sm font-semibold" htmlFor="coupon-code">Coupon code</label>
              <div className="flex gap-2">
                <Input id="coupon-code" value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} placeholder="SAVE10" />
                <Button type="submit" variant="outline" disabled={submitting}><FiTag aria-hidden="true" />{submitting ? "Checking" : "Apply"}</Button>
              </div>
            </form>
          )}
          {message ? <p className="mt-2 text-xs font-semibold text-emerald-700">{message}</p> : null}
          {error ? <p className="mt-2 text-xs font-semibold text-red-600">{error}</p> : null}
        </div>
      ) : null}
      <div className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
        <div className="flex justify-between"><span>Delivery charge</span><span>{formatCurrency(delivery)}</span></div>
        <div className="flex justify-between"><span>Discount{appliedCoupon ? ` (${appliedCoupon.code})` : ""}</span><span>-{formatCurrency(discount)}</span></div>
        <div className="border-t border-[var(--color-border)] pt-3 text-base font-bold flex justify-between">
          <span>Total</span><span>{formatCurrency(total)}</span>
        </div>
      </div>
      {ctaHref && ctaLabel ? <ButtonLink className="mt-5 w-full" href={ctaHref}>{ctaLabel}</ButtonLink> : null}
    </aside>
  );
}
