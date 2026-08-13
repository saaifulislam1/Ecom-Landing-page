import { PageHeader } from "@/components/admin/ui/PageHeader";
import { ProductForm } from "@/components/admin/product/ProductForm";
import { getAdminCategories, getAdminProducts } from "@/lib/api";

export default async function AdminNewProductPage() {
  const [products, categories] = await Promise.all([getAdminProducts(), getAdminCategories()]);
  return (
    <>
      <PageHeader title="Add product" description="Create product content, pricing, inventory, variants, media, and SEO metadata." />
      <ProductForm mode="new" products={products} categories={categories} />
    </>
  );
}
