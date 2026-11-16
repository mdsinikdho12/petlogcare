// src/components/dashboard/EmptyState.tsx
import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: React.ElementType;
  };
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const ActionIcon = action?.icon || Plus;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[2rem] border border-white/70 bg-white/45 p-8 sm:p-12 text-center",
        "shadow-[0_10px_40px_rgba(1,95,160,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]",
        "backdrop-blur-2xl backdrop-saturate-150",
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-200/60 bg-sky-500/15 text-[#0D8BE0] shadow-sm mb-4">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </div>

      <h3 className="font-display text-base sm:text-lg font-bold tracking-tight text-[#06395F]">
        {title}
      </h3>

      <p className="mt-1.5 max-w-sm text-xs sm:text-sm font-light leading-relaxed text-[#0B4C7A]/75">
        {description}
      </p>

      {action && (
        <div className="mt-5">
          {action.href ? (
            <Link
              href={action.href}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] px-5 py-2.5 text-xs font-semibold text-white shadow-[0_6px_20px_rgba(13,150,230,0.35),inset_0_1px_0_rgba(255,255,255,0.5)] transition hover:-translate-y-0.5 active:translate-y-0"
            >
              <ActionIcon className="h-4 w-4" />
              <span>{action.label}</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={action.onClick}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] px-5 py-2.5 text-xs font-semibold text-white shadow-[0_6px_20px_rgba(13,150,230,0.35),inset_0_1px_0_rgba(255,255,255,0.5)] transition hover:-translate-y-0.5 active:translate-y-0"
            >
              <ActionIcon className="h-4 w-4" />
              <span>{action.label}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
