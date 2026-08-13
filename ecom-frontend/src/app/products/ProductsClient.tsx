"use client";

import { useMemo, useState } from "react";
import { FiSearch, FiSliders } from "react-icons/fi";
import { Category, Product } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";
import { Input, Select } from "@/components/ui/FormControls";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export function ProductsClient({
  initialCategory,
  products,
  categories,
}: {
  initialCategory?: string;
  products: Product[];
  categories: Category[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory ?? "All");
  const [price, setPrice] = useState("all");
  const [sort, setSort] = useState("latest");

  const filtered = useMemo(() => {
    const result = products
      .filter((product) => product.title.toLowerCase().includes(query.toLowerCase()))
      .filter((product) => category === "All" || product.category === category)
      .filter((product) => {
        const value = product.salePrice ?? product.price;
        if (price === "under-1500") return value < 1500;
        if (price === "1500-3000") return value >= 1500 && value <= 3000;
        if (price === "over-3000") return value > 3000;
        return true;
      });

    return result.sort((a, b) => {
      if (sort === "price-low") return (a.salePrice ?? a.price) - (b.salePrice ?? b.price);
      if (sort === "price-high") return (b.salePrice ?? b.price) - (a.salePrice ?? a.price);
      if (sort === "best-selling") return Number(b.bestSeller) - Number(a.bestSeller);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [category, price, products, query, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeading title="Products" description="Search, filter, and sort products loaded from the seeded backend database." />
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 md:grid-cols-4">
        <div className="relative">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" aria-hidden="true" />
          <Input placeholder="Search products" value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" />
        </div>
        <Select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Category filter">
          <option>All</option>
          {categories.map((item) => <option key={item.id}>{item.name}</option>)}
        </Select>
        <Select value={price} onChange={(event) => setPrice(event.target.value)} aria-label="Price filter">
          <option value="all">All prices</option>
          <option value="under-1500">Under BDT 1,500</option>
          <option value="1500-3000">BDT 1,500 - 3,000</option>
          <option value="over-3000">Over BDT 3,000</option>
        </Select>
        <Select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products">
          <option value="latest">Latest</option>
          <option value="price-low">Price Low to High</option>
          <option value="price-high">Price High to Low</option>
          <option value="best-selling">Best Selling</option>
        </Select>
      </div>

      {filtered.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center">
          <FiSliders className="mx-auto mb-3 h-8 w-8 text-[var(--color-muted)]" aria-hidden="true" />
          <h2 className="text-xl font-bold">No products found</h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">Try clearing filters or searching another product name.</p>
          <Button className="mt-5" onClick={() => { setQuery(""); setCategory("All"); setPrice("all"); setSort("latest"); }}>
            Reset filters
          </Button>
        </div>
      )}
    </div>
  );
}
