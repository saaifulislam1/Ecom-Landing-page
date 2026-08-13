"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiEdit2, FiPlus } from "react-icons/fi";
import { BackendCategory, createAdminCategory, deleteAdminCategory } from "@/lib/api";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { Field, FormInput, FormSelect, FormTextarea } from "@/components/admin/ui/AdminForm";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";

const fallbackImage = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80";

export function CategoryAdminClient({ categories }: { categories: BackendCategory[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
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
      await createAdminCategory({
        name,
        ...(slug.trim() ? { slug: slug.trim() } : {}),
        ...(description.trim() ? { description: description.trim() } : {}),
        ...(image.trim() ? { image: image.trim() } : {}),
        status,
      });
      setName("");
      setSlug("");
      setDescription("");
      setImage("");
      setStatus("ACTIVE");
      setMessage("Category created successfully.");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not create category.");
    } finally {
      setSubmitting(false);
    }
  }

  async function removeCategory(categoryId: string) {
    await deleteAdminCategory(categoryId);
    router.refresh();
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <article key={category.id} className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-sm">
            <img src={category.image ?? fallbackImage} alt={category.name} className="h-36 w-full object-cover" />
            <div className="p-4">
              <h2 className="font-bold">{category.name}</h2>
              <p className="mt-1 text-sm text-[#64748B]">/{category.slug}</p>
              <p className="mt-2 text-sm">{category._count?.products ?? 0} products</p>
              <div className="mt-4 flex gap-3">
                <Link href={`/admin/categories/${category.id}/edit`} className="inline-flex cursor-pointer items-center gap-1 text-sm font-semibold text-[#2563EB]">
                  <FiEdit2 aria-hidden="true" /> Edit
                </Link>
                <ConfirmModal
                  title="Delete category"
                  description={`Delete ${category.name}? Products in this category will become uncategorized.`}
                  confirmLabel="Delete"
                  onConfirm={() => removeCategory(category.id)}
                />
              </div>
            </div>
          </article>
        ))}
      </div>
      <form id="add-category" onSubmit={submit} className="space-y-4 rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:self-start">
        <h2 className="font-bold">Add category</h2>
        <Field label="Category name"><FormInput value={name} onChange={(event) => setName(event.target.value)} placeholder="Accessories" required /></Field>
        <Field label="Slug"><FormInput value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="accessories" /></Field>
        <Field label="Description"><FormTextarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Short category description" /></Field>
        <Field label="Image URL"><FormInput value={image} onChange={(event) => setImage(event.target.value)} placeholder="https://..." /></Field>
        <Field label="Status">
          <FormSelect value={status} onChange={(event) => setStatus(event.target.value as "ACTIVE" | "INACTIVE")} required>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </FormSelect>
        </Field>
        <AdminButton type="submit" disabled={submitting}>
          <FiPlus aria-hidden="true" />
          {submitting ? "Saving..." : "Save category"}
        </AdminButton>
        {message ? <p className="text-sm font-semibold text-emerald-700">{message}</p> : null}
        {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}
      </form>
    </div>
  );
}
