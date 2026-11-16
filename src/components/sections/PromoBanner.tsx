"use client";

import Link from "next/link";
import { ArrowRight, Check, Percent, PawPrint } from "lucide-react";
import { useInView } from "@/lib/hooks/useInView";
import { cn } from "@/lib/utils";

const OFFER_END = "Dec 31, 2026";
const included = ["Experienced doctors", "Modern equipment", "Gentle, fear-free care"];

export default function PromoBanner() {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="bg-gradient-to-b from-[#F6FAFF] to-white py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div
          className={cn(
            "relative isolate grid grid-cols-1 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#2FB0FF] via-[#0D8BE0] to-[#015FA0] lg:grid-cols-2",
            isInView ? "animate-fade-up" : "opacity-0"
          )}
        >
          {/* Light inside the banner so the glass card has something to blur */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -left-16 -top-16 h-72 w-72 rounded-full bg-white/25 blur-3xl" />
            <div className="absolute -bottom-20 right-10 h-80 w-80 rounded-full bg-[#9EE7FF]/40 blur-3xl" />
            <div className="absolute right-1/3 top-10 h-52 w-52 rounded-full bg-[#FFD6E8]/30 blur-3xl" />
          </div>

          {/* Left: the offer */}
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14">
            <span className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/40 bg-white/20 px-4 py-2 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] backdrop-blur-md">
              <Percent className="h-4 w-4" aria-hidden />
              Limited-time offer
            </span>

            <p className="font-display text-7xl font-bold leading-none tracking-tight text-white sm:text-8xl">
              50%
              <span className="ml-3 text-3xl font-semibold text-white/90 sm:text-4xl">off</span>
            </p>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-white/85">
              Your first full checkup, with vets who take their time and care you can trust.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#contact"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#06395F] shadow-[0_8px_24px_rgba(1,50,90,0.25)] transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D8BE0]"
              >
                Book now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
              <Link
                href="#services"
                className="inline-flex items-center justify-center rounded-full border border-white/50 bg-white/15 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition duration-200 hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                See services
              </Link>
            </div>
          </div>

          {/* Right: glass offer card */}
          <div className="relative flex items-center justify-center p-6 pb-10 sm:p-10 lg:p-12">
            <PawPrint
              aria-hidden
              strokeWidth={1.25}
              className="pointer-events-none absolute -right-6 -top-4 hidden h-72 w-72 rotate-12 text-white/10 lg:block"
            />

            <div className="relative w-full max-w-sm rounded-[2rem] border border-white/50 bg-white/20 p-6 shadow-[0_20px_50px_rgba(1,50,90,0.25),inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-2xl backdrop-saturate-150 sm:p-7">
              <p className="text-sm font-medium text-white/80">First full checkup includes</p>
              <ul className="mt-4 space-y-3">
                {included.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-base font-medium text-white">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/90 text-[#0D8BE0]">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-white/30 pt-4">
                <p className="text-xs text-white/75">Valid until</p>
                <p className="text-lg font-semibold text-white">{OFFER_END}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}