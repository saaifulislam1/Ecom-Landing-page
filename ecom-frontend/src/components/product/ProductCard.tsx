"use client";

import Link from "next/link";
import { FiEye, FiHeart, FiShoppingBag } from "react-icons/fi";
import { Product } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RatingStars } from "@/components/ui/RatingStars";
import { formatCurrency } from "@/lib/format";
import { useCart } from "@/context/CartContext";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const currentPrice = product.salePrice ?? product.price;
  const discount = product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;
  const stockLabel = product.stock > 10 ? "In stock" : `${product.stock} left`;

  return (
    <article className="group overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] transition duration-300 hover:-translate-y-1 hover:border-[var(--color-secondary)]/40 hover:shadow-[var(--shadow-card-hover)]">
      <div className="relative bg-[var(--color-soft)]">
        <Link href={`/products/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
        </Link>
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {product.badge ? <Badge>{product.badge}</Badge> : null}
          {discount ? <span className="rounded-full bg-[var(--color-primary)] px-2.5 py-1 text-xs font-bold text-white shadow-sm">-{discount}%</span> : null}
        </div>
        <div className="absolute right-3 top-3 grid gap-2 opacity-0 transition group-hover:opacity-100">
          <Link
            href={`/products/${product.slug}`}
            className="grid h-9 w-9 place-items-center rounded-full bg-white text-[var(--color-text)] shadow-md transition hover:bg-[var(--color-primary)] hover:text-white"
            aria-label={`View ${product.title}`}
          >
            <FiEye aria-hidden="true" />
          </Link>
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-full bg-white text-[var(--color-text)] shadow-md transition hover:bg-[var(--color-accent)] hover:text-white"
            aria-label={`Save ${product.title}`}
          >
            <FiHeart aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="space-y-3 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3 text-xs font-bold">
          <span className="uppercase tracking-wide text-[var(--color-secondary)]">{product.category}</span>
          <span className={product.stock > 10 ? "text-[var(--color-success)]" : "text-[var(--color-warning)]"}>
            {stockLabel}
          </span>
        </div>
        <div className="min-h-[52px]">
          <Link href={`/products/${product.slug}`} className="line-clamp-2 text-base font-extrabold leading-6 text-[var(--color-text)] transition hover:text-[var(--color-secondary)]">
            {product.title}
          </Link>
          <p className="mt-1 line-clamp-1 text-xs text-[var(--color-muted)]">{product.description}</p>
        </div>
        <RatingStars rating={product.rating} count={product.reviewCount} />
        <div className="flex items-end justify-between gap-3">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="price-text text-xl font-black text-[var(--color-text)]">
              {formatCurrency(currentPrice)}
          </span>
          {product.salePrice ? (
              <span className="price-text text-sm text-[var(--color-muted)] line-through">{formatCurrency(product.price)}</span>
          ) : null}
          </div>
        </div>
        <Button className="w-full" onClick={() => addItem(product)}>
          <FiShoppingBag aria-hidden="true" />
          Add to cart
        </Button>
      </div>
    </article>
  );
}
