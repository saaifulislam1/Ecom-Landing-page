"use client";

import { CartProvider } from "@/context/CartContext";
import { CustomerAuthProvider } from "@/context/CustomerAuthContext";
import { StoreThemeProvider } from "@/context/ThemeContext";
import { MetaPixelClient } from "@/components/marketing/MetaPixelClient";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreThemeProvider>
      <CustomerAuthProvider>
        <CartProvider>
          <MetaPixelClient />
          {children}
        </CartProvider>
      </CustomerAuthProvider>
    </StoreThemeProvider>
  );
}
