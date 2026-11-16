// src/components/dashboard/StatCard.tsx
import React from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type TintColor =
  | "sky"
  | "indigo"
  | "emerald"
  | "rose"
  | "violet"
  | "amber";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  tint?: TintColor;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  badge?: React.ReactNode;
  href?: string;
  className?: string;
}

const tintStyles: Record<
  TintColor,
  { box: string; icon: string; border: string }
> = {
  sky: {
    box: "bg-sky-500/15",
    icon: "text-[#0D8BE0]",
    border: "border-sky-300/40",
  },
  indigo: {
    box: "bg-indigo-500/15",
    icon: "text-indigo-600",
    border: "border-indigo-300/40",
  },
  emerald: {
    box: "bg-emerald-500/15",
    icon: "text-emerald-600",
    border: "border-emerald-300/40",
  },
  rose: {
    box: "bg-rose-500/15",
    icon: "text-rose-600",
    border: "border-rose-300/40",
  },
  violet: {
    box: "bg-violet-500/15",
    icon: "text-violet-600",
    border: "border-violet-300/40",
  },
  amber: {
    box: "bg-amber-500/15",
    icon: "text-amber-600",
    border: "border-amber-300/40",
  },
};

/**
 * Format stat value so number is 28-32px and unit is baseline-aligned on the same line
 */
function renderStatValue(val: string | number) {
  if (typeof val === "number") {
    return (
      <span className="text-[28px] sm:text-[30px] font-bold tracking-tight text-[#06395F] tabular-nums leading-none">
        {val}
      </span>
    );
  }

  const str = String(val).trim();
  const match = str.match(/^(\d+)\s+([a-zA-Z]+)$/);
  if (match) {
    return (
      <div className="flex items-baseline leading-none whitespace-nowrap">
        <span className="text-[28px] sm:text-[30px] font-bold tracking-tight text-[#06395F] tabular-nums">
          {match[1]}
        </span>
        <span className="text-[14px] font-semibold text-[#06395F]/70 ml-1.5">
          {match[2]}
        </span>
      </div>
    );
  }

  // Non-numeric strings (e.g. "Tomorrow")
  return (
    <span className="text-[22px] sm:text-[24px] font-bold tracking-tight text-[#06395F] truncate leading-none">
      {str}
    </span>
  );
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  tint = "sky",
  trend,
  badge,
  href,
  className,
}: StatCardProps) {
  const currentTint = tintStyles[tint];

  const content = (
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-[13px] bg-white/85 p-4.5 sm:p-5",
        "border border-[#06395F]/10 shadow-[0_1px_2px_rgba(6,57,95,0.06)] min-h-[148px]",
        "transition-all duration-150",
        href && "hover:border-[#0D8BE0]/30 hover:-translate-y-0.5",
        className
      )}
    >
      {/* Top row: Icon tile top-left + Label */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-[11px] border transition-transform duration-150 group-hover:scale-105",
            currentTint.box,
            currentTint.border,
            currentTint.icon
          )}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </div>
        <span className="text-[13px] font-semibold text-[#06395F]/80 truncate">
          {title}
        </span>
      </div>

      {/* Center: Large tabular number and unclipped Badge */}
      <div className="my-2.5 flex flex-wrap items-center justify-between gap-2 min-w-0">
        <div className="min-w-0">{renderStatValue(value)}</div>
        {badge && <div className="shrink-0">{badge}</div>}
      </div>

      {/* Bottom row: Subtitle/Trend and quiet link */}
      <div className="flex items-center justify-between pt-2 border-t border-[#06395F]/10 text-[12px] min-w-0">
        {trend ? (
          <div className="flex items-center gap-1.5 font-semibold min-w-0">
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-[8px] px-1.5 py-0.5 text-[11px] shrink-0",
                trend.isPositive
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-rose-100 text-rose-800"
              )}
            >
              {trend.isPositive ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {trend.value}
            </span>
            {trend.label && (
              <span className="text-[#06395F]/60 font-medium truncate">
                {trend.label}
              </span>
            )}
          </div>
        ) : subtitle ? (
          <span className="text-[#06395F]/70 font-medium truncate">
            {subtitle}
          </span>
        ) : (
          <span />
        )}

        {href && (
          <span className="inline-flex items-center gap-1 font-semibold text-[#0D8BE0] opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all whitespace-nowrap shrink-0 ml-2">
            <span>View</span>
            <ArrowRight className="h-3 w-3" />
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0D8BE0] rounded-[13px]">
        {content}
      </Link>
    );
  }

  return content;
}
