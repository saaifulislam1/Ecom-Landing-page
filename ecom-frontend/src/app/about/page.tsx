import { SectionHeading } from "@/components/ui/SectionHeading";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 md:grid-cols-2 md:items-center">
        <div>
          <SectionHeading title="A storefront built for modern entrepreneurs" description="PlugCommerce is a customer-facing storefront with clean sections, reusable commerce components, backend data, and admin-controlled theme settings." />
          <p className="leading-7 text-[var(--color-muted)]">
            Products, categories, orders, customers, coupons, storefront settings, and homepage content are served from the backend so store owners can manage the commerce experience from one dashboard.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?auto=format&fit=crop&w=1400&q=80"
          alt="Store team packing products"
          className="h-96 w-full rounded-lg object-cover"
        />
      </div>
      <section className="mt-14">
        <SectionHeading title="Brand values" />
        <div className="grid gap-4 md:grid-cols-3">
          {["Trustworthy checkout", "Clear product discovery", "Flexible storefront themes"].map((value) => (
            <div key={value} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <h2 className="font-bold">{value}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">Designed as a practical SaaS frontend foundation rather than a one-off shop template.</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
