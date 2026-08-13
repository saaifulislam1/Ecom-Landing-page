import Link from "next/link";
import { cx } from "@/lib/format";

const variants = {
  primary: "bg-[#2563EB] text-white hover:bg-blue-700",
  secondary: "bg-[#0F172A] text-white hover:bg-slate-800",
  outline: "border border-[#E2E8F0] bg-white text-[#0F172A] hover:border-[#2563EB]",
  ghost: "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]",
  danger: "bg-[#EF4444] text-white hover:bg-red-600",
};

export function AdminButton({
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof variants }) {
  return (
    <button
      className={cx("inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold leading-tight transition disabled:cursor-not-allowed disabled:opacity-50", variants[variant], className)}
      {...props}
    />
  );
}

export function AdminButtonLink({
  href,
  className,
  variant = "primary",
  children,
}: {
  href: string;
  className?: string;
  variant?: keyof typeof variants;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={cx("inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold leading-tight transition", variants[variant], className)}>
      {children}
    </Link>
  );
}
