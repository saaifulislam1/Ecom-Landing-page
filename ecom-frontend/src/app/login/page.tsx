"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { FiLogIn } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/FormControls";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { resendCustomerVerification } from "@/lib/api";

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-md px-4 py-12 text-sm text-[var(--color-muted)]">Loading sign in...</main>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useCustomerAuth();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState(searchParams.get("registered") ? "Account created. Check your email for the verification link before signing in." : "");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      setSubmitting(true);
      await login(email, password);
      router.push("/account");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Could not sign in.");
    } finally {
      setSubmitting(false);
    }
  }

  async function resend() {
    if (!email) {
      setError("Enter your email first.");
      return;
    }
    setError("");
    setMessage("");
    try {
      setResending(true);
      await resendCustomerVerification(email);
      setMessage("Verification email sent. Check your inbox.");
    } catch (resendError) {
      setError(resendError instanceof Error ? resendError.message : "Could not resend verification email.");
    } finally {
      setResending(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <form onSubmit={submit} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card)]">
        <h1 className="text-2xl font-black">Customer sign in</h1>
        <div className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm font-semibold">
            <span>Email</span>
            <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            <span>Password</span>
            <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
        </div>
        {message ? <p className="mt-4 rounded-md bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">{message}</p> : null}
        {error ? <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p> : null}
        <Button type="submit" className="mt-6 w-full" disabled={submitting}><FiLogIn aria-hidden="true" />{submitting ? "Signing in..." : "Sign in"}</Button>
        <button type="button" onClick={resend} disabled={resending} className="mt-4 w-full text-sm font-semibold text-[var(--color-secondary)] disabled:opacity-60">
          {resending ? "Sending..." : "Resend verification email"}
        </button>
        <p className="mt-5 text-center text-sm text-[var(--color-muted)]">
          New customer? <Link className="font-semibold text-[var(--color-secondary)]" href="/register">Create an account</Link>
        </p>
        <p className="mt-3 text-center text-sm text-[var(--color-muted)]">
          Prefer not to sign in? <Link className="font-semibold text-[var(--color-secondary)]" href="/checkout">Checkout as guest</Link>
        </p>
      </form>
    </main>
  );
}
