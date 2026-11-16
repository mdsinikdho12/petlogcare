"use client";

import { useRef, useState, type KeyboardEvent, type RefObject } from "react";
import Link from "next/link";
import { ArrowRight, Check, ChevronRight, FlaskConical, Stethoscope, Eye, ShieldPlus, Heart, Syringe } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useInView } from "@/lib/hooks/useInView";
import { cn } from "@/lib/utils";

interface Service {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  items: string[];
  badge?: string;
  iconTint: string;
}

const services: Service[] = [
  {
    id: "lab",
    icon: FlaskConical,
    title: "Lab diagnostics",
    description: "Comprehensive blood work, urinalysis, and pathogen testing.",
    items: ["Complete blood count", "Biochemistry panel", "Parasite screening"],
    badge: "Express results in 3 hours",
    iconTint: "bg-sky-500/15 text-sky-600",
  },
  {
    id: "surgery",
    icon: Stethoscope,
    title: "Surgery",
    description: "Modern surgical suite with full anaesthesia monitoring.",
    items: ["Soft-tissue surgery", "Dental surgery", "Sterilization", "Orthopedics"],
    iconTint: "bg-indigo-500/15 text-indigo-600",
  },
  {
    id: "visual",
    icon: Eye,
    title: "Visual diagnostics",
    description: "Digital X-ray, ultrasound, ECG, and endoscopy.",
    items: ["Radiography", "Ultrasound", "ECG", "Endoscopy"],
    iconTint: "bg-cyan-500/15 text-cyan-600",
  },
  {
    id: "prevention",
    icon: ShieldPlus,
    title: "Preventive care",
    description: "Vaccinations, anti-parasitic treatments, and wellness checkups.",
    items: ["Vaccination programs", "Microchipping"],
    iconTint: "bg-emerald-500/15 text-emerald-600",
  },
  {
    id: "therapy",
    icon: Heart,
    title: "Therapy",
    description: "Physiotherapy, orthopedic rehab, and laser treatment.",
    items: ["Physiotherapy", "Hydrotherapy", "Ophthalmology", "Dermatology"],
    iconTint: "bg-rose-500/15 text-rose-500",
  },
  {
    id: "vaccination",
    icon: Syringe,
    title: "Vaccination",
    description: "Full vaccination schedules with health passport records.",
    items: ["Puppy & kitten series", "Annual boosters", "Travel vaccines", "Titer testing"],
    iconTint: "bg-violet-500/15 text-violet-600",
  },
];

/* Same glass recipe as the navbar and hero */
const glass =
  "border border-white/60 bg-white/35 backdrop-blur-2xl backdrop-saturate-150 " +
  "shadow-[0_6px_24px_rgba(1,95,160,0.10),inset_0_1px_0_rgba(255,255,255,0.85)]";

