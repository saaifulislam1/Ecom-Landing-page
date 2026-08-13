import { notFound } from "next/navigation";
import { FiPackage, FiRefreshCw, FiTruck } from "react-icons/fi";
import { getProduct, getProducts } from "@/lib/api";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductActions } from "@/components/product/ProductActions";
import { RatingStars } from "@/components/ui/RatingStars";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductMetaTracker } from "@/components/product/ProductMetaTracker";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SocialShare } from "@/components/product/SocialShare";
import { formatCurrency } from "@/lib/format";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, products] = await Promise.all([getProduct(slug), getProducts()]);
  if (!product) notFound();
  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 pb-28 sm:px-6 md:pb-10 lg:px-8">
      <ProductMetaTracker product={product} />
      <Breadcrumb items={[{ label: "Products", href: "/products" }, { label: product.title }]} />
      <div className="grid gap-8 lg:grid-cols-2">
        <ProductGallery images={product.images} title={product.title} />
        <section className="space-y-5">
          <p className="text-sm font-bold uppercase text-[var(--color-primary)]">{product.category}</p>
          <h1 className="text-3xl font-black md:text-4xl">{product.title}</h1>
          <RatingStars rating={product.rating} count={product.reviewCount} />
          <div className="flex items-end gap-3">
            <span className="text-3xl font-black">{formatCurrency(product.salePrice ?? product.price)}</span>
            {product.salePrice ? <span className="text-lg text-[var(--color-muted)] line-through">{formatCurrency(product.price)}</span> : null}
          </div>
          <p className="leading-7 text-[var(--color-muted)]">{product.description}</p>
          <ProductActions product={product} />
          <div className="grid gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm">
            <p className="flex items-center gap-2"><FiPackage className="text-[var(--color-primary)]" aria-hidden="true" /><strong>Stock:</strong> {product.stock > 0 ? `${product.stock} items available` : "Out of stock"}</p>
            <p className="flex items-center gap-2"><FiTruck className="text-[var(--color-primary)]" aria-hidden="true" /><strong>Delivery:</strong> Inside city 1-2 days, outside city 3-5 days.</p>
            <p className="flex items-center gap-2"><FiRefreshCw className="text-[var(--color-primary)]" aria-hidden="true" /><strong>Returns:</strong> Refund or exchange requests accepted within 7 days for eligible products.</p>
          </div>
          <div>
            <p className="mb-2 text-sm font-bold">Share this product</p>
            <SocialShare title={product.title} />
          </div>
        </section>
      </div>
      {related.length ? (
        <section className="mt-16">
          <SectionHeading title="Related products" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => <ProductCard key={item.id} product={item} />)}
          </div>
        </section>
      ) : null}
    </div>
  );
}
