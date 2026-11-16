import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  CONFIRMED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
  COMPLETED: "bg-sky-50 text-sky-700 border-sky-200",
  PENDING_PAYMENT: "bg-amber-50 text-amber-700 border-amber-200",
  CANCELLED: "bg-slate-100 text-slate-600 border-slate-200",
  DISPUTED: "bg-rose-50 text-rose-700 border-rose-200",
  NO_SHOW: "bg-rose-50 text-rose-700 border-rose-200",
  APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
  VALID: "bg-emerald-50 text-emerald-700 border-emerald-200",
  EXPIRING_SOON: "bg-amber-50 text-amber-700 border-amber-200",
  EXPIRED: "bg-rose-50 text-rose-700 border-rose-200",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status.toUpperCase().replace(/\s+/g, "_");
  const style = statusStyles[normalized] || "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        style,
        className
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
