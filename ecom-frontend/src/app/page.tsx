import { getCategories, getHomepageSettings, getProducts, getStore } from "@/lib/api";
import { HomePageSections } from "@/components/home/HomeSections";

export default async function HomePage() {
  const [products, categories, homepage, store] = await Promise.all([getProducts(), getCategories(), getHomepageSettings(), getStore()]);

  return <HomePageSections products={products} categories={categories} homepage={homepage} store={store} />;
}
