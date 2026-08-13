import { getCategories } from "@/lib/api";
import { CategoryCard } from "@/components/product/CategoryCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: "Categories" }]} />
      <SectionHeading title="Shop by category" description="Browse live categories from the backend database." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => <CategoryCard key={category.id} category={category} />)}
      </div>
    </div>
  );
}
