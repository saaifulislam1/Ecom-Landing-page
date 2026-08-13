export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex min-w-0 flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#2563EB]">Admin</p>
        <h1 className="mt-1 break-words text-2xl font-black leading-tight text-[#0F172A] sm:text-3xl">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">{description}</p> : null}
      </div>
      {actions ? <div className="grid w-full gap-2 sm:flex sm:w-auto sm:flex-wrap xl:justify-end">{actions}</div> : null}
    </div>
  );
}
