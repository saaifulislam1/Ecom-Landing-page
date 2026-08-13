"use client";

import { useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const faqs = [
  { question: "Where does product data come from?", answer: "Products and categories now come from the seeded PostgreSQL database through the backend API." },
  { question: "Is checkout connected to backend orders?", answer: "Yes. Checkout submits orders to the backend public order API." },
  { question: "Can the admin dashboard read real records?", answer: "Admin listing pages now read seeded products, categories, orders, customers, coupons, and analytics from the backend." },
  { question: "Are payments connected?", answer: "Cash on delivery and manual payment statuses are supported. Online payment gateway capture still requires a payment provider integration." },
];

export default function FAQPage() {
  const [open, setOpen] = useState(0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading title="Frequently asked questions" />
      <div className="divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
        {faqs.map((faq, index) => (
          <div key={faq.question}>
            <button
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-bold"
              onClick={() => setOpen(open === index ? -1 : index)}
              aria-expanded={open === index}
            >
              {faq.question}
              <span>{open === index ? "-" : "+"}</span>
            </button>
            {open === index ? <p className="px-5 pb-5 text-sm leading-6 text-[var(--color-muted)]">{faq.answer}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
