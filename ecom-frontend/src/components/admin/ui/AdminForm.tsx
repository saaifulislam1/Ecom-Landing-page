import { cx } from "@/lib/format";
import { Children, isValidElement } from "react";

export function FormInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cx("h-10 w-full rounded-md border border-[#E2E8F0] bg-white px-3 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100", props.className)} />;
}

export function FormTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cx("min-h-28 w-full rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100", props.className)} />;
}

export function FormSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cx("h-10 w-full cursor-pointer rounded-md border border-[#E2E8F0] bg-white px-3 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100", props.className)} />;
}

export function FormToggle({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-md border border-[#E2E8F0] bg-white p-3 text-sm font-medium">
      {label}
      <input type="checkbox" defaultChecked={defaultChecked} className="h-5 w-5 cursor-pointer accent-[#2563EB]" />
    </label>
  );
}

export function FormCheckbox({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-[#0F172A]">
      <input type="checkbox" defaultChecked={defaultChecked} className="h-4 w-4 cursor-pointer accent-[#2563EB]" />
      {label}
    </label>
  );
}

export function Field({ label, children, required = false }: { label: string; children: React.ReactNode; required?: boolean }) {
  const hasRequiredChild = Children.toArray(children).some((child) => isValidElement<{ required?: boolean }>(child) && Boolean(child.props.required));
  const showRequired = required || hasRequiredChild;
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#0F172A]">
      <span>{label}{showRequired ? <span className="ml-1 text-red-600" aria-label="required">*</span> : null}</span>
      {children}
    </label>
  );
}

export function ImageUploadPlaceholder({ label = "Upload image" }: { label?: string }) {
  return (
    <div className="grid min-h-32 place-items-center rounded-lg border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-6 text-center text-sm text-[#64748B]">
      <span>{label}</span>
    </div>
  );
}
