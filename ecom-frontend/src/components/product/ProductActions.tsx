"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { Button } from "@/components/ui/Button";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { useCart } from "@/context/CartContext";

export function ProductActions({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [variants, setVariants] = useState<Record<string, string>>({});

  const defaultedVariants = useMemo(() => {
    const next = { ...variants };
    product.variants?.forEach((variant) => {
      if (!next[variant.name]) {
        next[variant.name] = variant.values[0];
      }
    });
    return next;
  }, [product.variants, variants]);

  function add() {
    addItem(product, quantity, defaultedVariants);
  }

  function buyNow() {
    addItem(product, quantity, defaultedVariants);
    router.push("/checkout");
  }

  return (
    <div className="space-y-5">
      {product.variants?.map((variant) => (
        <div key={variant.name}>
          <p className="mb-2 text-sm font-semibold">{variant.name}</p>
          <div className="flex flex-wrap gap-2">
            {variant.values.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setVariants((current) => ({ ...current, [variant.name]: value }))}
                className={`rounded-md border px-4 py-2 text-sm transition ${
                  defaultedVariants[variant.name] === value
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                    : "border-[var(--color-border)] bg-[var(--color-surface)]"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div>
        <p className="mb-2 text-sm font-semibold">Quantity</p>
        <QuantitySelector value={quantity} onChange={setQuantity} max={product.stock} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Button onClick={add}>Add to cart</Button>
        <Button variant="secondary" onClick={buyNow}>Buy now</Button>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--color-border)] bg-[var(--color-surface)] p-3 md:hidden">
        <Button className="w-full" onClick={add}>Add to cart</Button>
      </div>
    </div>
  );
}
