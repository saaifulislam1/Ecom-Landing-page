import { FiPlus } from "react-icons/fi";
import { getAdminCategories, getAdminProducts } from "@/lib/api";
import { AdminButtonLink } from "@/components/admin/ui/AdminButton";
import { ProductAdminTable } from "@/components/admin/product/ProductAdminTable";
import { PageHeader } from "@/components/admin/ui/PageHeader";

export default async function AdminProductsPage({ searchParams }: { searchParams?: Promise<{ search?: string }> }) {
  const params = await searchParams;
  const [adminProducts, adminCategories] = await Promise.all([getAdminProducts(), getAdminCategories()]);
  return (
    <>
      <PageHeader title="Products" description="Manage catalog items, publishing status, stock, and merchandising flags." actions={<AdminButtonLink href="/admin/products/new"><FiPlus /> Add product</AdminButtonLink>} />
      <ProductAdminTable products={adminProducts} categories={adminCategories} initialQuery={params?.search ?? ""} />
    </>
  );
}
