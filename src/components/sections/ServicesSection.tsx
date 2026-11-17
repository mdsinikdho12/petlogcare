"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Stethoscope,
  Scissors,
  ShieldCheck,
  Building2,
  Award,
  Syringe,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useInView } from "@/lib/hooks/useInView";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api/client";

interface ServiceItem {
  id: string;
  slug: string;
  icon: LucideIcon;
  title: string;
  nameBn?: string;
  description: string;
  items: string[];
  badge?: string;
  iconTint: string;
}

// Real service categories matching the PetCareLog live database
const REAL_SERVICES: ServiceItem[] = [
  {
    id: "vet-consultation",
    slug: "vet-consultation",
    icon: Stethoscope,
    title: "Vet consultation",
    nameBn: "পশু চিকিৎসক পরামর্শ",
    description: "Clinical physical examination, disease diagnosis, vitals checkup and prescriptions by registered veterinary doctors.",
    items: [
      "Physical examination & diagnosis",
      "Digital prescription & medical history",
      "In-clinic consultation & home visits",
      "Nutritional & preventive health guidance",
    ],
    badge: "BAU certified doctors",
    iconTint: "bg-indigo-500/15 text-indigo-600",
  },
  {
    id: "vaccination",
    slug: "vaccination",
    icon: Syringe,
    title: "Vaccination passport",
    nameBn: "টিকা",
    description: "Complete companion animal vaccination protocols synchronized automatically with PetCareLog digital health passports.",
    items: [
      "Nobivac & Vanguard core boosters",
      "Rabies annual immunization",
      "Digital QR vaccine certificate",
      "Automated booster schedule alerts",
    ],
    badge: "Official health passport sync",
    iconTint: "bg-sky-500/15 text-sky-600",
  },
  {
    id: "grooming",
    slug: "grooming",
    icon: Scissors,
    title: "Grooming & spa",
    nameBn: "গ্রুমিং",
    description: "Stress-free hygienic grooming, medicated flea and tick baths, breed styling and hypoallergenic coat therapy.",
    items: [
      "Medicated antiseptic & flea bath",
      "Breed scissor styling & fur trim",
      "Nail clipping & paw balm treatment",
      "Ear flushing & de-shedding treatment",
    ],
    badge: "Certified gentle groomers",
    iconTint: "bg-rose-500/15 text-rose-500",
  },
  {
    id: "deworming",
    slug: "deworming",
    icon: ShieldCheck,
    title: "Deworming protocol",
    nameBn: "কৃমিনাশক",
    description: "Scheduled broad-spectrum internal parasite prevention, weight-calibrated dosing and digestive wellness monitoring.",
    items: [
      "Intestinal parasite clinical screening",
      "Weight-adjusted oral dosage",
      "Recurring 3-month schedule alerts",
      "Safe for puppies, kittens & adult pets",
    ],
    badge: "Core health protection",
    iconTint: "bg-emerald-500/15 text-emerald-600",
  },
  {
    id: "boarding",
    slug: "boarding",
    icon: Building2,
    title: "Boarding & daycare",
    nameBn: "বোর্ডিং",
    description: "Climate-controlled private feline and canine suites, 24/7 veterinary supervision, premium nutrition and play sessions.",
    items: [
      "Private climate-controlled suites",
      "24/7 on-call veterinary care",
      "Custom dietary feeding schedules",
      "Daily WhatsApp photo & video check-ins",
    ],
    badge: "24/7 supervised care",
    iconTint: "bg-amber-500/15 text-amber-600",
  },
  {
    id: "training",
    slug: "training",
    icon: Award,
    title: "Behavioral training",
    nameBn: "প্রশিক্ষণ",
    description: "Certified positive reinforcement behavioral training, puppy socialization, leash manners and separation anxiety management.",
    items: [
      "Positive reinforcement methods",
      "Puppy house-training & socialization",
      "Leash etiquette & obedience basics",
      "Anxiety & fear reduction techniques",
    ],
    badge: "Certified trainers",
    iconTint: "bg-violet-500/15 text-violet-600",
  },
];

