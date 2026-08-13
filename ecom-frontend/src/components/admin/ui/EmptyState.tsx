import { FiInbox } from "react-icons/fi";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-dashed border-[#CBD5E1] bg-white p-10 text-center">
      <FiInbox className="mx-auto h-10 w-10 text-[#64748B]" aria-hidden="true" />
      <h2 className="mt-4 text-lg font-bold text-[#0F172A]">{title}</h2>
      <p className="mt-2 text-sm text-[#64748B]">{description}</p>
    </div>
  );
}
