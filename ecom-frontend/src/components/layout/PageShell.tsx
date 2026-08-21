"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingSupport } from "@/components/layout/FloatingSupport";
import { getPublicMarketingSettings } from "@/lib/api";

export function PageShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [supportLinks, setSupportLinks] = useState<{ whatsappNumber?: string | null; messengerLink?: string | null }>({});

  useEffect(() => {
    let mounted = true;
    getPublicMarketingSettings().then((settings) => {
      if (!mounted) return;
      setSupportLinks({
        whatsappNumber: settings?.whatsappNumber,
        messengerLink: settings?.messengerLink,
      });
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingSupport {...supportLinks} />
    </>
  );
}
