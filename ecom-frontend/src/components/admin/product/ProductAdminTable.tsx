"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiEdit2 } from "react-icons/fi";
import { BackendCategory, BackendProduct, deleteAdminProduct } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { Field, FormInput, FormSelect } from "@/components/admin/ui/AdminForm";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { DataTable } from "@/components/admin/ui/DataTable";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";

export function ProductAdminTable({ products, categories, initialQuery = "" }: { products: BackendProduct[]; categories: BackendCategory[]; initialQuery?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [categoryId, setCategoryId] = useState("all");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesQuery = !normalizedQuery || product.title.toLowerCase().includes(normalizedQuery) || product.sku?.toLowerCase().includes(normalizedQuery);
      const matchesCategory = categoryId === "all" || product.category?.id === categoryId;
      const matchesStatus = status === "all" || product.status === status;
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [categoryId, products, query, status]);

  async function removeProduct(productId: string) {
    await deleteAdminProduct(productId);
    router.refresh();
  }

  return (
    <>
      <div className="mb-4 grid gap-3 rounded-lg border border-[#E2E8F0] bg-white p-4 md:grid-cols-3">
        <Field label="Search products"><FormInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by title or SKU" /></Field>
        <Field label="Category">
          <FormSelect value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
            <option value="all">All categories</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </FormSelect>
        </Field>
        <Field label="Status">
          <FormSelect value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="all">All statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="HIDDEN">Hidden</option>
          </FormSelect>
        </Field>
      </div>
      <DataTable columns={["Product", "Category", "Price", "Stock", "Status", "Flags", "Actions"]}>
        {filtered.map((product) => (
          <tr key={product.id}>
            <td className="px-4 py-3"><div className="flex items-center gap-3"><img src={product.images[0]} alt={product.title} className="h-12 w-12 rounded-md object-cover" /><span className="font-bold">{product.title}</span></div></td>
            <td className="px-4 py-3">{product.category?.name ?? "Uncategorized"}</td>
            <td className="px-4 py-3 price-text">{formatCurrency(Number(product.salePrice ?? product.price))}</td>
            <td className="px-4 py-3">{product.stock}</td>
            <td className="px-4 py-3"><StatusBadge status={product.status ?? "PUBLISHED"} /></td>
            <td className="px-4 py-3 text-xs text-[#64748B]">{product.featured ? "Featured " : ""}{product.bestSeller ? "Best seller" : ""}</td>
            <td className="px-4 py-3">
              <div className="flex gap-3">
                <Link className="inline-flex cursor-pointer items-center gap-1 font-semibold text-[#2563EB]" href={`/admin/products/${product.id}/edit`}><FiEdit2 aria-hidden="true" /> Edit</Link>
                <ConfirmModal title="Delete product" description={`Delete ${product.title}? This removes it from the storefront.`} confirmLabel="Delete" onConfirm={() => removeProduct(product.id)} />
              </div>
            </td>
          </tr>
        ))}
      </DataTable>
    </>
  );
}
