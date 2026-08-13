"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiLock, FiLogIn } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/FormControls";
import { getAdminAccessRole, ADMIN_TOKEN_COOKIE, loginAdmin } from "@/lib/api";
import { canAccessAdminPath, getFirstAdminPath } from "@/lib/adminAccess";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const result = await loginAdmin(email.trim(), password);
      const secure = window.location.protocol === "https:" ? "; Secure" : "";
      document.cookie = `${ADMIN_TOKEN_COOKIE}=${encodeURIComponent(result.token)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax${secure}`;
      const role = await getAdminAccessRole();
      const nextPath = searchParams.get("next");
      router.push(nextPath && canAccessAdminPath(role, nextPath) ? nextPath : getFirstAdminPath(role));
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not log in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-10 text-[#0F172A]">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-md place-items-center">
        <form onSubmit={submit} className="w-full rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm">
          <div className="mb-6">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-md bg-[#2563EB] text-white">
              <FiLock className="h-5 w-5" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-black">Admin login</h1>
            <p className="mt-2 text-sm text-[#64748B]">Sign in with an owner, manager, or staff account.</p>
          </div>

          <div className="space-y-4">
            <label className="grid gap-2 text-sm font-semibold">
              <span>Email<span className="ml-1 text-red-600" aria-label="required">*</span></span>
              <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              <span>Password<span className="ml-1 text-red-600" aria-label="required">*</span></span>
              <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
            </label>
          </div>

          {error ? <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p> : null}

          <Button type="submit" className="mt-6 w-full" disabled={submitting}>
            <FiLogIn aria-hidden="true" />
            {submitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </main>
  );
}
