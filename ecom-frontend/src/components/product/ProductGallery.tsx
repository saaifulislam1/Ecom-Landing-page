"use client";

import { useState } from "react";

export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(images[0]);

  return (
    <div className="space-y-3">
      <div className="aspect-square overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
        <img src={active} alt={title} className="h-full w-full object-cover" />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setActive(image)}
            className="aspect-square overflow-hidden rounded-md border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            aria-label={`View ${title} image ${index + 1}`}
          >
            <img src={image} alt={`${title} thumbnail ${index + 1}`} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
