"use client";

import Link from "next/link";
import { FiTrash2 } from "react-icons/fi";
import { CartItem } from "@/types";
import { formatCurrency } from "@/lib/format";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { useCart } from "@/context/CartContext";

export function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart();
  const unitPrice = item.product.salePrice ?? item.product.price;

  return (
    <div className="grid gap-4 border-b border-[var(--color-border)] py-5 sm:grid-cols-[96px_1fr_auto]">
      <img src={item.product.images[0]} alt={item.product.title} className="h-24 w-24 rounded-md object-cover" />
      <div>
        <Link href={`/products/${item.product.slug}`} className="font-semibold hover:text-[var(--color-primary)]">
          {item.product.title}
        </Link>
        <p className="mt-1 text-sm text-[var(--color-muted)]">{item.product.category}</p>
        {item.selectedVariants ? (
          <p className="mt-1 text-xs text-[var(--color-muted)]">
            {Object.entries(item.selectedVariants).map(([key, value]) => `${key}: ${value}`).join(", ")}
          </p>
        ) : null}
        <button className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-red-600" onClick={() => removeItem(item.product.id)}>
          <FiTrash2 aria-hidden="true" />
          Remove
        </button>
      </div>
      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
        <QuantitySelector value={item.quantity} max={item.product.stock} onChange={(value) => updateQuantity(item.product.id, value)} />
        <p className="font-bold">{formatCurrency(unitPrice * item.quantity)}</p>
      </div>
    </div>
  );
}
