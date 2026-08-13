"use client";

import { FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { BsMessenger } from "react-icons/bs";
import { FiCopy } from "react-icons/fi";
import { Button } from "@/components/ui/Button";

export function SocialShare({ title }: { title: string }) {
  const encodedTitle = encodeURIComponent(title);

  function openShare(target: "facebook" | "whatsapp") {
    const encodedUrl = encodeURIComponent(window.location.href);
    const href =
      target === "facebook"
        ? `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        : `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
    window.open(href, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" className="inline-flex items-center gap-2 rounded-md border border-[var(--color-border)] px-3 py-2 text-sm hover:border-[var(--color-primary)]" onClick={() => openShare("facebook")}>
        <FaFacebookF aria-hidden="true" />
        Facebook
      </button>
      <button type="button" className="inline-flex items-center gap-2 rounded-md border border-[var(--color-border)] px-3 py-2 text-sm hover:border-[var(--color-primary)]" onClick={() => openShare("whatsapp")}>
        <FaWhatsapp aria-hidden="true" />
        WhatsApp
      </button>
      <a className="inline-flex items-center gap-2 rounded-md border border-[var(--color-border)] px-3 py-2 text-sm hover:border-[var(--color-primary)]" href="https://m.me/" target="_blank" rel="noreferrer">
        <BsMessenger aria-hidden="true" />
        Messenger
      </a>
      <Button variant="outline" className="h-10 px-3" onClick={() => navigator.clipboard.writeText(window.location.href)}>
        <FiCopy aria-hidden="true" />
        Copy Link
      </Button>
    </div>
  );
}
