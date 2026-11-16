"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Play,
  ArrowRight,
  FlaskConical,
  Sparkles,
  Radio,
  HeartPulse,
  PhoneCall,
  type LucideIcon,
} from "lucide-react";
import { useInView } from "@/lib/hooks/useInView";
import { cn } from "@/lib/utils";

type Feature = {
  label: string;
  desc: string;
  icon: LucideIcon;
  tint: string;
};

const clinicFeatures: Feature[] = [
  {
    label: "Advanced lab diagnostics",
    desc: "In-house blood analyzers & PCR express testing",
    icon: FlaskConical,
    tint: "bg-sky-500/15 text-sky-600",
  },
  {
    label: "Sterile surgical suite",
    desc: "HEPA filtered with modern inhalation anesthesia",
    icon: Sparkles,
    tint: "bg-indigo-500/15 text-indigo-600",
  },
  {
    label: "High-definition digital X-ray",
    desc: "Ultra-low dose imaging with instant radiologist review",
    icon: Radio,
    tint: "bg-cyan-500/15 text-cyan-600",
  },
  {
    label: "ICU & calm recovery ward",
    desc: "Sound-isolated suites with 24/7 vital telemetry",
    icon: HeartPulse,
    tint: "bg-rose-500/15 text-rose-500",
  },
  {
    label: "24/7 emergency hotline",
    desc: "Direct on-call veterinary trauma response team",
    icon: PhoneCall,
    tint: "bg-amber-500/15 text-amber-600",
  },
];

/* Apple liquid glass recipe */
const glass =
  "border border-white/70 bg-white/45 backdrop-blur-2xl backdrop-saturate-150 " +
  "shadow-[0_10px_40px_rgba(1,95,160,0.12),inset_0_1px_0_rgba(255,255,255,0.9)]";

const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D96E6] focus-visible:ring-offset-2";

export default function ClinicSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section
      id="clinic"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative isolate overflow-hidden bg-gradient-to-b from-[#F6FAFF] via-[#E8F4FF] to-[#DCEEFF] py-24 sm:py-28"
    >
      {/* Blurred colour blobs behind glass */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-[#9EE7FF]/55 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-[#FFD6E8]/50 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 h-80 w-80 rounded-full bg-[#FFF1C9]/60 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Header */}
        <div
          className={cn(
            "mx-auto mb-14 max-w-2xl text-center",
            isInView ? "animate-fade-up" : "opacity-0"
          )}
        >
          <h2 className="font-display text-balance text-4xl font-bold tracking-tight text-[#06395F] sm:text-5xl">
            Modern equipment, gentle care from day one
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-[#0B4C7A]/75">
            Designed to feel calm and reassuring for pets, with clinical precision you can rely on.
          </p>
        </div>

        {/* Video & Facility Tour Glass Showcase */}
        <div
          className={cn(
            "relative overflow-hidden rounded-[2.5rem] p-3 sm:p-4 transition duration-300",
            glass,
            isInView ? "animate-fade-up motion-reduce:animate-none" : "opacity-0"
          )}
        >
          <div className="relative aspect-[16/9] max-h-[520px] w-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-sky-100 to-sky-300">
            <Image
              src="/images/puppy.png"
              alt="PetCareLog modern clinic interior"
              fill
              sizes="(min-width: 1280px) 1100px, 95vw"
              className="object-cover object-center transition-transform duration-700 hover:scale-105"
              priority
            />

            {/* Subtle frosted gradient mask */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#06395F]/70 via-[#06395F]/20 to-transparent" />

            {/* Center Play Button Overlay */}
            {!isPlaying ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => setIsPlaying(true)}
                  aria-label="Play facility video tour"
                  className={cn(
                    "group flex h-20 w-20 items-center justify-center rounded-full bg-white/90 text-[#0D8BE0] shadow-[0_12px_36px_rgba(1,95,160,0.35),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 hover:scale-110 hover:bg-white active:scale-95",
                    focus
                  )}
                >
                  <Play className="ml-1 h-8 w-8 fill-[#0D8BE0] text-[#0D8BE0] transition-transform group-hover:scale-105" />
                </button>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#06395F]/85 p-6 text-center text-white backdrop-blur-md">
                <p className="font-display text-2xl font-bold">Virtual clinic walkthrough</p>
                <p className="mt-2 text-sm text-white/80">Connect your video stream URL here</p>
                <button
                  type="button"
                  onClick={() => setIsPlaying(false)}
                  className="mt-4 rounded-full border border-white/50 bg-white/20 px-5 py-2 text-xs font-semibold hover:bg-white/30"
                >
                  Close preview
                </button>
              </div>
            )}

            {/* Bottom info strip inside tour card */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-3 sm:bottom-6 sm:left-6 sm:right-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/30 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live sterilization certified
                </span>
                <p className="mt-2 font-display text-xl font-bold text-white sm:text-2xl drop-shadow-sm">
                  Tour our diagnostics &amp; treatment suites
                </p>
              </div>

              <Link
                href="#contact"
                className={cn(
                  "group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(13,150,230,0.4),inset_0_1px_0_rgba(255,255,255,0.5)] transition duration-200 hover:-translate-y-0.5",
                  focus
                )}
              >
                Book a visit
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </div>
          </div>
        </div>

        {/* Feature Grid with Lucide Icons in Tinted Rounded Squares */}
        <div className="mt-8 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {clinicFeatures.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.label}
                style={{ animationDelay: `${i * 60}ms` }}
                className={cn(
                  "flex items-center gap-3.5 rounded-[1.75rem] p-4 transition duration-200 hover:-translate-y-0.5 hover:bg-white/65",
                  glass,
                  isInView ? "animate-fade-up motion-reduce:animate-none" : "opacity-0"
                )}
              >
                <span
                  className={cn(
                    "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]",
                    f.tint
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-sm font-semibold text-[#06395F]">
                    {f.label}
                  </p>
                  <p className="truncate text-xs text-[#0B4C7A]/75">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
