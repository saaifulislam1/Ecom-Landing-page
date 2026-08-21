"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSave } from "react-icons/fi";
import { BackendProduct, BackendCategory, ProductPayload, createAdminProduct, updateAdminProduct } from "@/lib/api";
import { AdminButton, AdminButtonLink } from "@/components/admin/ui/AdminButton";
import { Field, FormInput, FormSelect, FormTextarea } from "@/components/admin/ui/AdminForm";

export function ProductForm({
  mode,
  productId,
  products,
  categories,
}: {
  mode: "new" | "edit";
  productId?: string;
  products: BackendProduct[];
  categories: BackendCategory[];
}) {
  const isEdit = mode === "edit";
  const product = isEdit ? products.find((item) => item.id === productId) : undefined;
  const router = useRouter();
  const [title, setTitle] = useState(isEdit ? product?.title ?? "" : "");
  const [slug, setSlug] = useState(isEdit ? product?.slug ?? "" : "");
  const [shortDescription, setShortDescription] = useState(isEdit ? product?.shortDescription ?? "" : "");
  const [description, setDescription] = useState(isEdit ? product?.description ?? "" : "");
  const [deliveryDetails, setDeliveryDetails] = useState(isEdit ? product?.deliveryDetails ?? "" : "Inside city 1-2 days, outside city 3-5 days.");
  const [returnPolicy, setReturnPolicy] = useState(isEdit ? product?.returnPolicy ?? "" : "Refund or exchange requests accepted within 7 days for eligible products.");
  const [categoryId, setCategoryId] = useState(isEdit ? product?.category?.id ?? "" : categories[0]?.id ?? "");
  const [sku, setSku] = useState(isEdit ? product?.sku ?? "" : "");
  const [price, setPrice] = useState(isEdit ? String(product?.price ?? "") : "");
  const [salePrice, setSalePrice] = useState(isEdit ? String(product?.salePrice ?? "") : "");
  const [stock, setStock] = useState(isEdit ? String(product?.stock ?? 0) : "0");
  const [images, setImages] = useState(isEdit ? product?.images.join("\n") ?? "" : "");
  const [badge, setBadge] = useState(isEdit ? product?.badge ?? "New" : "New");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "HIDDEN">(isEdit ? (product?.status as "DRAFT" | "PUBLISHED" | "HIDDEN") ?? "PUBLISHED" : "PUBLISHED");
  const [featured, setFeatured] = useState(isEdit ? product?.featured ?? false : false);
  const [bestSeller, setBestSeller] = useState(isEdit ? product?.bestSeller ?? false : false);
  const [sizeOptions, setSizeOptions] = useState("");
  const [colorOptions, setColorOptions] = useState("");
  const [customVariant, setCustomVariant] = useState("");
  const [seoTitle, setSeoTitle] = useState(isEdit ? product?.title ?? "" : "");
  const [seoDescription, setSeoDescription] = useState(isEdit ? product?.description ?? "" : "");
  const [ogImage, setOgImage] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isEdit && !product) {
    return (
      <section className="rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">Product not found</h2>
        <p className="mt-2 text-sm text-[#64748B]">This product may have been deleted or the link is no longer valid.</p>
        <AdminButtonLink href="/admin/products" variant="outline" className="mt-4">Back to products</AdminButtonLink>
      </section>
    );
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setSubmitting(true);

    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const nextStatus = (submitter?.value as "DRAFT" | "PUBLISHED" | "HIDDEN" | undefined) ?? status;

    const payload: ProductPayload = {
      title,
      ...(slug.trim() ? { slug: slug.trim() } : {}),
      description,
      ...(shortDescription.trim() ? { shortDescription: shortDescription.trim() } : {}),
      ...(deliveryDetails.trim() ? { deliveryDetails: deliveryDetails.trim() } : {}),
      ...(returnPolicy.trim() ? { returnPolicy: returnPolicy.trim() } : {}),
      ...(categoryId ? { categoryId } : {}),
      ...(sku.trim() ? { sku: sku.trim() } : {}),
      price: Number(price),
      ...(salePrice.trim() ? { salePrice: Number(salePrice) } : {}),
      stock: Number(stock),
      images: images.split(/[\n,]/).map((image) => image.trim()).filter(Boolean),
      ...(badge ? { badge } : {}),
      status: nextStatus,
      featured,
      bestSeller,
      variants: buildVariants(sizeOptions, colorOptions, customVariant),
      ...(seoTitle.trim() ? { seoTitle: seoTitle.trim() } : {}),
      ...(seoDescription.trim() ? { seoDescription: seoDescription.trim() } : {}),
      ...(ogImage.trim() ? { ogImage: ogImage.trim() } : {}),
    };

    try {
      const saved = isEdit && product ? await updateAdminProduct(product.id, payload) : await createAdminProduct(payload);
      setStatus(saved.status as "DRAFT" | "PUBLISHED" | "HIDDEN");
      setMessage(isEdit ? "Product updated successfully." : "Product created successfully.");
      router.refresh();
      if (!isEdit) router.push(`/admin/products/${saved.id}/edit`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not save product.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="space-y-6">
        <Panel title="Product information">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Product title"><FormInput value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Everyday Linen Shirt" required /></Field>
            <Field label="Slug"><FormInput value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="everyday-linen-shirt" /></Field>
          </div>
          <Field label="Short description"><FormInput value={shortDescription} onChange={(event) => setShortDescription(event.target.value)} /></Field>
          <Field label="Description"><FormTextarea value={description} onChange={(event) => setDescription(event.target.value)} required /></Field>
          <Field label="Delivery details"><FormTextarea value={deliveryDetails} onChange={(event) => setDeliveryDetails(event.target.value)} required /></Field>
          <Field label="Return policy"><FormTextarea value={returnPolicy} onChange={(event) => setReturnPolicy(event.target.value)} required /></Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Category">
              <FormSelect value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
                <option value="">Uncategorized</option>
                {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </FormSelect>
            </Field>
            <Field label="SKU"><FormInput value={sku} onChange={(event) => setSku(event.target.value)} placeholder="SKU-001" /></Field>
          </div>
        </Panel>

        <Panel title="Pricing and inventory">
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Price"><FormInput type="number" min="0" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} required /></Field>
            <Field label="Sale price"><FormInput type="number" min="0" step="0.01" value={salePrice} onChange={(event) => setSalePrice(event.target.value)} /></Field>
            <Field label="Stock quantity"><FormInput type="number" min="0" step="1" value={stock} onChange={(event) => setStock(event.target.value)} required /></Field>
          </div>
        </Panel>

        <Panel title="Variants">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Size options"><FormInput value={sizeOptions} onChange={(event) => setSizeOptions(event.target.value)} placeholder="S, M, L, XL" /></Field>
            <Field label="Color options"><FormInput value={colorOptions} onChange={(event) => setColorOptions(event.target.value)} placeholder="Black, White, Blue" /></Field>
          </div>
          <Field label="Custom variant"><FormInput value={customVariant} onChange={(event) => setCustomVariant(event.target.value)} placeholder="Material: Cotton, Linen" /></Field>
        </Panel>

        <Panel title="SEO">
          <Field label="Meta title"><FormInput value={seoTitle} onChange={(event) => setSeoTitle(event.target.value)} /></Field>
          <Field label="Meta description"><FormTextarea value={seoDescription} onChange={(event) => setSeoDescription(event.target.value)} /></Field>
          <Field label="Open Graph image URL"><FormInput value={ogImage} onChange={(event) => setOgImage(event.target.value)} placeholder="https://..." /></Field>
        </Panel>
      </section>

      <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <Panel title="Product media">
          <Field label="Product image URLs">
            <FormTextarea value={images} onChange={(event) => setImages(event.target.value)} placeholder="https://example.com/image.jpg" />
          </Field>
          <p className="text-sm leading-6 text-[#64748B]">Add one image URL per line, or separate URLs with commas.</p>
        </Panel>
        <Panel title="Publishing">
          <Field label="Badge">
            <FormSelect value={badge} onChange={(event) => setBadge(event.target.value)}>
              <option value="New">New</option>
              <option value="Best Seller">Best Seller</option>
              <option value="Sale">Sale</option>
              <option value="Limited Stock">Limited Stock</option>
            </FormSelect>
          </Field>
          <Field label="Status">
            <FormSelect value={status} onChange={(event) => setStatus(event.target.value as "DRAFT" | "PUBLISHED" | "HIDDEN")} required>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="HIDDEN">Hidden</option>
            </FormSelect>
          </Field>
          <label className="flex items-center justify-between gap-3 rounded-md border border-[#E2E8F0] bg-white p-3 text-sm font-medium">
            Featured product
            <input type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} className="h-5 w-5 accent-[#2563EB]" />
          </label>
          <label className="flex items-center justify-between gap-3 rounded-md border border-[#E2E8F0] bg-white p-3 text-sm font-medium">
            Best seller
            <input type="checkbox" checked={bestSeller} onChange={(event) => setBestSeller(event.target.checked)} className="h-5 w-5 accent-[#2563EB]" />
          </label>
          <div className="flex flex-col gap-2 pt-2">
            <AdminButton type="submit" name="status" value="DRAFT" variant="outline" disabled={submitting}>
              <FiSave aria-hidden="true" />
              {submitting ? "Saving..." : "Save as draft"}
            </AdminButton>
            <AdminButton type="submit" name="status" value="PUBLISHED" disabled={submitting}>
              <FiSave aria-hidden="true" />
              {submitting ? "Saving..." : isEdit ? "Save changes" : "Publish product"}
            </AdminButton>
            {isEdit && product ? <AdminButtonLink href={`/products/${product.slug}`} variant="secondary">Preview product</AdminButtonLink> : null}
            {message ? <p className="text-sm font-semibold text-emerald-700">{message}</p> : null}
            {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}
          </div>
        </Panel>
      </aside>
    </form>
  );
}

function buildVariants(sizeOptions: string, colorOptions: string, customVariant: string) {
  const variants: Record<string, string[]> = {};
  const sizes = splitOptions(sizeOptions);
  const colors = splitOptions(colorOptions);
  if (sizes.length) variants.Size = sizes;
  if (colors.length) variants.Color = colors;
  const [name, values] = customVariant.split(":");
  const customValues = splitOptions(values ?? "");
  if (name?.trim() && customValues.length) variants[name.trim()] = customValues;
  return Object.keys(variants).length ? variants : undefined;
}

function splitOptions(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold">{title}</h2>
      {children}
    </section>
  );
}
