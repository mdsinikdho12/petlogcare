"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  MapPin,
  Heart,
  ArrowRight,
  BadgeCheck,
  ShieldCheck,
  Stethoscope,
  Scissors,
  BedDouble,
  Building2,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useInView } from "@/lib/hooks/useInView";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api/client";

type Filter = "all" | "top" | "near" | "new";

interface DisplayProvider {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  area: string;
  description: string;
  price: number;
  priceUnit?: string;
  badge: { label: string; icon: LucideIcon; tone: string };
  cover: { icon: LucideIcon; tint: string };
  image?: string;
  tags: Filter[];
}

const FALLBACK_CLINIC_IMAGES = [
  "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800&q=80",
];

const SAMPLE_PARTNER_PROVIDERS: DisplayProvider[] = [
  {
    id: "carevet-dhanmondi",
    name: "CareVet Animal Hospital & Surgery",
    rating: 4.9,
    reviews: 142,
    area: "Dhanmondi, Dhaka",
    description: "State-of-the-art companion animal surgery, diagnostic pathology, and emergency critical care.",
    price: 800,
    badge: { label: "Verified clinic", icon: BadgeCheck, tone: "text-emerald-600" },
    cover: { icon: Stethoscope, tint: "from-sky-200 to-sky-400" },
    image: FALLBACK_CLINIC_IMAGES[0],
    tags: ["top", "near"],
  },
  {
    id: "paws-clinic-gulshan",
    name: "Paws & Claws Veterinary Care",
    rating: 4.8,
    reviews: 98,
    area: "Gulshan-2, Dhaka",
    description: "Compassionate feline and canine specialists, luxury grooming salon, and digital radiology.",
    price: 1200,
    badge: { label: "Top rated", icon: BadgeCheck, tone: "text-amber-600" },
    cover: { icon: Scissors, tint: "from-rose-200 to-rose-300" },
    image: FALLBACK_CLINIC_IMAGES[1],
    tags: ["top"],
  },
  {
    id: "uttara-pet-wellness",
    name: "Uttara Pet Wellness & Emergency",
    rating: 4.9,
    reviews: 76,
    area: "Sector 4, Uttara",
    description: "24/7 emergency critical care unit, ultrasonic dental prophylaxis, and luxury boarding suites.",
    price: 1000,
    badge: { label: "24/7 emergency", icon: ShieldCheck, tone: "text-rose-600" },
    cover: { icon: Stethoscope, tint: "from-indigo-200 to-indigo-300" },
    image: FALLBACK_CLINIC_IMAGES[2],
    tags: ["top", "near"],
  },
  {
    id: "dhanmondi-fluffy-groomers",
    name: "Fluffy Tails Grooming & Boarding",
    rating: 4.9,
    reviews: 89,
    area: "Satmasjid Road, Dhaka",
    description: "Hygienic medicated baths, breed scissor trims, de-shedding spa, and climate-controlled daycare.",
    price: 1500,
    badge: { label: "Certified spa", icon: ShieldCheck, tone: "text-sky-600" },
    cover: { icon: BedDouble, tint: "from-emerald-200 to-emerald-300" },
    image: FALLBACK_CLINIC_IMAGES[3],
    tags: ["new"],
  },
];

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All providers" },
  { id: "top", label: "Top rated" },
  { id: "near", label: "Near Dhaka" },
  { id: "new", label: "Newest" },
];

/* Same glass recipe as the rest of the site */
const glass =
  "border border-white/70 bg-white/45 backdrop-blur-2xl backdrop-saturate-150 " +
  "shadow-[0_10px_40px_rgba(1,95,160,0.10),inset_0_1px_0_rgba(255,255,255,0.9)]";
const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D96E6]";

