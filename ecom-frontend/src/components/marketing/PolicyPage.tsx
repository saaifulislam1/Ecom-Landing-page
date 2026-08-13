export function PolicyPage({ title, sections }: { title: string; sections: string[] }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-8">
        <h1 className="text-3xl font-black">{title}</h1>
        <div className="mt-6 space-y-4 text-sm leading-7 text-[var(--color-muted)]">
          {sections.map((section) => <p key={section}>{section}</p>)}
        </div>
      </div>
    </div>
  );
}