export default function ServicesSection() {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const [activeId, setActiveId] = useState(services[0].id);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activeIndex = services.findIndex((s) => s.id === activeId);
  const active = services[activeIndex];
  const ActiveIcon = active.icon;

  const select = (index: number, focus = false) => {
    const next = (index + services.length) % services.length;
    setActiveId(services[next].id);
    const el = tabRefs.current[next];
    if (focus) el?.focus();
    // keep the active tab visible in the scrollable mobile row
    el?.scrollIntoView({ inline: "nearest", block: "nearest" });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const map: Record<string, number | undefined> = {
      ArrowRight: activeIndex + 1,
      ArrowDown: activeIndex + 1,
      ArrowLeft: activeIndex - 1,
      ArrowUp: activeIndex - 1,
      Home: 0,
      End: services.length - 1,
    };
    const target = map[e.key];
    if (target === undefined) return;
    e.preventDefault();
    select(target, true);
  };

  return (
    <section
      id="services"
      ref={ref as RefObject<HTMLElement>}
      aria-labelledby="services-heading"
      className="relative isolate overflow-hidden bg-gradient-to-b from-[#DCEEFF] via-[#EAF5FF] to-[#F6FAFF] py-20 sm:py-28"
    >
      <style>{`
        @keyframes svc-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes svc-swap { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: translateY(0) } }
        .svc-rise { opacity: 0; animation: svc-rise .7s cubic-bezier(.22,1,.36,1) forwards; }
        .svc-swap { animation: svc-swap .35s cubic-bezier(.22,1,.36,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .svc-rise { animation: none; opacity: 1; }
          .svc-swap { animation: none; }
        }
      `}</style>

      {/* Colour behind the glass so the blur has something to pick up */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-24 h-80 w-80 rounded-full bg-[#9EE7FF]/55 blur-3xl" />
        <div className="absolute right-0 top-1/2 h-96 w-96 rounded-full bg-[#FFD6E8]/55 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#FFF1C9]/65 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Header */}
        <div className={cn("mx-auto mb-10 max-w-2xl text-center sm:mb-14", isInView ? "svc-rise" : "opacity-0")}>
          <h2
            id="services-heading"
            className="text-balance font-display text-4xl font-bold tracking-tight text-[#06395F] sm:text-5xl"
          >
            Everything your pet needs, under one roof
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-[#0B4C7A]">
            From a first checkup to surgery and recovery, our team looks after every step.
          </p>
        </div>

        {/* Selector + detail */}
        <div className={cn("grid gap-4 lg:grid-cols-[18rem_1fr] lg:gap-6", isInView ? "svc-rise" : "opacity-0")}>
          {/* Service selector: scrolls sideways on mobile, vertical list on desktop */}
          <div
            role="tablist"
            aria-label="Our services"
            onKeyDown={onKeyDown}
            className={cn(
              glass,
              "flex gap-1.5 self-start overflow-x-auto rounded-3xl p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:w-full lg:flex-col lg:overflow-visible"
            )}
          >
            {services.map((s, i) => {
              const Icon = s.icon;
              const selected = s.id === activeId;
              return (
                <button
                  key={s.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  id={`svc-tab-${s.id}`}
                  type="button"
                  aria-selected={selected}
                  aria-controls="svc-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(i)}
                  className={cn(
                    "group flex min-h-12 shrink-0 items-center gap-3 whitespace-nowrap rounded-2xl px-3 py-2 text-left text-[15px] font-semibold transition duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D8BE0]",
                    "motion-reduce:transition-none lg:w-full",
                    selected
                      ? "bg-white/90 text-[#06395F] shadow-[0_4px_14px_rgba(1,95,160,0.12),inset_0_1px_0_rgba(255,255,255,1)]"
                      : "text-[#0B4C7A] hover:bg-white/50"
                  )}
                >
                  <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", s.iconTint)}>
                    <Icon className="h-[18px] w-[18px]" aria-hidden />
                  </span>
                  <span className="flex-1">{s.title}</span>
                  <ChevronRight
                    aria-hidden
                    className={cn(
                      "hidden h-4 w-4 shrink-0 text-[#0D8BE0] transition lg:block",
                      selected ? "opacity-100" : "opacity-0"
                    )}
                  />
                </button>
              );
            })}
          </div>

          {/* Detail panel: the one focal point */}
          <div
            role="tabpanel"
            id="svc-panel"
            aria-labelledby={`svc-tab-${active.id}`}
            tabIndex={0}
            className={cn(
              glass,
              "relative min-h-[26rem] overflow-hidden rounded-[1.75rem] bg-white/55 p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D8BE0] sm:p-9 lg:min-h-[28rem]"
            )}
          >
            <ActiveIcon
              aria-hidden
              strokeWidth={1.25}
              className="pointer-events-none absolute -bottom-12 -right-10 h-64 w-64 text-sky-500/10"
            />

            {/* key re-triggers the small swap animation when the service changes */}
            <div key={active.id} className="svc-swap relative flex h-full min-h-[22rem] flex-col lg:min-h-[24rem]">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]",
                    active.iconTint
                  )}
                >
                  <ActiveIcon className="h-7 w-7" aria-hidden />
                </span>
                {active.badge && (
                  <span className="inline-flex items-center rounded-full border border-white/80 bg-white/80 px-3.5 py-1.5 text-[13px] font-semibold text-[#0A6FBF] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                    {active.badge}
                  </span>
                )}
              </div>

              <h3 className="mt-6 font-display text-3xl font-bold tracking-tight text-[#06395F] sm:text-4xl">
                {active.title}
              </h3>
              <p className="mt-3 max-w-md text-lg leading-relaxed text-[#0B4C7A]">{active.description}</p>

              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {active.items.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-base text-[#06395F]">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/90 text-[#0D8BE0] shadow-[inset_0_1px_0_rgba(255,255,255,1)]">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-10">
                <Link
                  href={`/services/${active.id}`}
                  aria-label={`Learn more about ${active.title.toLowerCase()}`}
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/30 bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] px-7 text-base font-semibold text-white shadow-[0_10px_30px_rgba(13,150,230,0.4),inset_0_1px_0_rgba(255,255,255,0.5)] transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06395F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#EAF5FF] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  Learn more
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom link */}
        <div className={cn("mt-10 text-center sm:mt-12", isInView ? "svc-rise" : "opacity-0")}>
          <Link
            href="/services"
            className={cn(
              glass,
              "group inline-flex min-h-12 items-center gap-2 rounded-full px-7 text-base font-semibold text-[#06395F] transition duration-200 hover:-translate-y-0.5 hover:bg-white/55",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D8BE0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#EAF5FF] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            )}
          >
            See all services
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}