import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "@/app/globals.css";
import { Providers } from "@/context/Providers";
import { PageShell } from "@/components/layout/PageShell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PlugCommerce Storefront",
  description: "Customer-facing ecommerce storefront frontend built with Next.js.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`} data-scroll-behavior="smooth">
      <body className="flex min-h-screen flex-col antialiased">
        <Providers>
          <PageShell>{children}</PageShell>
        </Providers>
      </body>
    </html>
  );
}
