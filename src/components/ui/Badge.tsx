import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "brand" | "success" | "warning" | "danger" | "muted";
  className?: string;
}

const variantStyles = {
  brand: "bg-brand-50 text-brand-700 border-brand-200",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  danger: "bg-rose-50 text-rose-700 border-rose-200",
  muted: "bg-surface-100 text-text-secondary border-surface-200",
};

export function Badge({ children, variant = "brand", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
