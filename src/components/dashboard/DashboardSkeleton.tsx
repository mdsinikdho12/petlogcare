// src/components/dashboard/DashboardSkeleton.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[11px] bg-white/60 border border-white/60",
        className
      )}
      aria-hidden="true"
    />
  );
}

export function StatCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-12 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="col-span-12 sm:col-span-6 xl:col-span-3 rounded-[13px] border border-[#06395F]/10 bg-white/85 p-5 min-h-[148px] shadow-[0_1px_2px_rgba(6,57,95,0.06)]"
        >
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-8 w-8 rounded-[11px]" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="my-4 flex items-baseline justify-between">
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-5 w-16 rounded-[8px]" />
          </div>
          <div className="pt-2 border-t border-[#06395F]/10 flex items-center justify-between">
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function BentoHeroSkeleton() {
  return (
    <div className="col-span-12 xl:col-span-8 rounded-[13px] border border-white/80 bg-white/55 p-6 backdrop-blur-xl shadow-[0_8px_30px_rgba(1,95,160,0.10)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-3">
          <Skeleton className="h-6 w-40 rounded-[8px]" />
          <Skeleton className="h-8 w-64 sm:w-80" />
          <Skeleton className="h-4 w-72 sm:w-96" />
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Skeleton className="h-9 w-28 rounded-[11px]" />
          <Skeleton className="h-9 w-36 rounded-[11px]" />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-[13px] border border-[#06395F]/10 bg-white/85 p-5 shadow-[0_1px_2px_rgba(6,57,95,0.06)] space-y-3">
      <div className="flex items-center justify-between pb-3 border-b border-[#06395F]/10">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-48 rounded-[11px]" />
      </div>
      <div className="space-y-2 pt-1">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-3 px-3 rounded-[11px] bg-white/50"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-36" />
                <Skeleton className="h-2.5 w-24" />
              </div>
            </div>
            <Skeleton className="h-6 w-20 rounded-[8px]" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
