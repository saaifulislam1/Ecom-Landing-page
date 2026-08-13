"use client";

import { useEffect } from "react";
import { Product } from "@/types";
import { createEventId, trackViewContent } from "@/lib/metaPixel";

export function ProductMetaTracker({ product }: { product: Product }) {
  useEffect(() => {
    trackViewContent({
      content_ids: [product.id],
      content_name: product.title,
      content_type: "product",
      value: product.salePrice ?? product.price,
      currency: "BDT",
    }, createEventId(`view_${product.id}`));
  }, [product]);

  return null;
}
