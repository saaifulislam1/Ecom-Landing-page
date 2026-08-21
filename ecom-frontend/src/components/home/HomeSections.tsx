import Link from "next/link";
import {
  FiArrowRight,
  FiCheckCircle,
  FiCreditCard,
  FiHeadphones,
  FiPackage,
  FiRefreshCw,
  FiShield,
  FiShoppingBag,
  FiStar,
  FiTruck,
} from "react-icons/fi";
import { ButtonLink } from "@/components/ui/Button";
import { CategoryCard } from "@/components/product/CategoryCard";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Newsletter } from "@/components/marketing/Newsletter";
import { BackendStore, HomepageSettings } from "@/lib/api";
import { Category, Product } from "@/types";

type HomeSectionProps = {
  products: Product[];
  categories: Category[];
  homepage: HomepageSettings | null;
  store: BackendStore | null;
};

const defaultHomepage: HomepageSettings = {
  heroEyebrow: "Trusted ecommerce storefront",
  heroTitle: "Shop premium essentials from a store built for modern customers.",
  heroSubtitle: "Discover curated products, clear pricing, fast checkout, and a shopping experience designed for trust from the first click.",
  heroImage: "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?auto=format&fit=crop&w=1800&q=85",
  primaryButtonLabel: "Shop collection",
  primaryButtonHref: "/products",
  secondaryButtonLabel: "Browse categories",
  secondaryButtonHref: "/categories",
  categoryEyebrow: "Shop by category",
  categoryTitle: "Find the right products faster",
  categoryDescription: "Organized storefront categories help shoppers move from discovery to checkout without friction.",
  featuredEyebrow: "Featured products",
  featuredTitle: "Customer-ready products with real shopping actions",
  featuredDescription: "Every product card includes image, price, rating, stock signal, badge support, and add-to-cart behavior.",
  benefitsEyebrow: "Why customers buy",
  benefitsTitle: "Built for trust, clarity, and repeat orders",
  benefitsDescription: "A polished ecommerce homepage should guide shoppers, answer objections, and make the next step obvious.",
  promoEyebrow: "Seasonal offer",
  promoTitle: "Give shoppers a clear reason to buy today.",
  promoDescription: "Use this campaign space for discounts, bundles, free shipping thresholds, product launches, or limited collections.",
  promoImage: "",
  promoButtonLabel: "Shop the offer",
  promoButtonHref: "/products",
  bestSellersEyebrow: "Best sellers",
  bestSellersTitle: "Products shoppers are most likely to explore",
  bestSellersDescription: "Highlight proven items, sale products, or manually curated recommendations to increase conversion.",
  videoGalleryEnabled: false,
  videoGalleryTitle: "Video Gallery",
  videoGalleryDescription: "",
  videoGalleryItems: [],
  posterGalleryEnabled: false,
  posterGalleryTitle: "Poster Gallery",
  posterGalleryDescription: "",
  posterGalleryItems: [],
  testimonialsEyebrow: "Customer proof",
  testimonialsTitle: "A store experience that feels dependable",
  testimonialsDescription: "Use reviews to reinforce trust before shoppers reach checkout.",
  testimonials: [
    {
      name: "Nadia Rahman",
      role: "Boutique customer",
      quote: "The products were easy to browse, the checkout felt clear, and the delivery updates made the order feel reliable.",
      rating: 5,
      image: "",
    },
    {
      name: "Arif Hossain",
      role: "Repeat shopper",
      quote: "The store feels organized and trustworthy. I can find categories fast and compare products without extra noise.",
      rating: 5,
      image: "",
    },
    {
      name: "Maya Chowdhury",
      role: "Small business buyer",
      quote: "The product cards show the details I need immediately: price, rating, stock, and a direct add-to-cart action.",
      rating: 5,
      image: "",
    },
  ],
  newsletterEyebrow: "Member offers",
  newsletterTitle: "Get new arrivals and private offers first",
  newsletterDescription: "Join the store list for product drops, seasonal campaigns, and curated shopping ideas.",
  newsletterButtonLabel: "Subscribe",
};

const benefits = [
  {
    title: "Curated products",
    description: "Shop a focused catalog selected for quality, everyday use, and reliable availability.",
    icon: FiPackage,
  },
  {
    title: "Simple checkout",
    description: "A clear cart and checkout flow helps customers place orders quickly on any device.",
    icon: FiShoppingBag,
  },
  {
    title: "Owner-managed catalog",
    description: "Products, categories, prices, and promotions are managed from the admin dashboard.",
    icon: FiCheckCircle,
  },
];

const trustItems = [
  { title: "Secure payment", description: "Checkout-ready order flow", icon: FiCreditCard },
  { title: "Fast delivery", description: "Clear delivery expectations", icon: FiTruck },
  { title: "Easy returns", description: "Customer-friendly policies", icon: FiRefreshCw },
  { title: "Support", description: "Help when shoppers need it", icon: FiHeadphones },
];

function fallbackFeatured(products: Product[]) {
  const featured = products.filter((product) => product.featured);
  return (featured.length ? featured : products).slice(0, 4);
}

