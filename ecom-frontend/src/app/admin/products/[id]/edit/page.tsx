import { PageHeader } from "@/components/admin/ui/PageHeader";
import { ProductForm } from "@/components/admin/product/ProductForm";
import { getAdminCategories, getAdminProducts } from "@/lib/api";

export default async function AdminEditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [products, categories] = await Promise.all([getAdminProducts(), getAdminCategories()]);
  return (
    <>
      <PageHeader title="Edit product" description="Update the product record and preview the storefront product page." />
      <ProductForm mode="edit" productId={id} products={products} categories={categories} />
    </>
  );
}
