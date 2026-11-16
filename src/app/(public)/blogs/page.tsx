// src/app/(public)/blogs/page.tsx
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

export const metadata = {
  title: "Pet Care Guides & Veterinary Articles | PetCareLog Bangladesh",
  description:
    "Expert pet healthcare advice, vaccination calendars, seasonal wellness tips, and feline/canine nutrition for pet parents in Dhaka and Chittagong.",
};

export const blogPosts = [
  {
    slug: "dog-cat-vaccination-schedule-bangladesh",
    title: "Complete Canine & Feline Vaccination Schedule for Bangladesh",
    excerpt:
      "A vet-approved guide to core Rabies, DHPPi, and Tricat boosters in Bangladesh's climate. Know the exact weeks and costs.",
    author: "Dr. Samira Khan (DVM, MS)",
    authorRole: "Chief Veterinary Surgeon, CareVet",
    date: "12 Nov 2026",
    readTime: "6 min read",
    category: "Vaccination & Preventive",
    image:
      "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    slug: "monsoon-pet-care-preventing-fungal-infections",
    title: "Monsoon Pet Health: Preventing Fungal & Tick Dermatitis in High Humidity",
    excerpt:
      "High humidity in Dhaka causes severe paw pododermatitis and ear infections. Learn clinical hygiene and drying techniques.",
    author: "Dr. Farhan Chowdhury (DVM)",
    authorRole: "Feline Specialist, Paws & Claws",
    date: "04 Nov 2026",
    readTime: "5 min read",
    category: "Seasonal Wellness",
    image:
      "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "canine-heatstroke-first-aid-bangladesh",
    title: "Emergency First Aid: Recognizing Heatstroke in Dogs Before Reaching the Vet",
    excerpt:
      "Critical cooling protocols that save lives when summer temperatures soar above 38°C in urban Dhaka.",
    author: "Dr. Tanvir Ahmed (DVM)",
    authorRole: "Emergency Veterinarian",
    date: "28 Oct 2026",
    readTime: "4 min read",
    category: "Emergency & First Aid",
    image:
      "https://images.unsplash.com/photo-1534361960057-19889db98a1e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "feline-urinary-blockage-signs",
    title: "Male Cat Straining in Litter Box? Signs of Fatal Feline FLUTD",
    excerpt:
      "Why straining without urine is an immediate 24-hour medical emergency and how dry food hydration imbalances trigger crystals.",
    author: "Dr. Farhana Yasmin (DVM)",
    authorRole: "Small Animal Practitioner",
    date: "19 Oct 2026",
    readTime: "7 min read",
    category: "Clinical Diagnostics",
    image:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function BlogsPage() {
  const [featured, ...regular] = blogPosts;

  return (
    <div className="relative min-h-screen text-[#06395F] pt-24 sm:pt-28 lg:pt-32 pb-20">
      {/* Background ambient blooms */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none overflow-hidden -z-10"
      >
        <div className="absolute top-1/4 -left-20 h-[520px] w-[520px] rounded-full bg-[#9EE7FF]/60 blur-3xl" />
        <div className="absolute top-1/3 -right-20 h-[500px] w-[500px] rounded-full bg-[#FFD6E8]/70 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-[480px] w-[480px] rounded-full bg-[#FFF1C9]/60 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Hero */}
        <div className="rounded-[13px] border border-white/80 bg-white/55 backdrop-blur-xl backdrop-saturate-150 p-8 sm:p-10 shadow-[0_8px_30px_rgba(1,95,160,0.10),inset_0_1px_0_rgba(255,255,255,0.95)] space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[8px] bg-sky-500/15 text-[#0D8BE0] text-[12px] font-semibold border border-white/80">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Veterinary medicine & care guides</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#06395F]">
            Pet healthcare knowledge hub
          </h1>

          <p className="text-sm sm:text-base text-[#06395F]/80 max-w-2xl font-normal leading-relaxed">
            Written and reviewed by licensed Bangladeshi veterinarians (DVM). Practical guides on vaccinations, seasonal illnesses, emergency triage, and pet nutrition.
          </p>
        </div>

        {/* Featured Article */}
        {featured && (
          <Link
            href={`/blogs/${featured.slug}`}
            className="group block rounded-[13px] bg-white/85 border border-[#06395F]/10 overflow-hidden shadow-[0_1px_2px_rgba(6,57,95,0.06)] hover:border-[#0D8BE0]/40 transition"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-7 h-64 sm:h-80 lg:h-auto relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-[8px] bg-white/95 text-[#0D8BE0] text-xs font-bold shadow-xs">
                  Featured Guide
                </span>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <span className="px-2.5 py-0.5 rounded-[6px] bg-sky-50 text-[#0D8BE0] border border-sky-100 text-[11px] font-semibold">
                    {featured.category}
                  </span>

                  <h2 className="font-display text-xl sm:text-2xl font-bold text-[#06395F] group-hover:text-[#0D8BE0] transition-colors leading-snug">
                    {featured.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#06395F]/80 leading-relaxed font-normal">
                    {featured.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#06395F]/10 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-xs text-[#06395F]">{featured.author}</p>
                    <p className="text-[11px] text-[#06395F]/60">{featured.date} • {featured.readTime}</p>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0D8BE0] group-hover:translate-x-1 transition-transform">
                    <span>Read guide</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Regular Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regular.map((post) => (
            <Link
              key={post.slug}
              href={`/blogs/${post.slug}`}
              className="group flex flex-col justify-between rounded-[13px] bg-white/85 border border-[#06395F]/10 overflow-hidden shadow-[0_1px_2px_rgba(6,57,95,0.06)] hover:border-[#0D8BE0]/40 transition"
            >
              <div>
                <div className="h-48 relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-[6px] bg-white/90 text-[#06395F] text-[10px] font-bold shadow-2xs">
                    {post.category}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-display text-base font-bold text-[#06395F] group-hover:text-[#0D8BE0] transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-[#06395F]/75 line-clamp-2 font-normal leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-[#06395F]/10 flex items-center justify-between text-[11px] text-[#06395F]/70">
                  <span>{post.author}</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
