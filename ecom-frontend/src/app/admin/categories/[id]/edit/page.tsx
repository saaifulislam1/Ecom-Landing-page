import { notFound } from "next/navigation";
import { getAdminCategories } from "@/lib/api";
import { CategoryEditForm } from "@/components/admin/category/CategoryEditForm";
import { PageHeader } from "@/components/admin/ui/PageHeader";

export default async function AdminEditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const categories = await getAdminCategories();
  const category = categories.find((item) => item.id === id);
  if (!category) notFound();

  return (
    <>
      <PageHeader title={`Edit ${category.name}`} description="Change the category title, slug, description, image, and publishing status." />
      <CategoryEditForm category={category} />
    </>
  );
}
