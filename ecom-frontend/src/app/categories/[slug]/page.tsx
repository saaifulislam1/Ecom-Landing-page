import { notFound } from "next/navigation";
import { getCategories, getCategory, getProducts } from "@/lib/api";
import { ProductCard } from "@/components/product/ProductCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export default async function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [category, products] = await Promise.all([getCategory(slug), getProducts()]);
  if (!category) notFound();
  const categoryProducts = products.filter((product) => product.category === category.name);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: "Categories", href: "/categories" }, { label: category.name }]} />
      <section className="mb-10 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] md:grid md:grid-cols-[1fr_420px]">
        <div className="p-6 md:p-8">
          <SectionHeading title={category.name} description={category.description} />
          <p className="text-sm font-semibold text-[var(--color-muted)]">{categoryProducts.length} products available</p>
        </div>
        <img src={category.image} alt={category.name} className="h-72 w-full object-cover md:h-full" />
      </section>
      {categoryProducts.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categoryProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center">
          <h2 className="text-xl font-bold">No products in this category yet</h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">Add products from the admin dashboard to populate this category.</p>
        </div>
      )}
    </div>
  );
}
