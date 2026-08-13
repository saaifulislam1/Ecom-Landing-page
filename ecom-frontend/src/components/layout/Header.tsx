"use client";

import Link from "next/link";
import { useState } from "react";
import { FiGrid, FiHome, FiInfo, FiMenu, FiPhone, FiSearch, FiShoppingBag, FiUser, FiX } from "react-icons/fi";
import { Input } from "@/components/ui/FormControls";
import { useCart } from "@/context/CartContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

const nav = [
  { href: "/", label: "Home", icon: FiHome },
  { href: "/products", label: "Products", icon: FiShoppingBag },
  { href: "/categories", label: "Categories", icon: FiGrid },
  { href: "/about", label: "About", icon: FiInfo },
  { href: "/contact", label: "Contact", icon: FiPhone },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();
  const { customer } = useCustomerAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-black tracking-tight text-[var(--color-text)]">
          PlugCommerce
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {nav.map((item) => (
            <Link key={item.label} href={item.href} className="inline-flex items-center gap-1.5 hover:text-[var(--color-primary)]">
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="relative ml-auto hidden w-64 lg:block">
          <label className="sr-only" htmlFor="site-search">Search products</label>
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" aria-hidden="true" />
          <Input id="site-search" placeholder="Search products" className="pl-9" />
        </div>
        <Link href="/cart" className="relative ml-auto inline-flex items-center gap-2 rounded-md border border-[var(--color-border)] px-3 py-2 text-sm font-semibold hover:border-[var(--color-primary)] md:ml-0">
          <FiShoppingBag aria-hidden="true" />
          Cart
          <span className="ml-2 rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-xs text-white">{itemCount}</span>
        </Link>
        <Link href={customer ? "/account" : "/login"} className="hidden items-center gap-2 rounded-md border border-[var(--color-border)] px-3 py-2 text-sm font-semibold hover:border-[var(--color-primary)] md:inline-flex">
          <FiUser aria-hidden="true" />
          {customer ? "Account" : "Sign in"}
        </Link>
        <button
          className="rounded-md border border-[var(--color-border)] px-3 py-2 text-sm md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 md:hidden">
          <div className="mb-4">
            <Input placeholder="Search products" />
          </div>
          <nav className="grid gap-3 text-sm font-medium">
            {nav.map((item) => (
              <Link key={item.label} href={item.href} onClick={() => setOpen(false)} className="inline-flex items-center gap-2">
                <item.icon aria-hidden="true" />
                {item.label}
              </Link>
            ))}
            <Link href={customer ? "/account" : "/login"} onClick={() => setOpen(false)} className="inline-flex items-center gap-2">
              <FiUser aria-hidden="true" />
              {customer ? "Account" : "Sign in"}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