/* Apple liquid glass recipe */
const glass =
  "border border-white/60 bg-white/35 backdrop-blur-2xl backdrop-saturate-150 " +
  "shadow-[0_6px_24px_rgba(1,95,160,0.10),inset_0_1px_0_rgba(255,255,255,0.85)]";

export default function ServicesSection() {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const [servicesList, setServicesList] = useState<ServiceItem[]>(REAL_SERVICES);
  const [activeId, setActiveId] = useState<string>(REAL_SERVICES[0].id);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Fetch live categories from backend API to ensure real-time synchronization
  useEffect(() => {
    let isMounted = true;
    async function syncCategories() {
      try {
        const res = await apiClient.get("/categories", {
          params: { type: "SERVICE_CATEGORY", limit: 20 },
        });
        const items = res.data?.data || [];
        if (isMounted && Array.isArray(items) && items.length > 0) {
          // Merge API category names with iconography
          const mapped = items.map((cat: any) => {
            const existing = REAL_SERVICES.find(
              (r) => r.slug === cat.slug || r.id === cat.slug
            );
            return {
              id: cat.slug || cat._id,
              slug: cat.slug || cat._id,
              icon: existing?.icon || Stethoscope,
              title: cat.name || existing?.title || "Service",
              nameBn: cat.nameBn || existing?.nameBn,
              description: existing?.description || "Professional pet care service in Bangladesh.",
              items: existing?.items || [
                "Verified clinic standards",
                "Qualified attending practitioners",
                "Digital pet medical records sync",
                "Affordable transparent pricing",
              ],
              badge: existing?.badge || "Verified category",
              iconTint: existing?.iconTint || "bg-sky-500/15 text-sky-600",
            };
          });
          if (mapped.length > 0) {
            setServicesList(mapped);
          }
        }
      } catch {
        // Fallback to REAL_SERVICES if offline
      }
    }
    syncCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const activeIndex = servicesList.findIndex((s) => s.id === activeId || s.slug === activeId);
  const active = servicesList[activeIndex >= 0 ? activeIndex : 0];
  const ActiveIcon = active?.icon || Stethoscope;

  const select = (index: number, focus = false) => {
    const next = (index + servicesList.length) % servicesList.length;
    setActiveId(servicesList[next].id);
    const el = tabRefs.current[next];
    if (focus) el?.focus();
    el?.scrollIntoView({ inline: "nearest", block: "nearest" });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const map: Record<string, number | undefined> = {
      ArrowRight: activeIndex + 1,
      ArrowDown: activeIndex + 1,
      ArrowLeft: activeIndex - 1,
      ArrowUp: activeIndex - 1,
      Home: 0,
      End: servicesList.length - 1,
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

      {/* Colour behind the glass for depth */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-24 h-80 w-80 rounded-full bg-[#9EE7FF]/55 blur-3xl" />
        <div className="absolute right-0 top-1/2 h-96 w-96 rounded-full bg-[#FFD6E8]/55 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#FFF1C9]/65 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Header */}
        <div className={cn("mx-auto mb-10 max-w-2xl text-center sm:mb-14", isInView ? "svc-rise" : "opacity-0")}>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[8px] bg-sky-500/15 text-[#0D8BE0] text-[12px] font-semibold border border-white/80 shadow-xs mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Verified pet care services</span>
          </div>
          <h2
            id="services-heading"
            className="text-balance font-display text-4xl font-bold tracking-tight text-[#06395F] sm:text-5xl"
          >
            Everything your companion needs in Bangladesh
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#0B4C7A]">
            Discover certified veterinary clinics, grooming spas, and boarding resorts across Dhaka, Chittagong, and all 64 districts.
          </p>
        </div>

        {/* Selector + detail */}
        <div className={cn("grid gap-4 lg:grid-cols-[19rem_1fr] lg:gap-6", isInView ? "svc-rise" : "opacity-0")}>
          {/* Service selector */}
          <div
            role="tablist"
            aria-label="PetCareLog services"
            onKeyDown={onKeyDown}
            className={cn(
              glass,
              "flex gap-1.5 self-start overflow-x-auto rounded-[13px] p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:w-full lg:flex-col lg:overflow-visible"
            )}
          >
            {servicesList.map((s, i) => {
              const Icon = s.icon;
              const selected = s.id === active.id || s.slug === active.slug;
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
                    "group flex min-h-12 shrink-0 items-center gap-3 whitespace-nowrap rounded-[11px] px-3.5 py-2.5 text-left text-[14px] font-semibold transition duration-200 cursor-pointer",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D8BE0]",
                    "motion-reduce:transition-none lg:w-full",
                    selected
                      ? "bg-white/95 text-[#06395F] shadow-[0_4px_14px_rgba(1,95,160,0.12),inset_0_1px_0_rgba(255,255,255,1)]"
                      : "text-[#0B4C7A] hover:bg-white/60"
                  )}
                >
                  <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px]", s.iconTint)}>
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="block truncate text-[#06395F]">{s.title}</span>
                    {s.nameBn && (
                      <span className="block text-[11px] font-normal text-[#06395F]/60 truncate">
                        {s.nameBn}
                      </span>
                    )}
                  </div>
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
              "relative min-h-[26rem] overflow-hidden rounded-[13px] bg-white/70 p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D8BE0] sm:p-9 lg:min-h-[28rem]"
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
                    "flex h-14 w-14 items-center justify-center rounded-[11px] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]",
                    active.iconTint
                  )}
                >
                  <ActiveIcon className="h-7 w-7" aria-hidden />
                </span>
                {active.badge && (
                  <span className="inline-flex items-center rounded-[8px] border border-white/80 bg-white/90 px-3 py-1 text-[12px] font-semibold text-[#0A6FBF] shadow-xs">
                    {active.badge}
                  </span>
                )}
                {active.nameBn && (
                  <span className="inline-flex items-center rounded-[8px] bg-sky-50 text-sky-700 px-2.5 py-1 text-[12px] font-medium border border-sky-100">
                    {active.nameBn}
                  </span>
                )}
              </div>

              <h3 className="mt-6 font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#06395F]">
                {active.title}
              </h3>
              <p className="mt-3 max-w-lg text-[14px] sm:text-base leading-relaxed text-[#0B4C7A]">
                {active.description}
              </p>

              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {active.items.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-[13px] sm:text-[14px] text-[#06395F] font-medium">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shadow-xs">
                      <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-8 flex flex-wrap items-center gap-3">
                <Link
                  href={`/providers?category=${encodeURIComponent(active.slug || active.id)}`}
                  className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] px-6 text-[13px] font-semibold text-white shadow-[0_4px_14px_rgba(13,150,230,0.30)] transition duration-200 hover:-translate-y-0.5"
                >
                  <span>Find clinics offering {active.title.toLowerCase()}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>

                <Link
                  href="/providers"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[11px] border border-[#06395F]/15 bg-white px-5 text-[13px] font-semibold text-[#06395F] hover:bg-slate-50 transition"
                >
                  <span>View all providers</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom link */}
        <div className={cn("mt-10 text-center sm:mt-12", isInView ? "svc-rise" : "opacity-0")}>
          <Link
            href="/providers"
            className={cn(
              glass,
              "group inline-flex min-h-11 items-center gap-2 rounded-[11px] px-6 text-[13px] font-semibold text-[#06395F] transition duration-200 hover:-translate-y-0.5 hover:bg-white/60",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D8BE0]"
            )}
          >
            <span>Browse all verified veterinary clinics &amp; services in Bangladesh</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
