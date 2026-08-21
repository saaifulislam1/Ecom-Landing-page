"use client";

import { useState } from "react";
import { FiSend } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/FormControls";
import { HomepageSettings } from "@/lib/api";

export function Newsletter({ content, supportEmail }: { content?: HomepageSettings | null; supportEmail?: string | null }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function subscribe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.location.href = `mailto:${supportEmail ?? "support@example.com"}?subject=${encodeURIComponent("Newsletter subscription")}&body=${encodeURIComponent(`Please subscribe ${email} to store updates.`)}`;
    setMessage("Opening your email app to confirm subscription.");
    setEmail("");
  }

  return (
    <section className="bg-[var(--color-primary)] py-16 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-[1fr_440px] md:items-center lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-white/60">{content?.newsletterEyebrow ?? "Member offers"}</p>
          <h2 className="mt-2 text-2xl font-extrabold leading-tight md:text-4xl">{content?.newsletterTitle ?? "Get new arrivals and private offers first"}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">{content?.newsletterDescription ?? "Join the store list for product drops, seasonal campaigns, and curated shopping ideas."}</p>
        </div>
        <form onSubmit={subscribe} className="flex flex-col gap-2 sm:flex-row">
          <label className="sr-only" htmlFor="newsletter-email">Email address</label>
          <Input id="newsletter-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="bg-white text-[var(--color-text)]" required />
          <Button type="submit" variant="secondary" className="shrink-0"><FiSend aria-hidden="true" /> {content?.newsletterButtonLabel ?? "Subscribe"}</Button>
          {message ? <p className="text-sm font-semibold text-white">{message}</p> : null}
        </form>
      </div>
    </section>
  );
}