export default function ProvidersSection() {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const [filter, setFilter] = useState<Filter>("all");
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [providersList, setProvidersList] = useState<DisplayProvider[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch live providers from backend API
  useEffect(() => {
    let isMounted = true;
    async function loadProviders() {
      try {
        setLoading(true);
        const res = await apiClient.get("/providers", {
          params: { page: 1, limit: 8 },
        });
        const items = res.data?.data || [];
        if (isMounted && Array.isArray(items) && items.length > 0) {
          const mapped: DisplayProvider[] = items.map((p: any, idx: number) => ({
            id: p._id || p.id,
            name: p.businessName || "Veterinary Practice",
            rating: typeof p.rating === "number" ? p.rating : 4.9,
            reviews: typeof p.reviewCount === "number" ? p.reviewCount : 1,
            area: `${p.address?.area || p.address?.city || "Dhaka"}, ${p.address?.district || "Dhaka"}`,
            description:
              p.bio ||
              "Certified veterinary clinic providing clinical care, diagnostics and companion vaccines.",
            price: p.startingPriceBDT || (p.services?.[0]?.priceBDT) || 800,
            badge: {
              label: p.verified ? "Verified vet" : "Top rated",
              icon: BadgeCheck,
              tone: "text-emerald-600",
            },
            cover: { icon: Stethoscope, tint: "from-sky-200 to-sky-400" },
            image: p.cover?.url || p.logo?.url || FALLBACK_CLINIC_IMAGES[idx % FALLBACK_CLINIC_IMAGES.length],
            tags: idx % 2 === 0 ? ["top", "near"] : ["top"],
          }));
          setProvidersList(mapped);
        } else if (isMounted) {
          // If live database has 0 providers, use partner showcase
          setProvidersList(SAMPLE_PARTNER_PROVIDERS);
        }
      } catch {
        if (isMounted) {
          setProvidersList(SAMPLE_PARTNER_PROVIDERS);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadProviders();
    return () => {
      isMounted = false;
    };
  }, []);

  const visible = providersList.filter(
    (p) => filter === "all" || p.tags.includes(filter)
  );

  const toggleSave = (id: string) =>
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

  return (
    <section
      id="providers"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative isolate overflow-hidden bg-gradient-to-b from-[#F6FAFF] to-[#DCEEFF] py-24 sm:py-28"
    >
      {/* Colour behind the glass */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-20 top-16 h-80 w-80 rounded-full bg-[#9EE7FF]/50 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-[#FFD6E8]/50 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#FFF1C9]/60 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header + filter */}
        <div
          className={cn(
            "mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
            isInView ? "animate-fade-up" : "opacity-0"
          )}
        >
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[8px] bg-sky-500/15 text-[#0D8BE0] text-[12px] font-semibold border border-white/80 shadow-xs mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified veterinary network</span>
            </div>
            <h2 className="font-display text-balance text-4xl font-bold tracking-tight text-[#06395F] sm:text-5xl">
              Popular providers near you
            </h2>
            <p className="mt-3 text-base sm:text-lg leading-relaxed text-[#0B4C7A]/75">
              Handpicked, verified veterinary surgeons, groomers, and pet sanctuaries across Bangladesh.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Filter providers"
            className={cn("flex w-fit max-w-full overflow-x-auto rounded-full p-1.5", glass)}
          >
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer",
                  focus,
                  filter === f.id
                    ? "bg-white/95 text-[#06395F] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_4px_rgba(1,95,160,0.12)]"
                    : "text-[#06395F]/65 hover:bg-white/50 hover:text-[#06395F]"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={cn("flex flex-col rounded-[2rem] p-3 space-y-3 animate-pulse", glass)}
              >
                <div className="aspect-[4/3] rounded-[1.5rem] bg-slate-200/80" />
                <div className="h-5 bg-slate-200/80 rounded w-3/4" />
                <div className="h-4 bg-slate-200/60 rounded w-1/2" />
                <div className="h-10 bg-slate-200/80 rounded-full mt-4" />
              </div>
            ))}
          </div>
        )}

        {/* Cards */}
        {!loading && visible.length === 0 ? (
          <div className={cn("rounded-[2rem] p-10 text-center space-y-3", glass)}>
            <Building2 className="w-10 h-10 text-[#0D8BE0] mx-auto opacity-70" />
            <p className="text-base font-semibold text-[#06395F]">
              No providers in this group yet. Try another filter.
            </p>
            <Link
              href="/providers"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-[#06395F] text-sm font-semibold shadow-xs"
            >
              <span>Explore all districts</span>
            </Link>
          </div>
        ) : !loading && (
          <div
            key={filter}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
          >
            {visible.map((p, i) => {
              const BadgeIcon = p.badge.icon;
              const isSaved = saved.has(p.id);
              return (
                <article
                  key={p.id}
                  style={{ animationDelay: `${i * 80}ms` }}
                  className={cn(
                    "group flex flex-col rounded-[2rem] p-2.5 transition duration-300",
                    "hover:-translate-y-1 hover:bg-white/60 hover:shadow-[0_18px_50px_rgba(1,95,160,0.18),inset_0_1px_0_rgba(255,255,255,0.95)]",
                    glass,
                    isInView ? "animate-fade-up motion-reduce:animate-none" : "opacity-0"
                  )}
                >
                  {/* Cover: photo tile */}
                  <div
                    className={cn(
                      "relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-gradient-to-br bg-slate-100",
                      p.cover.tint
                    )}
                  >
                    {p.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <Stethoscope
                        aria-hidden
                        strokeWidth={1.25}
                        className="absolute -bottom-6 -right-4 h-44 w-44 text-white/60"
                      />
                    )}

                    <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/90 py-1.5 pl-2 pr-3 text-xs font-semibold text-[#06395F] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-md">
                      <BadgeIcon className={cn("h-3.5 w-3.5", p.badge.tone)} aria-hidden />
                      {p.badge.label}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col px-3 pb-3 pt-4">
                    <h3 className="font-display text-lg font-semibold leading-snug tracking-tight text-[#06395F] line-clamp-2 sm:min-h-[3.2rem]">
                      {p.name}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                      <span className="inline-flex items-center gap-1 font-semibold text-[#06395F]">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
                        {p.rating}
                      </span>
                      <span className="text-[#0B4C7A]/65">({p.reviews} reviews)</span>
                      <span className="inline-flex items-center gap-1 text-[#0B4C7A]/75">
                        <MapPin className="h-3.5 w-3.5 text-[#0D8BE0]" aria-hidden />
                        <span className="truncate max-w-[130px]">{p.area}</span>
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-[#0B4C7A]/75 line-clamp-2">
                      {p.description}
                    </p>

                    <p className="mt-4 text-sm text-[#0B4C7A]/75">
                      Starting from{" "}
                      <span className="font-display text-lg font-bold text-[#06395F] tabular-nums">
                        ৳{new Intl.NumberFormat("en-BD").format(p.price)}
                      </span>
                      {p.priceUnit && <span className="text-[#0B4C7A]/75">{p.priceUnit}</span>}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => toggleSave(p.id)}
                        aria-pressed={isSaved}
                        className={cn(
                          "flex h-11 items-center justify-center gap-1.5 rounded-full border border-white/80 bg-white/65 text-sm font-semibold text-[#06395F] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition-colors hover:bg-white cursor-pointer",
                          focus
                        )}
                      >
                        <Heart
                          className={cn(
                            "h-4 w-4 transition-colors",
                            isSaved ? "fill-rose-500 text-rose-500" : "text-[#06395F]/70"
                          )}
                          aria-hidden
                        />
                        {isSaved ? "Saved" : "Save"}
                      </button>
                      <Link
                        href={`/providers/${p.id}`}
                        className="flex h-11 items-center justify-center rounded-full bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-sm font-semibold text-white shadow-[0_6px_18px_rgba(13,150,230,0.35),inset_0_1px_0_rgba(255,255,255,0.5)] transition duration-200 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        Book now
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className={cn("mt-12 text-center", isInView ? "animate-fade-up" : "opacity-0")}>
          <Link
            href="/providers"
            className={cn(
              "group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-[#06395F] transition hover:bg-white/70",
              glass,
              focus
            )}
          >
            View all providers
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
