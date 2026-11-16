"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useRef, useState } from "react";
import { useInView } from "@/lib/hooks/useInView";
import { cn } from "@/lib/utils";

const doctors = [
  {
    name: "Dr. Sarah Mitchell",
    specialty: "Internal Medicine",
    rating: 4.9,
    reviews: 312,
    image: "/images/puppy.png", // placeholder; replace with real doctor photos
    tint: "from-sky-200 to-sky-400",
  },
  {
    name: "Dr. James Chen",
    specialty: "Surgery & Orthopedics",
    rating: 4.8,
    reviews: 285,
    image: "/images/cat.png",
    tint: "from-violet-200 to-violet-400",
  },
  {
    name: "Dr. Elena Vasquez",
    specialty: "Dermatology",
    rating: 4.9,
    reviews: 194,
    image: "/images/Persian_Cat.png",
    tint: "from-emerald-200 to-emerald-400",
  },
  {
    name: "Dr. Ahmed Karim",
    specialty: "Emergency Care",
    rating: 5.0,
    reviews: 128,
    image: "/images/puppy.png",
    tint: "from-rose-200 to-rose-400",
  },
  {
    name: "Dr. Priya Nair",
    specialty: "Preventive Medicine",
    rating: 4.7,
    reviews: 243,
    image: "/images/cat.png",
    tint: "from-amber-200 to-amber-400",
  },
];

/* Same glass recipe as hero, navbar and services */
const glass =
  "border border-white/70 bg-white/45 backdrop-blur-2xl backdrop-saturate-150 " +
  "shadow-[0_10px_40px_rgba(1,95,160,0.12),inset_0_1px_0_rgba(255,255,255,0.9)]";

const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D96E6]";

export default function DoctorsSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const touchStartX = useRef<number | null>(null);

  const total = doctors.length;
  const go = (i: number) => setActiveIdx((i + total) % total);
  const prev = () => go(activeIdx - 1);
  const next = () => go(activeIdx + 1);

  const doctor = doctors[activeIdx];

  return (
    <section
      id="doctors"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative isolate overflow-hidden bg-gradient-to-b from-[#F6FAFF] to-[#DCEEFF] py-24 sm:py-28"
    >
      {/* Colour behind the glass */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-white/60 blur-3xl" />
        <div className="absolute -right-20 top-10 h-80 w-80 rounded-full bg-[#9EE7FF]/50 blur-3xl" />
        <div className="absolute -left-20 bottom-10 h-80 w-80 rounded-full bg-[#FFD6E8]/50 blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <div className={cn("mb-12 text-center", isInView ? "animate-fade-up" : "opacity-0")}>
          <h2 className="font-display text-balance text-4xl font-bold tracking-tight text-[#06395F] sm:text-5xl">
            Meet the doctors caring for your pet
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-[#0B4C7A]/75">
            Pick a specialist to see their focus and book a visit.
          </p>
        </div>

        {/* Carousel region: arrow keys + swipe both work */}
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Our specialists"
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
          }}
          className={isInView ? "animate-fade-in" : "opacity-0"}
        >
          {/* Featured doctor card */}
          <div
            id="doctor-panel"
            role="tabpanel"
            aria-labelledby={`doctor-tab-${activeIdx}`}
            onPointerDown={(e) => (touchStartX.current = e.clientX)}
            onPointerUp={(e) => {
              if (touchStartX.current === null) return;
              const dx = e.clientX - touchStartX.current;
              touchStartX.current = null;
              if (dx > 60) prev();
              if (dx < -60) next();
            }}
            className={cn(
              "touch-pan-y select-none rounded-[2.5rem] p-5 sm:p-8",
              glass
            )}
          >
            {/* key re-triggers the fade when the doctor changes */}
            <div
              key={activeIdx}
              className="animate-fade-in flex flex-col items-center gap-6 text-center sm:flex-row sm:gap-10 sm:text-left"
            >
              <div
                className={cn(
                  "relative h-48 w-48 flex-shrink-0 overflow-hidden rounded-[2rem] bg-gradient-to-br shadow-[0_12px_30px_rgba(1,95,160,0.2),inset_0_0_0_3px_rgba(255,255,255,0.8)] sm:h-60 sm:w-60",
                  doctor.tint
                )}
              >
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  sizes="(min-width: 640px) 240px, 192px"
                  className="object-cover"
                  priority={activeIdx === 0}
                  draggable={false}
                />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-[#0D7FCB]">{doctor.specialty}</p>
                <h3 className="mt-1 font-display text-3xl font-bold tracking-tight text-[#06395F] sm:text-4xl">
                  {doctor.name}
                </h3>

                <div className="mt-3 flex items-center justify-center gap-1.5 sm:justify-start">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
                  <span className="text-sm font-semibold text-[#06395F]">{doctor.rating}</span>
                  <span className="text-sm text-[#0B4C7A]/65">· {doctor.reviews} reviews</span>
                </div>

                <Link
                  href="#contact"
                  className={cn(
                    "group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(13,150,230,0.4),inset_0_1px_0_rgba(255,255,255,0.5)] transition duration-200 hover:-translate-y-0.5 sm:w-auto",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D8BE0]"
                  )}
                >
                  Book with {doctor.name}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </div>
            </div>
          </div>

          {/* Controls: arrows + face selector (replaces anonymous dots) */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous doctor"
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full text-[#06395F] transition hover:bg-white/80 sm:h-11 sm:w-11",
                glass,
                focus
              )}
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>

            <div role="tablist" aria-label="Choose a doctor" className={cn("flex items-center gap-1 rounded-full p-1.5", glass)}>
              {doctors.map((d, i) => (
                <button
                  key={d.name}
                  id={`doctor-tab-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={i === activeIdx}
                  aria-controls="doctor-panel"
                  aria-label={`${d.name}, ${d.specialty}`}
                  title={d.name}
                  onClick={() => go(i)}
                  className={cn(
                    "relative h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br transition duration-200 sm:h-11 sm:w-11",
                    d.tint,
                    focus,
                    i === activeIdx
                      ? "ring-2 ring-[#0D8BE0] ring-offset-2 ring-offset-white/80"
                      : "opacity-60 hover:opacity-100"
                  )}
                >
                  <Image src={d.image} alt="" fill sizes="44px" className="object-cover" draggable={false} />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              aria-label="Next doctor"
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full text-[#06395F] transition hover:bg-white/80 sm:h-11 sm:w-11",
                glass,
                focus
              )}
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </div>

          <p aria-live="polite" className="mt-3 text-center text-xs text-[#0B4C7A]/60">
            {activeIdx + 1} of {total}
          </p>
        </div>
      </div>
    </section>
  );
}