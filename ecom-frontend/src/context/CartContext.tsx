"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CartItem, Product } from "@/types";
import { trackAddToCart } from "@/lib/metaPixel";
import type { AppliedCoupon } from "@/lib/api";

type CartContextValue = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, selectedVariants?: Record<string, string>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  appliedCoupon: AppliedCoupon | null;
  setAppliedCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
  itemCount: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const storageKey = "plug-storefront-cart";
const couponStorageKey = "plug-storefront-coupon";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }
    try {
      const stored = window.localStorage.getItem(storageKey);
      return stored ? (JSON.parse(stored) as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [appliedCoupon, setAppliedCouponState] = useState<AppliedCoupon | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }
    try {
      const stored = window.localStorage.getItem(couponStorageKey);
      return stored ? (JSON.parse(stored) as AppliedCoupon) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (appliedCoupon) {
      window.localStorage.setItem(couponStorageKey, JSON.stringify(appliedCoupon));
    } else {
      window.localStorage.removeItem(couponStorageKey);
    }
  }, [appliedCoupon]);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce(
      (total, item) => total + (item.product.salePrice ?? item.product.price) * item.quantity,
      0,
    );
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);

    return {
      items,
      addItem(product, quantity = 1, selectedVariants) {
        trackAddToCart({
          content_ids: [product.id],
          content_name: product.title,
          content_type: "product",
          value: (product.salePrice ?? product.price) * quantity,
          currency: "BDT",
        });
        setItems((current) => {
          const existing = current.find((item) => item.product.id === product.id);
          if (!existing) {
            return [...current, { product, quantity, selectedVariants }];
          }
          return current.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
              : item,
          );
        });
      },
      removeItem(productId) {
        setItems((current) => current.filter((item) => item.product.id !== productId));
      },
      updateQuantity(productId, quantity) {
        setItems((current) =>
          current.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: Math.max(1, Math.min(quantity, item.product.stock)) }
              : item,
          ),
        );
      },
      clearCart() {
        setItems([]);
        setAppliedCouponState(null);
      },
      appliedCoupon,
      setAppliedCoupon(coupon) {
        setAppliedCouponState(coupon);
      },
      removeCoupon() {
        setAppliedCouponState(null);
      },
      itemCount,
      subtotal,
    };
  }, [appliedCoupon, items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
