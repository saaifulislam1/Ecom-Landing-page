import Link from "next/link";
import { FiHelpCircle, FiMapPin, FiPackage, FiShield, FiShoppingBag } from "react-icons/fi";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <h2 className="inline-flex items-center gap-2 text-lg font-black"><FiShoppingBag aria-hidden="true" /> PlugCommerce</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-[var(--color-muted)]">
            A reusable ecommerce storefront frontend for entrepreneurs, built with static data today and ready for backend integration later.
          </p>
        </div>
        <div>
          <h3 className="font-bold">Shop</h3>
          <div className="mt-3 grid gap-2 text-sm text-[var(--color-muted)]">
            <Link href="/products" className="inline-flex items-center gap-2"><FiPackage aria-hidden="true" /> Products</Link>
            <Link href="/track-order" className="inline-flex items-center gap-2"><FiMapPin aria-hidden="true" /> Track order</Link>
            <Link href="/faq" className="inline-flex items-center gap-2"><FiHelpCircle aria-hidden="true" /> FAQ</Link>
          </div>
        </div>
        <div>
          <h3 className="font-bold">Policies</h3>
          <div className="mt-3 grid gap-2 text-sm text-[var(--color-muted)]">
            <Link href="/privacy-policy" className="inline-flex items-center gap-2"><FiShield aria-hidden="true" /> Privacy Policy</Link>
            <Link href="/refund-policy" className="inline-flex items-center gap-2"><FiShield aria-hidden="true" /> Refund Policy</Link>
            <Link href="/terms-and-conditions" className="inline-flex items-center gap-2"><FiShield aria-hidden="true" /> Terms</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--color-border)] py-4 text-center text-xs text-[var(--color-muted)]">
        Copyright 2026 PlugCommerce. Demo storefront only.
      </div>
    </footer>
  );
}
