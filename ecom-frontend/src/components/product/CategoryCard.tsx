import Link from "next/link";
import { FiArrowRight, FiGrid } from "react-icons/fi";
import { Category } from "@/types";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative min-h-56 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] transition duration-300 hover:-translate-y-1 hover:border-[var(--color-secondary)]/40 hover:shadow-[var(--shadow-card-hover)]"
    >
      <img src={category.image} alt={category.name} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/5" />
      <div className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-[var(--color-primary)] shadow-md">
        <FiGrid aria-hidden="true" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        <h3 className="text-xl font-extrabold">{category.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm leading-6 text-white/85">{category.description}</p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold transition group-hover:gap-3">
          Shop category <FiArrowRight aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