function fallbackBestSellers(products: Product[]) {
  const bestSellers = products.filter((product) => product.bestSeller);
  return (bestSellers.length ? bestSellers : products).slice(0, 4);
}

export function HomePageSections({ products, categories, homepage, store }: HomeSectionProps) {
  const content = homepage ?? defaultHomepage;
  const featured = fallbackFeatured(products);
  const bestSellers = fallbackBestSellers(products);
  const heroProduct = featured[0] ?? products[0];
  const heroCategories = categories.slice(0, 3);

  return (
    <>
      <HeroSection content={content} categoryCount={categories.length} productCount={products.length} />
      <TrustBar />
      <CategoryShowcase categories={heroCategories} content={content} />
      <FeaturedProducts products={featured} content={content} />
      <BenefitsSection content={content} />
      <PromoBanner product={bestSellers[0] ?? heroProduct} content={content} />
      <VideoGallerySection content={content} />
      <PosterGallerySection content={content} />
      <BestSellingProducts products={bestSellers} content={content} />
      <TestimonialsSection content={content} />
      <Newsletter content={content} supportEmail={store?.email} />
    </>
  );
}

function HeroSection({
  content,
  categoryCount,
  productCount,
}: {
  content: HomepageSettings;
  categoryCount: number;
  productCount: number;
}) {
  return (
    <section className="relative min-h-[620px] overflow-hidden bg-[var(--color-primary)] text-white">
      <img src={content.heroImage} alt="Premium ecommerce shopping display" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

      <div className="relative mx-auto flex min-h-[620px] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white/85 backdrop-blur">
            <FiShield aria-hidden="true" />
            {content.heroEyebrow}
          </p>
          <h1 className="mt-6 text-4xl font-black leading-[1.03] text-white sm:text-5xl lg:text-7xl">
            {content.heroTitle}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/82 md:text-lg">
            {content.heroSubtitle}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={content.primaryButtonHref} variant="secondary" className="h-12 px-6">
              {content.primaryButtonLabel} <FiArrowRight aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href={content.secondaryButtonHref} variant="outline" className="h-12 border-white/25 bg-white/10 px-6 text-white backdrop-blur hover:border-white/50 hover:bg-white/15">
              {content.secondaryButtonLabel}
            </ButtonLink>
          </div>
          <div className="mt-12 grid max-w-2xl grid-cols-3 gap-3">
            {[
              { value: `${productCount}+`, label: "Products" },
              { value: `${categoryCount}`, label: "Categories" },
              { value: "4.8", label: "Avg. rating" },
            ].map((item) => (
              <div key={item.label} className="border-l border-white/25 pl-4 first:border-l-0 first:pl-0">
                <p className="text-2xl font-black text-white md:text-3xl">{item.value}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-white/65">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  return (
    <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {trustItems.map((item) => (
          <div key={item.title} className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--color-soft)] text-[var(--color-secondary)]">
              <item.icon aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-[var(--color-text)]">{item.title}</h2>
              <p className="text-xs text-[var(--color-muted)]">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CategoryShowcase({ categories, content }: { categories: Category[]; content: HomepageSettings }) {
  if (!categories.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow={content.categoryEyebrow}
          title={content.categoryTitle}
          description={content.categoryDescription}
        />
        <Link href="/categories" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[var(--color-secondary)] transition hover:gap-3">
          View all categories <FiArrowRight aria-hidden="true" />
        </Link>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => <CategoryCard key={category.id} category={category} />)}
      </div>
    </section>
  );
}

function FeaturedProducts({ products, content }: { products: Product[]; content: HomepageSettings }) {
  if (!products.length) return null;

  return (
    <section className="bg-[var(--color-surface)] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow={content.featuredEyebrow}
            title={content.featuredTitle}
            description={content.featuredDescription}
          />
          <Link href="/products" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[var(--color-secondary)] transition hover:gap-3">
            View all products <FiArrowRight aria-hidden="true" />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </section>
  );
}

function BenefitsSection({ content }: { content: HomepageSettings }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow={content.benefitsEyebrow}
        title={content.benefitsTitle}
        description={content.benefitsDescription}
      />
      <div className="grid gap-5 md:grid-cols-3">
        {benefits.map((item) => (
          <article key={item.title} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card)]">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--color-soft)] text-[var(--color-secondary)]">
              <item.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-lg font-extrabold">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function PromoBanner({ product, content }: { product?: Product; content: HomepageSettings }) {
  const promoImage = content.promoImage || product?.images[0];

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-lg bg-[var(--color-primary)] text-white shadow-[var(--shadow-card-hover)] md:grid md:grid-cols-[1fr_420px]">
        <div className="p-8 md:p-12">
          <p className="text-sm font-bold uppercase tracking-wide text-white/60">{content.promoEyebrow}</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-black leading-tight md:text-4xl">{content.promoTitle}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75">
            {content.promoDescription}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={content.promoButtonHref} variant="secondary" className="h-12 px-6">
              {content.promoButtonLabel} <FiArrowRight aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/cart" variant="outline" className="h-12 border-white/20 bg-white/10 px-6 text-white hover:border-white/40 hover:bg-white/15">
              View cart
            </ButtonLink>
          </div>
        </div>
        <div className="relative min-h-72 bg-black/10">
          {promoImage ? <img src={promoImage} alt={content.promoTitle} className="absolute inset-0 h-full w-full object-cover" /> : null}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/20 to-transparent" />
        </div>
      </div>
    </section>
  );
}

function VideoGallerySection({ content }: { content: HomepageSettings }) {
  const videos = content.videoGalleryItems?.filter((item) => item.embedUrl?.trim()) ?? [];
  if (!content.videoGalleryEnabled || !videos.length) return null;

  return (
    <section className="bg-[var(--color-surface)] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={content.videoGalleryTitle || "Video Gallery"}
          description={content.videoGalleryDescription || undefined}
        />
        <div className="grid gap-5 md:grid-cols-2">
          {videos.slice(0, 4).map((video, index) => (
            <article key={`${video.embedUrl}-${index}`} className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-black shadow-[var(--shadow-card)]">
              <div className="aspect-video">
                <iframe
                  src={toEmbedUrl(video.embedUrl)}
                  title={video.title || `Video ${index + 1}`}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
              {video.title ? <h3 className="bg-[var(--color-surface)] px-4 py-3 text-sm font-bold text-[var(--color-text)]">{video.title}</h3> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PosterGallerySection({ content }: { content: HomepageSettings }) {
  const posters = content.posterGalleryItems?.filter((item) => item.imageUrl?.trim()) ?? [];
  if (!content.posterGalleryEnabled || !posters.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        title={content.posterGalleryTitle || "Poster Gallery"}
        description={content.posterGalleryDescription || undefined}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {posters.slice(0, 4).map((poster, index) => {
          const image = (
            <img
              src={poster.imageUrl}
              alt={poster.title || `Poster ${index + 1}`}
              className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]"
            />
          );
          return (
            <article key={`${poster.imageUrl}-${index}`} className={`${index === 1 ? "lg:row-span-2" : ""} overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]`}>
              <div className={index === 1 ? "aspect-[4/5] lg:h-full" : "aspect-[16/10]"}>
                {poster.linkUrl ? (
                  <a href={poster.linkUrl} target={poster.linkUrl.startsWith("http") ? "_blank" : undefined} rel={poster.linkUrl.startsWith("http") ? "noreferrer" : undefined}>
                    {image}
                  </a>
                ) : image}
              </div>
              {poster.title ? <h3 className="px-4 py-3 text-sm font-bold">{poster.title}</h3> : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function toEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (parsed.hostname === "youtu.be") {
      return `https://www.youtube.com/embed/${parsed.pathname.replace("/", "")}`;
    }
  } catch {
    return url;
  }
  return url;
}

function BestSellingProducts({ products, content }: { products: Product[]; content: HomepageSettings }) {
  if (!products.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow={content.bestSellersEyebrow}
        title={content.bestSellersTitle}
        description={content.bestSellersDescription}
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </section>
  );
}

function TestimonialsSection({ content }: { content: HomepageSettings }) {
  const testimonials = content.testimonials?.filter((testimonial) => testimonial.name && testimonial.quote) ?? [];
  if (!testimonials.length) return null;
  const useCarousel = testimonials.length > 3;

  return (
    <section className="bg-[var(--color-surface)] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={content.testimonialsEyebrow}
          title={content.testimonialsTitle}
          description={content.testimonialsDescription}
        />
        <div
          className={
            useCarousel
              ? "-mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-4 [scrollbar-width:thin] sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
              : "grid gap-5 md:grid-cols-3"
          }
        >
          {testimonials.map((testimonial) => (
            <figure
              key={`${testimonial.name}-${testimonial.quote}`}
              className={`${useCarousel ? "w-[85%] shrink-0 snap-start sm:w-[420px]" : ""} rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card)]`}
            >
              <div className="mb-4 flex gap-1 text-[var(--color-accent)]">
                {Array.from({ length: Math.max(1, Math.min(5, testimonial.rating ?? 5)) }).map((_, index) => <FiStar key={index} className="fill-current" aria-hidden="true" />)}
              </div>
              <blockquote className="text-sm leading-7 text-[var(--color-muted)]">&ldquo;{testimonial.quote}&rdquo;</blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-[var(--color-border)] pt-4">
                {testimonial.image ? (
                  <img src={testimonial.image} alt={testimonial.name} className="h-11 w-11 rounded-full object-cover" />
                ) : (
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-[var(--color-soft)] text-sm font-black text-[var(--color-secondary)]">
                    {testimonial.name.slice(0, 1)}
                  </span>
                )}
                <span>
                  <p className="font-extrabold text-[var(--color-text)]">{testimonial.name}</p>
                  {testimonial.role ? <p className="text-xs font-semibold text-[var(--color-muted)]">{testimonial.role}</p> : null}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
