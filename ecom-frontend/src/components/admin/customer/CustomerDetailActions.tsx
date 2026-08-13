"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSave } from "react-icons/fi";
import { BackendCustomer, updateAdminCustomer } from "@/lib/api";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { Field, FormTextarea } from "@/components/admin/ui/AdminForm";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";

const availableTags = ["New", "Repeat", "VIP", "Risky"];

export function CustomerDetailActions({ customer }: { customer: BackendCustomer }) {
  const router = useRouter();
  const [notes, setNotes] = useState(customer.notes ?? "");
  const [tags, setTags] = useState(customer.tags);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function toggleTag(tag: string) {
    setTags((current) => current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]);
  }

  async function save() {
    setMessage("");
    setError("");
    setSubmitting(true);
    try {
      await updateAdminCustomer(customer.id, { notes, tags });
      setMessage("Customer updated successfully.");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not update customer.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <Field label="Notes"><FormTextarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Add customer note" /></Field>
      </section>
      <section className="rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-bold">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <button key={tag} type="button" className="cursor-pointer" onClick={() => toggleTag(tag)} aria-pressed={tags.includes(tag)}>
              <StatusBadge status={tags.includes(tag) ? tag : `${tag} off`} />
            </button>
          ))}
        </div>
        <AdminButton type="button" className="mt-4" onClick={save} disabled={submitting}><FiSave aria-hidden="true" />{submitting ? "Saving..." : "Save customer"}</AdminButton>
        {message ? <p className="mt-3 text-sm font-semibold text-emerald-700">{message}</p> : null}
        {error ? <p className="mt-3 text-sm font-semibold text-red-600">{error}</p> : null}
      </section>
    </>
  );
}
