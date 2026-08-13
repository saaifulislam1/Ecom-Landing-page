import { FiPlus } from "react-icons/fi";
import { getAdminCategories } from "@/lib/api";
import { AdminButtonLink } from "@/components/admin/ui/AdminButton";
import { CategoryAdminClient } from "@/components/admin/category/CategoryAdminClient";
import { PageHeader } from "@/components/admin/ui/PageHeader";

export default async function AdminCategoriesPage() {
  const adminCategories = await getAdminCategories();
  return (
    <>
      <PageHeader title="Categories" description="Manage storefront navigation and category landing cards." actions={<AdminButtonLink href="#add-category"><FiPlus /> Add category</AdminButtonLink>} />
      <CategoryAdminClient categories={adminCategories} />
    </>
  );
}
