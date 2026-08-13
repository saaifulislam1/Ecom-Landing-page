import Link from "next/link";
import { cx } from "@/lib/format";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost";
};

const variants = {
  primary: "bg-[var(--color-primary)] text-white shadow-[0_12px_28px_rgba(17,24,39,0.18)] hover:-translate-y-0.5 hover:bg-[var(--color-secondary)] hover:shadow-[0_16px_36px_rgba(4,120,87,0.22)] active:translate-y-0 active:shadow-none disabled:hover:translate-y-0",
  secondary: "bg-[var(--color-secondary)] text-white shadow-[0_12px_28px_rgba(4,120,87,0.18)] hover:-translate-y-0.5 hover:brightness-95 active:translate-y-0 active:shadow-none disabled:hover:translate-y-0",
  outline: "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:shadow-[0_12px_28px_rgba(17,24,39,0.08)] active:translate-y-0 disabled:hover:translate-y-0",
  ghost: "text-[var(--color-text)] hover:bg-[var(--color-soft)] active:bg-[var(--color-border)]",
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cx(
        "inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

export function ButtonLink({
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
    <Link
      href={href}
      className={cx(
        "inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition",
        variants[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}
