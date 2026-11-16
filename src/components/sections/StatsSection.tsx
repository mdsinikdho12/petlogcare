"use client";

import { PawPrint, Stethoscope, Award, Star } from "lucide-react";
import { useInView } from "@/lib/hooks/useInView";
import { cn } from "@/lib/utils";

const stats = [
  { number: "8,000+", label: "Happy patients", icon: PawPrint, tint: "bg-sky-500/15 text-sky-600" },
  { number: "15+", label: "Expert veterinarians", icon: Stethoscope, tint: "bg-emerald-500/15 text-emerald-600" },
  { number: "12", label: "Years of excellence", icon: Award, tint: "bg-violet-500/15 text-violet-600" },
  { number: "4.9", label: "Average rating", icon: Star, tint: "bg-amber-500/20 text-amber-600" },
];

export default function StatsSection() {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative isolate overflow-hidden bg-gradient-to-b from-[#DCEEFF] to-[#F6FAFF] py-16 sm:py-20"
    >
      {/* Colour behind the glass */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-[#9EE7FF]/50 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-[#FFD6E8]/50 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* One glass panel, four stats, hairline dividers on desktop */}
        <dl
          className={cn(
            "grid grid-cols-2 gap-y-8 rounded-[2.5rem] border border-white/70 bg-white/45 px-4 py-8 shadow-[0_10px_40px_rgba(1,95,160,0.10),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-2xl backdrop-saturate-150 sm:px-6 sm:py-10 lg:grid-cols-4 lg:gap-y-0",
            isInView ? "animate-fade-up" : "opacity-0"
          )}
        >
          {stats.map(({ number, label, icon: Icon, tint }) => (
            <div
              key={label}
              className="flex flex-col items-center px-2 text-center lg:border-l lg:border-[#06395F]/10 lg:first:border-l-0"
            >
              <span className={cn("mb-3 flex h-10 w-10 items-center justify-center rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]", tint)}>
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <dd className="font-display text-4xl font-bold tracking-tight text-[#06395F] sm:text-5xl">
                {number}
              </dd>
              <dt className="mt-1 text-sm text-[#0B4C7A]/75">{label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}