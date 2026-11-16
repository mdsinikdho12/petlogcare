// src/components/dashboard/StatusBadge.tsx
import React from "react";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Info,
  ShieldCheck,
  Ban,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type StatusVariant =
  | "SUCCESS"
  | "PENDING"
  | "CRITICAL"
  | "INFO"
  | "NEUTRAL";

interface StatusBadgeProps {
  status: string;
  label?: string;
  variant?: StatusVariant;
  className?: string;
}

const statusMap: Record<
  string,
  { variant: StatusVariant; icon: React.ElementType; label: string }
> = {
  // Success / Approved / Completed (Emerald)
  CONFIRMED: { variant: "SUCCESS", icon: CheckCircle2, label: "Confirmed" },
  APPROVED: { variant: "SUCCESS", icon: ShieldCheck, label: "Approved" },
  COMPLETED: { variant: "SUCCESS", icon: CheckCircle2, label: "Completed" },
  ACTIVE: { variant: "SUCCESS", icon: CheckCircle2, label: "Active" },
  VALID: { variant: "SUCCESS", icon: CheckCircle2, label: "Valid" },
  PAID: { variant: "SUCCESS", icon: CheckCircle2, label: "Paid" },
  UP_TO_DATE: { variant: "SUCCESS", icon: CheckCircle2, label: "Up to date" },

  // Pending / Held / In Progress (Amber)
  PENDING: { variant: "PENDING", icon: Clock, label: "Pending" },
  PENDING_PAYMENT: { variant: "PENDING", icon: Clock, label: "Payment pending" },
  IN_PROGRESS: { variant: "PENDING", icon: Clock, label: "In progress" },
  EXPIRING_SOON: { variant: "PENDING", icon: AlertCircle, label: "Expiring soon" },
  HELD: { variant: "PENDING", icon: Clock, label: "On hold" },

  // Critical / Cancelled / Rejected (Rose)
  CANCELLED: { variant: "CRITICAL", icon: XCircle, label: "Cancelled" },
  REJECTED: { variant: "CRITICAL", icon: XCircle, label: "Rejected" },
  EXPIRED: { variant: "CRITICAL", icon: Ban, label: "Expired" },
  DISPUTED: { variant: "CRITICAL", icon: AlertCircle, label: "Disputed" },
  NO_SHOW: { variant: "CRITICAL", icon: XCircle, label: "No show" },

  // Info / Upcoming (Sky)
  UPCOMING: { variant: "INFO", icon: Info, label: "Upcoming" },
  NEW: { variant: "INFO", icon: Info, label: "New" },
};

const variantStyles: Record<StatusVariant, { badge: string; icon: string }> = {
  SUCCESS: {
    badge: "border-emerald-200/80 bg-emerald-50 text-emerald-700",
    icon: "text-emerald-600",
  },
  PENDING: {
    badge: "border-amber-200/80 bg-amber-50 text-amber-800",
    icon: "text-amber-600",
  },
  CRITICAL: {
    badge: "border-rose-200/80 bg-rose-50 text-rose-700",
    icon: "text-rose-600",
  },
  INFO: {
    badge: "border-sky-200/80 bg-sky-50 text-[#0D8BE0]",
    icon: "text-[#0D8BE0]",
  },
  NEUTRAL: {
    badge: "border-slate-200 bg-slate-50 text-[#06395F]/75",
    icon: "text-[#06395F]/60",
  },
};

export default function StatusBadge({
  status,
  label,
  variant,
  className,
}: StatusBadgeProps) {
  const normalized = status.toUpperCase().replace(/\s+/g, "_");
  const config = statusMap[normalized] || {
    variant: variant || "NEUTRAL",
    icon: Info,
    label: status.replace(/_/g, " "),
  };

  const activeVariant = variant || config.variant;
  const styles = variantStyles[activeVariant];
  const Icon = config.icon;
  const displayText = label || config.label;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-[8px] border px-2 py-0.5 text-[12px] font-medium leading-none select-none",
        styles.badge,
        className
      )}
    >
      <Icon className={cn("h-3.5 w-3.5 shrink-0", styles.icon)} aria-hidden="true" />
      <span className="whitespace-nowrap">{displayText}</span>
    </span>
  );
}
