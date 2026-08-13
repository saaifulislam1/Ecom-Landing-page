import { ProductsClient } from "@/app/products/ProductsClient";
import { getCategories, getProducts } from "@/lib/api";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  return <ProductsClient initialCategory={params.category} products={products} categories={categories} />;
}
