import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

export function RatingStars({ rating, count }: { rating: number; count?: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="flex items-center gap-0.5 text-[var(--color-accent)]" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, index) => {
          if (index < full) return <FaStar key={index} aria-hidden="true" />;
          if (index === full && hasHalf) return <FaStarHalfAlt key={index} aria-hidden="true" />;
          return <FaRegStar key={index} aria-hidden="true" />;
        })}
      </span>
      <span className="text-[var(--color-muted)]">
        {rating.toFixed(1)}
        {count ? ` (${count})` : ""}
      </span>
    </div>
  );
}
