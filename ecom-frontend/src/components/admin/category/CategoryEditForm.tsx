"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSave } from "react-icons/fi";
import { BackendCategory, updateAdminCategory } from "@/lib/api";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { Field, FormInput, FormSelect, FormTextarea } from "@/components/admin/ui/AdminForm";

const fallbackImage = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80";

export function CategoryEditForm({ category }: { category: BackendCategory }) {
  const router = useRouter();
  const [name, setName] = useState(category.name);
  const [slug, setSlug] = useState(category.slug);
  const [description, setDescription] = useState(category.description ?? "");
  const [image, setImage] = useState(category.image ?? "");
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setSubmitting(true);
    try {
      await updateAdminCategory(category.id, {
        name,
        slug,
        description,
        image,
        status,
      });
      setMessage("Category updated successfully.");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not update category.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_420px]">
      <section className="space-y-4 rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">Category details</h2>
        <Field label="Category title">
          <FormInput value={name} onChange={(event) => setName(event.target.value)} required />
        </Field>
        <Field label="Slug">
          <FormInput value={slug} onChange={(event) => setSlug(event.target.value)} required />
        </Field>
        <Field label="Description">
          <FormTextarea value={description} onChange={(event) => setDescription(event.target.value)} />
        </Field>
        <Field label="Image URL">
          <FormInput value={image} onChange={(event) => setImage(event.target.value)} placeholder="https://..." />
        </Field>
        <Field label="Status">
          <FormSelect value={status} onChange={(event) => setStatus(event.target.value as "ACTIVE" | "INACTIVE")} required>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </FormSelect>
        </Field>
        <div className="flex flex-wrap items-center gap-3">
          <AdminButton type="submit" disabled={submitting}>
            <FiSave aria-hidden="true" />
            {submitting ? "Saving..." : "Save changes"}
          </AdminButton>
          {message ? <p className="text-sm font-semibold text-emerald-700">{message}</p> : null}
          {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}
        </div>
      </section>
      <aside className="space-y-4 rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:self-start">
        <h2 className="text-lg font-bold">Image preview</h2>
        <img src={image || fallbackImage} alt={name || "Category preview"} className="aspect-[4/3] w-full rounded-lg object-cover" />
        <p className="text-sm leading-6 text-[#64748B]">
          Paste a hosted image URL for now. File upload storage can be connected later.
        </p>
      </aside>
    </form>
  );
}
