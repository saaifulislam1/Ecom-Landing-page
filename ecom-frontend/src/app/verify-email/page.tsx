"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { verifyCustomerEmail } from "@/lib/api";

const CUSTOMER_TOKEN_KEY = "customer_token";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-md px-4 py-16 text-center text-sm text-[var(--color-muted)]">Loading verification...</main>}>
      <VerifyEmailStatus />
    </Suspense>
  );
}

function VerifyEmailStatus() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"verifying" | "verified" | "error">(token ? "verifying" : "error");
  const [message, setMessage] = useState(token ? "Verifying your email..." : "Verification token is missing.");

  useEffect(() => {
    if (!token) return;

    verifyCustomerEmail(token)
      .then((result) => {
        window.localStorage.setItem(CUSTOMER_TOKEN_KEY, result.token);
        setStatus("verified");
        setMessage("Your email is verified and you are signed in.");
      })
      .catch((error) => {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Could not verify email.");
      });
  }, [token]);

  return (
    <main className="mx-auto max-w-md px-4 py-16 text-center">
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-card)]">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--color-soft)] text-[var(--color-secondary)]">
          <FiCheckCircle aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-2xl font-black">{status === "verified" ? "Email verified" : status === "error" ? "Verification failed" : "Checking link"}</h1>
        <p className="mt-3 text-sm text-[var(--color-muted)]">{message}</p>
        <div className="mt-6">
          {status === "verified" ? <Button type="button" onClick={() => window.location.assign("/account")}>Go to account</Button> : <Link className="text-sm font-semibold text-[var(--color-secondary)]" href="/login">Back to sign in</Link>}
        </div>
      </div>
    </main>
  );
}
