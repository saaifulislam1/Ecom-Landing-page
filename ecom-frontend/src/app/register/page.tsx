"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiUserPlus } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/FormControls";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useCustomerAuth();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");

    try {
      setSubmitting(true);
      await register({
        name: String(form.get("name") ?? ""),
        email,
        password: String(form.get("password") ?? ""),
        phone: String(form.get("phone") ?? ""),
        city: String(form.get("city") || "") || undefined,
        address: String(form.get("address") || "") || undefined,
      });
      router.push(`/login?registered=1&email=${encodeURIComponent(email)}`);
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : "Could not create account.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <form onSubmit={submit} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card)]">
        <h1 className="text-2xl font-black">Create customer account</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Full name"><Input name="name" required /></Field>
          <Field label="Phone number"><Input name="phone" required /></Field>
          <Field label="Email"><Input name="email" type="email" required /></Field>
          <Field label="Password"><Input name="password" type="password" minLength={8} required /></Field>
          <Field label="Area / city"><Input name="city" /></Field>
          <label className="grid gap-2 text-sm font-semibold md:col-span-2">
            <span>Delivery address</span>
            <Textarea name="address" />
          </label>
        </div>
        {error ? <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p> : null}
        <Button type="submit" className="mt-6" disabled={submitting}><FiUserPlus aria-hidden="true" />{submitting ? "Creating..." : "Create account"}</Button>
        <p className="mt-4 text-sm text-[var(--color-muted)]">After creating your account, check your email and verify it before signing in.</p>
      </form>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      <span>{label}</span>
      {children}
    </label>
  );
}
