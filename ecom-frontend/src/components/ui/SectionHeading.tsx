export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8 max-w-2xl">
      {eyebrow ? <p className="mb-2 text-sm font-bold uppercase tracking-wide text-[var(--color-secondary)]">{eyebrow}</p> : null}
      <h2 className="text-2xl font-extrabold leading-tight text-[var(--color-text)] md:text-4xl">{title}</h2>
      {description ? <p className="mt-3 text-sm leading-6 text-[var(--color-muted)] md:text-base">{description}</p> : null}
    </div>
  );
}
