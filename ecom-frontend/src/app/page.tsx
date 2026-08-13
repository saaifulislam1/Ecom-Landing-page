import { getCategories, getHomepageSettings, getProducts } from "@/lib/api";
import { HomePageSections } from "@/components/home/HomeSections";

export default async function HomePage() {
  const [products, categories, homepage] = await Promise.all([getProducts(), getCategories(), getHomepageSettings()]);

  return <HomePageSections products={products} categories={categories} homepage={homepage} />;
}
