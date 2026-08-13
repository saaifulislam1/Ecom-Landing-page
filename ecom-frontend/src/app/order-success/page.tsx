import { ButtonLink } from "@/components/ui/Button";
import { getPublicOrder } from "@/lib/api";
import { formatCurrency } from "@/lib/format";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; phone?: string }>;
}) {
  const params = await searchParams;
  const order = params.order ? await getPublicOrder(params.order, params.phone) : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
        <p className="text-sm font-bold uppercase text-[var(--color-primary)]">{order ? "Order placed" : "Order not found"}</p>
        <h1 className="mt-3 text-3xl font-black">{order ? "Thank you for your order" : "We could not load this order"}</h1>
        {order ? (
          <>
            <p className="mt-3 text-[var(--color-muted)]">Order ID: <strong className="text-[var(--color-text)]">{order.orderNumber}</strong></p>
            <div className="mx-auto mt-8 max-w-md rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-5 text-left">
              <h2 className="font-bold">Order summary</h2>
              <div className="mt-4 space-y-2 text-sm">
                {(order.orderItems ?? []).map((item) => (
                  <div key={item.id} className="flex justify-between gap-4">
                    <span>{item.productTitle} x {item.quantity}</span>
                    <span>{formatCurrency(item.total)}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-[var(--color-border)] pt-2"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
                <div className="flex justify-between"><span>Delivery</span><span>{formatCurrency(order.deliveryCharge)}</span></div>
                <div className="flex justify-between"><span>Discount{order.couponCode ? ` (${order.couponCode})` : ""}</span><span>-{formatCurrency(order.discountAmount)}</span></div>
                <div className="flex justify-between border-t border-[var(--color-border)] pt-2 text-base font-bold"><span>Total</span><span>{formatCurrency(order.total)}</span></div>
              </div>
            </div>
          </>
        ) : (
          <p className="mt-3 text-[var(--color-muted)]">Please track your order using the order ID or phone number from checkout.</p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href={order ? `/track-order?order=${encodeURIComponent(order.orderNumber)}` : "/track-order"}>Track order</ButtonLink>
          <ButtonLink href="/products" variant="outline">Continue shopping</ButtonLink>
        </div>
      </div>
    </div>
  );
}
