"use client";

import { Suspense, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  MapPin,
  Star,
  ShieldCheck,
  Stethoscope,
  Clock,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  Home,
  Building,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import type { ProviderProfile } from "@/types";

interface EnrichedProvider extends ProviderProfile {
  coverImage: string;
  startingPriceBDT: number;
  highlightBadge: string;
  featuredServices: string[];
  nextAvailableSlot: string;
}

const BANGLADESH_DISTRICTS = [
  "All Districts",
  "Dhaka",
  "Chittagong",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barisal",
  "Rangpur",
  "Comilla",
  "Gazipur",
  "Narayanganj",
];

const CATEGORIES = [
  { id: "ALL", label: "All categories" },
  { id: "VET_CARE", label: "Veterinary medicine" },
  { id: "SURGERY", label: "Surgery & ICU" },
  { id: "GROOMING", label: "Grooming & spa" },
  { id: "BOARDING", label: "Boarding & daycare" },
  { id: "VACCINATION", label: "Vaccination passport" },
];

function formatBDT(amount: number): string {
  return `৳${new Intl.NumberFormat("en-BD").format(amount)}`;
}

// Curated verified veterinary clinics with professional photography
const MOCK_PROVIDERS: EnrichedProvider[] = [
  {
    id: "carevet-dhanmondi",
    userId: "u-1",
    businessName: "CareVet Animal Hospital & Surgery",
    rating: 4.9,
    reviewCount: 142,
    categories: ["VET_CARE", "SURGERY", "VACCINATION"],
    serviceModes: ["IN_CLINIC", "HOME_VISIT"],
    address: {
      street: "House 14, Road 7",
      area: "Dhanmondi",
      city: "Dhaka",
      district: "Dhaka",
    },
    bio: "State-of-the-art veterinary clinic specializing in small companion pets, diagnostic surgery, and preventative vaccination.",
    verified: true,
    verificationStatus: "APPROVED",
    coverImage:
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80",
    startingPriceBDT: 800,
    highlightBadge: "24/7 emergency trauma",
    featuredServices: ["General consult", "Vaccine booster", "Soft tissue surgery"],
    nextAvailableSlot: "Today, 10:30 AM",
  },
  {
    id: "paws-clinic-gulshan",
    userId: "u-2",
    businessName: "Paws & Claws Veterinary Care",
    rating: 4.8,
    reviewCount: 98,
    categories: ["VET_CARE", "GROOMING"],
    serviceModes: ["IN_CLINIC"],
    address: {
      street: "Plot 22, Road 113",
      area: "Gulshan-2",
      city: "Dhaka",
      district: "Dhaka",
    },
    bio: "Compassionate feline and canine specialists with international standard surgical suites and luxury grooming salon.",
    verified: true,
    verificationStatus: "APPROVED",
    coverImage:
      "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=800&q=80",
    startingPriceBDT: 1200,
    highlightBadge: "Luxury feline & canine salon",
    featuredServices: ["Doctor checkup", "Medicated flea bath", "Dental scale"],
    nextAvailableSlot: "Today, 02:00 PM",
  },
  {
    id: "uttara-pet-wellness",
    userId: "u-3",
    businessName: "Uttara Pet Wellness & Emergency Center",
    rating: 4.9,
    reviewCount: 76,
    categories: ["VET_CARE", "SURGERY", "BOARDING"],
    serviceModes: ["IN_CLINIC", "HOME_VISIT"],
    address: {
      street: "Sector 4, Road 18",
      area: "Uttara",
      city: "Dhaka",
      district: "Dhaka",
    },
    bio: "24/7 emergency critical care unit for companion pets, dental prophylaxis, and climate-controlled boarding suites.",
    verified: true,
    verificationStatus: "APPROVED",
    coverImage:
      "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80",
    startingPriceBDT: 1000,
    highlightBadge: "ICU & overnight boarding",
    featuredServices: ["Trauma triage", "Digital X-ray", "Boarding suite"],
    nextAvailableSlot: "Today, 11:15 AM",
  },
  {
    id: "chittagong-pet-care",
    userId: "u-4",
    businessName: "Chittagong Pet Health & Surgery",
    rating: 4.7,
    reviewCount: 54,
    categories: ["VET_CARE", "VACCINATION"],
    serviceModes: ["IN_CLINIC"],
    address: {
      street: "GEC Circle, Nasirabad",
      area: "Nasirabad",
      city: "Chittagong",
      district: "Chittagong",
    },
    bio: "Premier animal care clinic in Chittagong port city dedicated to high quality veterinary diagnostics and surgical care.",
    verified: true,
    verificationStatus: "APPROVED",
    coverImage:
      "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800&q=80",
    startingPriceBDT: 600,
    highlightBadge: "Premier port hospital",
    featuredServices: ["General consult", "Vaccine passport", "Blood analyzer"],
    nextAvailableSlot: "Tomorrow, 09:30 AM",
  },
  {
    id: "dhanmondi-fluffy-groomers",
    userId: "u-5",
    businessName: "Fluffy Tails Grooming & Boarding Resort",
    rating: 4.9,
    reviewCount: 89,
    categories: ["GROOMING", "BOARDING"],
    serviceModes: ["IN_CLINIC", "HOME_VISIT"],
    address: {
      street: "Satmasjid Road",
      area: "Dhanmondi",
      city: "Dhaka",
      district: "Dhaka",
    },
    bio: "Hygienic, stress-free medicated pet baths, breed-specific trimming, de-shedding treatments, and climate-controlled boarding.",
    verified: true,
    verificationStatus: "APPROVED",
    coverImage:
      "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80",
    startingPriceBDT: 1500,
    highlightBadge: "Top rated grooming spa",
    featuredServices: ["Full body de-shedding", "Sanitary trim", "Organic spa"],
    nextAvailableSlot: "Today, 03:30 PM",
  },
  {
    id: "mirpur-central-vet",
    userId: "u-6",
    businessName: "Mirpur Central Pet Clinic",
    rating: 4.6,
    reviewCount: 43,
    categories: ["VET_CARE", "VACCINATION"],
    serviceModes: ["IN_CLINIC", "HOME_VISIT"],
    address: {
      street: "Block D, Section 10",
      area: "Mirpur",
      city: "Dhaka",
      district: "Dhaka",
    },
    bio: "Affordable and trusted veterinary doctor consultations, home vaccine visits, and microchipping services.",
    verified: true,
    verificationStatus: "APPROVED",
    coverImage:
      "https://images.unsplash.com/photo-1606425271394-c3ca9aa1fc06?auto=format&fit=crop&w=800&q=80",
    startingPriceBDT: 500,
    highlightBadge: "Affordable community care",
    featuredServices: ["Doctor consult", "Rabies injection", "Microchip sync"],
    nextAvailableSlot: "Today, 04:00 PM",
  },
];

function DirectoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "ALL"
  );
  const [selectedDistrict, setSelectedDistrict] = useState(
    searchParams.get("district") || "All Districts"
  );
  const [serviceModeFilter, setServiceModeFilter] = useState<string>("ALL");

  // Filtered providers
  const filteredProviders = useMemo(() => {
    return MOCK_PROVIDERS.filter((provider) => {
      // Search term
      if (
        searchTerm &&
        !provider.businessName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !provider.address.area?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !provider.address.city.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !provider.bio?.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Category filter
      if (
        selectedCategory !== "ALL" &&
        !provider.categories.includes(selectedCategory as any)
      ) {
        return false;
      }

      // District filter
      if (
        selectedDistrict !== "All Districts" &&
        provider.address.district.toLowerCase() !== selectedDistrict.toLowerCase()
      ) {
        return false;
      }

      // Service mode filter
      if (
        serviceModeFilter !== "ALL" &&
        !provider.serviceModes.includes(serviceModeFilter as any)
      ) {
        return false;
      }

      return true;
    });
  }, [searchTerm, selectedCategory, selectedDistrict, serviceModeFilter]);

  return (
    <div className="relative min-h-screen text-[#06395F] pb-16 selection:bg-[#2FB0FF]/20 selection:text-[#06395F]">
      {/* Ambient background blurred blobs for Apple liquid glass depth */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none overflow-hidden -z-10"
      >
        <div className="absolute -top-16 -left-20 h-[520px] w-[520px] rounded-full bg-[#9EE7FF]/60 blur-3xl" />
        <div className="absolute top-[28%] -right-24 h-[480px] w-[480px] rounded-full bg-[#FFD6E8]/70 blur-3xl" />
        <div className="absolute -bottom-20 left-[18%] h-[460px] w-[460px] rounded-full bg-[#FFF1C9]/60 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32 space-y-6 sm:space-y-8">
        {/* Header Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[8px] bg-sky-500/15 text-[#0D8BE0] text-[12px] font-semibold border border-white/80 shadow-xs">
            
            <span>Verified veterinary directory</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-[#06395F] leading-tight">
            Find trusted care for your companion
          </h1>
          <p className="text-sm sm:text-base text-[#06395F]/80 font-normal leading-relaxed">
            Search certified animal hospitals, veterinary surgeons, grooming spas and boarding clinics across Dhaka, Chittagong and all Bangladesh districts.
          </p>
        </div>

        {/* Unified Search & Filter Console (Apple Liquid Glass) */}
        <div className="rounded-[13px] border border-white/80 bg-white/65 backdrop-blur-xl backdrop-saturate-150 p-4 sm:p-5 shadow-[0_8px_30px_rgba(1,95,160,0.10),inset_0_1px_0_rgba(255,255,255,0.95)] space-y-4">
          {/* Top Row: Search input + District + Service Mode */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#06395F]/50" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by clinic name, doctor, area (e.g. Dhanmondi, Gulshan)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-[11px] border border-[#06395F]/15 bg-white text-[13px] text-[#06395F] placeholder:text-[#06395F]/45 focus:outline-none focus:border-[#0D8BE0] focus:ring-2 focus:ring-[#0D8BE0]/20 shadow-2xs"
              />
            </div>

            {/* District Dropdown */}
            <div className="md:col-span-3 relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#06395F]/50" />
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 rounded-[11px] border border-[#06395F]/15 bg-white text-[13px] text-[#06395F] focus:outline-none focus:border-[#0D8BE0] focus:ring-2 focus:ring-[#0D8BE0]/20 shadow-2xs appearance-none cursor-pointer"
              >
                {BANGLADESH_DISTRICTS.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            {/* Service Mode Selector */}
            <div className="md:col-span-3">
              <select
                value={serviceModeFilter}
                onChange={(e) => setServiceModeFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-[11px] border border-[#06395F]/15 bg-white text-[13px] text-[#06395F] focus:outline-none focus:border-[#0D8BE0] focus:ring-2 focus:ring-[#0D8BE0]/20 shadow-2xs appearance-none cursor-pointer"
              >
                <option value="ALL">All service modes</option>
                <option value="IN_CLINIC">In-clinic appointments</option>
                <option value="HOME_VISIT">Home visits available</option>
              </select>
            </div>
          </div>

          {/* Bottom Row: Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-[#06395F]/10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-[11px] text-[12px] font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? "bg-[#0D8BE0] text-white shadow-xs"
                    : "bg-white/80 text-[#06395F]/80 border border-[#06395F]/10 hover:bg-white hover:text-[#06395F]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between text-[13px] text-[#06395F]/75 px-1">
          <span>
            Showing <strong>{filteredProviders.length}</strong> verified pet care providers
          </span>
          <span className="text-[12px] font-medium text-[#06395F]/60">
            Sorted by highest patient rating
          </span>
        </div>

        {/* Provider Cards Bento Grid */}
        {filteredProviders.length === 0 ? (
          <div className="rounded-[13px] bg-white/85 border border-[#06395F]/10 p-12 text-center space-y-3 shadow-[0_1px_2px_rgba(6,57,95,0.06)]">
            <div className="w-12 h-12 mx-auto rounded-[11px] bg-sky-50 text-[#0D8BE0] flex items-center justify-center border border-sky-100">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h3 className="font-display text-base font-bold text-[#06395F]">
              No matching clinics found
            </h3>
            <p className="text-[13px] text-[#06395F]/75 max-w-sm mx-auto">
              Try adjusting your search keywords, district selection, or category filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("ALL");
                setSelectedDistrict("All Districts");
                setServiceModeFilter("ALL");
              }}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white text-[12px] font-semibold shadow-xs"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => (
              <div
                key={provider.id}
                className="group rounded-[13px] bg-white/85 border border-[#06395F]/10 shadow-[0_2px_12px_rgba(6,57,95,0.06)] hover:shadow-[0_12px_32px_rgba(1,95,160,0.14)] hover:border-[#0D8BE0]/30 hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Visual Clinic Cover Photo */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={provider.coverImage}
                      alt={provider.businessName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#06395F]/70 via-transparent to-black/20" />

                    {/* Top Overlays */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[8px] bg-white/95 backdrop-blur-md text-emerald-700 text-[11px] font-semibold shadow-xs border border-white/80">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verified</span>
                      </span>

                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[8px] bg-white/95 backdrop-blur-md text-[#06395F] text-[11px] font-bold shadow-xs border border-white/80">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{provider.rating}</span>
                        <span className="text-[#06395F]/60 font-normal">({provider.reviewCount})</span>
                      </span>
                    </div>

                    {/* Bottom Highlight Badge on Cover */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-[8px] bg-[#06395F]/85 backdrop-blur-md text-white text-[11px] font-medium border border-white/20 shadow-xs truncate">
                        {provider.highlightBadge}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="font-display text-base sm:text-lg font-bold text-[#06395F] line-clamp-1 group-hover:text-[#0D8BE0] transition">
                        {provider.businessName}
                      </h3>
                      <div className="flex items-center gap-1 text-[12px] text-[#06395F]/75 font-medium mt-1">
                        <MapPin className="w-3.5 h-3.5 text-[#0D8BE0] shrink-0" />
                        <span className="truncate">
                          {provider.address.area}, {provider.address.city}
                        </span>
                      </div>
                    </div>

                    <p className="text-[12px] text-[#06395F]/75 line-clamp-2 leading-relaxed font-normal">
                      {provider.bio}
                    </p>

                    {/* Featured Service Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {provider.featuredServices.map((svc, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-[6px] bg-[#F3F9FF] border border-[#06395F]/10 text-[#06395F] text-[11px] font-medium"
                        >
                          {svc}
                        </span>
                      ))}
                    </div>

                    {/* Next slot & service mode */}
                    <div className="pt-2 border-t border-[#06395F]/10 flex items-center justify-between text-[12px]">
                      <div className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                        <Clock className="w-3 h-3 text-emerald-600" />
                        <span>{provider.nextAvailableSlot}</span>
                      </div>

                      <div className="flex items-center gap-1 text-[10px] text-[#06395F]/60 font-semibold">
                        {provider.serviceModes.includes("HOME_VISIT") ? (
                          <span className="px-1.5 py-0.5 rounded-[6px] bg-sky-50 text-[#0D8BE0] border border-sky-100">
                            Home visit
                          </span>
                        ) : null}
                        <span className="px-1.5 py-0.5 rounded-[6px] bg-slate-100 text-[#06395F]/75">
                          In-clinic
                        </span>
                      </div>
                    </div>

                    {/* Pricing Row */}
                    <div className="pt-2 border-t border-[#06395F]/10 flex items-center justify-between text-[12px]">
                      <span className="text-[#06395F]/70">
                        Consultation from
                      </span>
                      <strong className="text-base font-bold text-[#06395F] tabular-nums">
                        {formatBDT(provider.startingPriceBDT)}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Primary CTA Button */}
                <div className="px-5 pb-5 pt-1">
                  <Link
                    href={`/providers/${provider.id}`}
                    className="w-full py-2.5 px-4 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] hover:-translate-y-0.5 active:translate-y-0 text-white text-[13px] font-semibold tracking-wide shadow-[0_4px_14px_rgba(13,150,230,0.25)] transition flex items-center justify-center gap-1.5 group-hover:shadow-[0_6px_20px_rgba(13,150,230,0.35)]"
                  >
                    <span>View profile &amp; book</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProvidersDirectoryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-sky-50 text-sm text-[#06395F]">
          <div className="w-8 h-8 border-2 border-[#0D8BE0] border-t-transparent rounded-full animate-spin mb-2" />
        </div>
      }
    >
      <DirectoryContent />
    </Suspense>
  );
}
