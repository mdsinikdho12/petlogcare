"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, CircleCheck, Quote, Star } from "lucide-react";
import { useInView } from "@/lib/hooks/useInView";
import { cn } from "@/lib/utils";

type Review = {
  name: string;
  pet: string;
  area?: string;
  role?: string;
  quote: string;
  verified: "booking" | "practitioner";
  tint: string;
  avatar?: string; // add real photos, e.g. "/images/reviews/anika.jpg"
  featured?: boolean;
};

/* Dummy data. Replace with real, permissioned reviews. */
const reviews: Review[] = [
  {
    name: "Dr. Farhan",
    pet: "Pet parent & veterinary surgeon",
    quote:
      "As a vet myself, I love how clean the health history logs, dosage records, and weight graphs are. It simplifies cross-clinic consults immensely.",
    verified: "practitioner",
    tint: "from-sky-300 to-sky-500",
    featured: true,
  },
  {
    name: "Anika & “Milo”",
    pet: "Golden Retriever",
    area: "Dhanmondi",
    quote:
      "Booking Milo’s routine vaccine and bath took 2 minutes. The reminder pinged me on WhatsApp just in time before his booster expired!",
    verified: "booking",
    tint: "from-emerald-300 to-emerald-500",
  },
  {
    name: "Tanvir & “Luna”",
    pet: "Persian Cat",
    area: "Gulshan",
    quote:
      "The digital vaccine record synced right to my dashboard. The vet at Gulshan was so gentle with Luna’s anxious demeanor.",
    verified: "booking",
    tint: "from-violet-300 to-violet-500",
  },
  {
    name: "Samira & “Rocky”",
    pet: "Beagle",
    area: "Banani",
    quote:
      "Found emergency boarding while travelling for office work. Paws & Relax sent daily video updates and Rocky was in high spirits!",
    verified: "booking",
    tint: "from-rose-300 to-rose-500",
  },
  {
    name: "Nusrat & “Simba”",
    pet: "Spitz",
    area: "Dhanmondi",
    quote:
      "The mobile groomer came right to our Dhanmondi doorstep. Simba didn’t experience any car travel anxiety at all. Truly 5 stars!",
    verified: "booking",
    tint: "from-amber-300 to-amber-500",
  },
  {
    name: "Kabir & “Coco”",
    pet: "Cockatiel",
    area: "Uttara",
    quote:
      "It is so difficult to locate qualified avian veterinarians in Dhaka. PetCareLog helped me filter directly for bird specialists within 10 km.",
    verified: "booking",
    tint: "from-cyan-300 to-cyan-500",
  },
];

/* Same glass recipe as the rest of the site */
const glass =
  "border border-white/70 bg-white/50 backdrop-blur-2xl backdrop-saturate-150 " +
  "shadow-[0_10px_40px_rgba(1,95,160,0.12),inset_0_1px_0_rgba(255,255,255,0.9)]";
const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D96E6]";

function Stars() {
  return (
    <div className="flex gap-0.5" role="img" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-[18px] w-[18px] fill-amber-400 text-amber-400" aria-hidden />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative isolate overflow-hidden bg-gradient-to-b from-[#DCEEFF] via-[#B5DAFC] to-[#DCEEFF] py-24 sm:py-28"
    >
      {/* Deeper background + stronger colour so the glass has depth, not a flat white page */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-24 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-white/50 blur-3xl" />
        <div className="absolute -left-24 top-1/3 h-96 w-96 rounded-full bg-[#9EE7FF]/70 blur-3xl" />
        <div className="absolute -right-24 top-1/2 h-96 w-96 rounded-full bg-[#FFD6E8]/70 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 h-80 w-80 rounded-full bg-[#FFF1C9]/80 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Header */}
        <div className={cn("mx-auto mb-14 max-w-2xl text-center", isInView ? "animate-fade-up" : "opacity-0")}>
          <span className={cn("mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-[#06395F]", glass)}>
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
            4.9 out of 5 · 1,280+ reviews
          </span>
          <h2 className="font-display text-balance text-4xl font-bold tracking-tight text-[#06395F] sm:text-5xl">
            What our pet parents say
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-[#0B4C7A]/80">
            Real stories from dedicated dog, cat, and bird lovers who depend on PetCareLog.
          </p>
        </div>

        {/* Bento: Dr. Farhan is the big card, the rest stay quiet */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <figure
              key={r.name}
              style={{ animationDelay: `${i * 80}ms` }}
              className={cn(
                "relative flex flex-col overflow-hidden rounded-[2rem] p-6 transition duration-300 sm:p-7",
                "hover:-translate-y-1 hover:bg-white/65 hover:shadow-[0_18px_50px_rgba(1,95,160,0.18),inset_0_1px_0_rgba(255,255,255,0.95)]",
                glass,
                r.featured && "sm:col-span-2 lg:row-span-2 lg:p-10",
                isInView ? "animate-fade-up motion-reduce:animate-none" : "opacity-0"
              )}
            >
              {r.featured && (
                <Quote
                  aria-hidden
                  strokeWidth={1.25}
                  className="pointer-events-none absolute -right-6 -top-6 h-56 w-56 text-sky-500/10"
                />
              )}

              <Stars />

              <blockquote
                className={cn(
                  "mt-4 flex-1 text-[#06395F]",
                  r.featured
                    ? "font-display text-2xl font-semibold leading-snug tracking-tight sm:text-3xl lg:mt-6"
                    : "text-[15px] leading-relaxed text-[#06395F]/85"
                )}
              >
                “{r.quote}”
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-3">
                <span
                  className={cn(
                    "relative flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br text-base font-semibold text-white shadow-[inset_0_0_0_2px_rgba(255,255,255,0.8)]",
                    r.tint,
                    r.featured && "lg:h-14 lg:w-14 lg:text-lg"
                  )}
                >
                  {r.avatar ? (
                    <Image src={r.avatar} alt="" fill sizes="56px" className="object-cover" />
                  ) : (
                    r.name.replace("Dr. ", "").charAt(0)
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-base font-semibold text-[#06395F]">
                    {r.name}
                  </span>
                  <span className="block truncate text-sm text-[#0B4C7A]/70">
                    {r.pet}
                    {r.area && ` · ${r.area}`}
                  </span>
                </span>

                {/* Verified: icon + label, so meaning doesn't rely on the icon alone */}
                <span className="flex flex-shrink-0 items-center gap-1.5 rounded-full border border-white/80 bg-white/70 px-2.5 py-1 text-xs font-medium text-[#06395F]">
                  {r.verified === "practitioner" ? (
                    <BadgeCheck className="h-4 w-4 text-sky-600" aria-hidden />
                  ) : (
                    <CircleCheck className="h-4 w-4 text-emerald-600" aria-hidden />
                  )}
                  <span className="hidden sm:inline">
                    {r.verified === "practitioner" ? "Verified practitioner" : "Verified booking"}
                  </span>
                  <span className="sr-only sm:hidden">
                    {r.verified === "practitioner" ? "Verified practitioner" : "Verified booking"}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* CTA */}
        <div className={cn("mt-12 text-center", isInView ? "animate-fade-up" : "opacity-0")}>
          <Link
            href="#" // replace with your Facebook page URL
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-[#06395F] transition hover:bg-white/80",
              glass,
              focus
            )}
          >
            See 1,200+ more reviews on Facebook
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}