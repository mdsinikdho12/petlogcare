"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Star,
  ShieldCheck,
  Clock,
  Calendar,
  CheckCircle2,
  Stethoscope,
  Scissors,
  Sparkles,
  ArrowRight,
  Heart,
  Share2,
  ExternalLink,
  PhoneCall,
  User,
  Award,
  Layers,
  RotateCw,
} from "lucide-react";
import { CalBookingModal } from "@/components/modules/booking/CalBookingModal";
import { toast } from "sonner";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { apiClient } from "@/lib/api/client";

interface ProviderData {
  id: string;
  name: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  phone: string;
  address: string;
  district: string;
  bio: string;
  coverImage: string;
  highlightBadge: string;
  doctors: Array<{
    name: string;
    qualification: string;
    role: string;
    experience: string;
  }>;
  amenities: string[];
  services: Array<{
    id: string;
    title: string;
    category: string;
    duration: string;
    priceBDT: number;
    description: string;
  }>;
  hours: Array<{
    day: string;
    time: string;
    open: boolean;
  }>;
  reviews: Array<{
    id: string;
    name: string;
    petName: string;
    service: string;
    rating: number;
    date: string;
    comment: string;
  }>;
}

const CLINICS_DATA: Record<string, ProviderData> = {
  "carevet-dhanmondi": {
    id: "carevet-dhanmondi",
    name: "CareVet Animal Hospital & Surgery",
    verified: true,
    rating: 4.9,
    reviewCount: 142,
    phone: "+880 1712-345678",
    address: "House 14, Road 7, Dhanmondi, Dhaka 1205",
    district: "Dhaka",
    coverImage:
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=1200&q=80",
    highlightBadge: "24/7 emergency trauma hospital",
    bio: "CareVet Animal Hospital is a premier companion animal veterinary center offering advanced soft tissue surgery, clinical medicine, ultrasonic dental prophylaxis, in-house hematology laboratory, and emergency outpatient care. Operated by registered veterinarians from Bangladesh Agricultural University.",
    doctors: [
      {
        name: "Dr. Tanvir Ahmed",
        qualification: "DVM, MS (Surgery, BAU)",
        role: "Chief Veterinary Surgeon",
        experience: "12 years experience",
      },
      {
        name: "Dr. Nusrat Jahan",
        qualification: "DVM (BAU), PGD Companion Health",
        role: "Feline & Canine Medicine Specialist",
        experience: "7 years experience",
      },
    ],
    amenities: [
      "In-house automated blood analyzers",
      "Sterile positive-pressure surgical theatre",
      "Digital ultra-low dose X-ray",
      "Dedicated feline recovery ward",
      "24/7 ambulance and trauma dispatch",
      "bKash, Nagad, Visa, Mastercard accepted",
    ],
    services: [
      {
        id: "s-1",
        title: "Comprehensive Veterinary Consultation",
        category: "Veterinary medicine",
        duration: "30 mins",
        priceBDT: 800,
        description:
          "Full physical examination including weight, temperature, dental, cardiac auscultation, and clinical diagnosis.",
      },
      {
        id: "s-2",
        title: "Rabies & Core Annual Booster Vaccination",
        category: "Vaccination passport",
        duration: "20 mins",
        priceBDT: 1200,
        description:
          "Administration of Nobivac / Vanguard core vaccine with official PetCareLog digital health passport synchronization.",
      },
      {
        id: "s-3",
        title: "Ultrasonic Pet Dental Cleaning & Polishing",
        category: "Dental care",
        duration: "45 mins",
        priceBDT: 2500,
        description:
          "Safe tartar removal, subgingival scaling, and antibacterial polishing to prevent periodontal disease under mild sedation.",
      },
      {
        id: "s-4",
        title: "Full Medicated Grooming & De-Shedding Spa",
        category: "Grooming & spa",
        duration: "60 mins",
        priceBDT: 1500,
        description:
          "Hypoallergenic shampoo bath, blow dry, nail clipping, ear cleaning, and sanitary trim.",
      },
      {
        id: "s-5",
        title: "Home Veterinary Doctor Visit (Dhanmondi / Lalmatia)",
        category: "Home visit",
        duration: "45 mins",
        priceBDT: 1600,
        description:
          "Doctor visit at your doorstep for pets that experience car stress or travel anxiety.",
      },
      {
        id: "s-6",
        title: "Pre-Operative Blood Profile & Organ Function",
        category: "Diagnostics",
        duration: "25 mins",
        priceBDT: 1800,
        description:
          "CBC and biochemistry profile to assess liver and kidney safety prior to anesthesia and surgery.",
      },
    ],
    hours: [
      { day: "Sunday", time: "09:00 AM - 09:00 PM", open: true },
      { day: "Monday", time: "09:00 AM - 09:00 PM", open: true },
      { day: "Tuesday", time: "09:00 AM - 09:00 PM", open: true },
      { day: "Wednesday", time: "09:00 AM - 09:00 PM", open: true },
      { day: "Thursday", time: "09:00 AM - 09:00 PM", open: true },
      { day: "Friday", time: "03:00 PM - 09:00 PM", open: true },
      { day: "Saturday", time: "09:00 AM - 09:00 PM", open: true },
    ],
    reviews: [
      {
        id: "r-1",
        name: "Farhan Rahman",
        petName: "Leo (Golden Retriever)",
        service: "Surgery Consultation",
        rating: 5.0,
        date: "3 days ago",
        comment:
          "Dr. Tanvir is exceptionally gentle. He explained the entire surgery protocol and my dog recovered quickly.",
      },
      {
        id: "r-2",
        name: "Nazia Chowdhury",
        petName: "Mimi (Persian Cat)",
        service: "Booster Vaccine",
        rating: 4.9,
        date: "1 week ago",
        comment:
          "Very clean clinic, highly professional staff. The digital vaccine record was immediately synced to my PetCareLog account!",
      },
      {
        id: "r-3",
        name: "Shakib Al Hasan",
        petName: "Bruno (Beagle)",
        service: "Medicated Bath",
        rating: 4.8,
        date: "2 weeks ago",
        comment:
          "Best grooming service in Dhanmondi. Bruno looked great and smelled clean for days.",
      },
    ],
  },
  "paws-clinic-gulshan": {
    id: "paws-clinic-gulshan",
    name: "Paws & Claws Veterinary Care",
    verified: true,
    rating: 4.8,
    reviewCount: 98,
    phone: "+880 1819-223344",
    address: "Plot 22, Road 113, Gulshan-2, Dhaka 1212",
    district: "Dhaka",
    coverImage:
      "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=1200&q=80",
    highlightBadge: "Luxury feline & canine salon",
    bio: "Paws & Claws brings European veterinary care standards to Gulshan. Specializing in advanced diagnostics, orthopedic consults, preventative pet wellness, and premier grooming salon facilities.",
    doctors: [
      {
        name: "Dr. Sarah Mitchell",
        qualification: "BVSc, MRCVS",
        role: "Senior Consultant Veterinarian",
        experience: "14 years experience",
      },
    ],
    amenities: [
      "Climate-controlled private feline lounges",
      "HEPA-filtered grooming salon",
      "Digital dental radiography",
      "Express pharmacy pickup",
    ],
    services: [
      {
        id: "pc-1",
        title: "Standard Veterinary Examination",
        category: "Veterinary medicine",
        duration: "30 mins",
        priceBDT: 1200,
        description: "Comprehensive physical exam, vitals check, nutrition review and tailored wellness advice.",
      },
      {
        id: "pc-2",
        title: "Luxury Medicated Bath & Fur Styling",
        category: "Grooming & spa",
        duration: "60 mins",
        priceBDT: 2000,
        description: "Organic oatmeal bath, paw treatment, ear hygiene, and professional scissor breed styling.",
      },
    ],
    hours: [
      { day: "Sunday - Thursday", time: "10:00 AM - 08:00 PM", open: true },
      { day: "Friday - Saturday", time: "11:00 AM - 07:00 PM", open: true },
    ],
    reviews: [
      {
        id: "pcr-1",
        name: "Ayesha Siddiqua",
        petName: "Simba",
        service: "Full Grooming",
        rating: 5.0,
        date: "4 days ago",
        comment: "Outstanding service. The staff treats animals with so much kindness.",
      },
    ],
  },
};

function formatBDT(amount: number): string {
  return `৳${new Intl.NumberFormat("en-BD").format(amount)}`;
}

export default function ProviderProfileContent({ id }: { id: string }) {
  const [clinic, setClinic] = useState<ProviderData>(
    () => CLINICS_DATA[id] || CLINICS_DATA["carevet-dhanmondi"]
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      setLoading(true);
      apiClient
        .get(`/providers/${id}`)
        .then((res) => {
          const p = res.data?.data;
          if (p && isMounted) {
            setClinic({
              id: p._id || p.id,
              name: p.businessName || "Veterinary Practice",
              verified: p.verified ?? true,
              rating: typeof p.rating === "number" ? p.rating : 4.9,
              reviewCount: typeof p.reviewCount === "number" ? p.reviewCount : 1,
              phone: p.phone || "+880 1700-000000",
              address: `${p.address?.street ? p.address.street + ", " : ""}${
                p.address?.area || ""
              }, ${p.address?.city || p.address?.district || "Dhaka"}`,
              district: p.address?.district || "Dhaka",
              bio:
                p.bio ||
                "Certified veterinary clinic providing comprehensive pet healthcare, surgery, and preventative wellness.",
              coverImage:
                p.cover?.url ||
                p.logo?.url ||
                p.coverImage ||
                "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=1200&q=80",
              highlightBadge:
                p.highlightBadge ||
                (p.serviceModes?.includes("HOME_VISIT")
                  ? "Home visits available"
                  : "Verified partner clinic"),
              doctors:
                p.doctors && p.doctors.length > 0
                  ? p.doctors
                  : [
                      {
                        name: "Dr. Consultant Veterinarian",
                        qualification: "DVM, Registered Practitioner",
                        role: "Chief Attending Vet",
                        experience: "8+ years experience",
                      },
                    ],
              amenities:
                p.amenities && p.amenities.length > 0
                  ? p.amenities
                  : [
                      "Ultrasonic diagnostic equipment",
                      "Digital patient history via PetCareLog",
                      "Vaccination passport synchronization",
                      "bKash, Nagad & card payments accepted",
                    ],
              services:
                Array.isArray(p.services) && p.services.length > 0
                  ? p.services.map((s: any) => ({
                      id: s._id || s.id,
                      title: s.title || s.name || "Veterinary Service",
                      category: s.category || "General care",
                      duration: `${s.durationMinutes || 30} mins`,
                      priceBDT: s.priceBDT || 800,
                      description:
                        s.description ||
                        "Comprehensive veterinary healthcare service.",
                    }))
                  : [
                      {
                        id: "s-1",
                        title: "General Veterinary Consultation",
                        category: "Consultation",
                        duration: "30 mins",
                        priceBDT: 800,
                        description:
                          "Complete physical exam, vitals evaluation, and medical prescription.",
                      },
                    ],
              hours:
                p.operatingHours && p.operatingHours.length > 0
                  ? p.operatingHours.map((h: any) => ({
                      day: h.day,
                      time: `${h.openTime || "09:00 AM"} - ${h.closeTime || "09:00 PM"}`,
                      open: !h.isClosed,
                    }))
                  : [
                      {
                        day: "Saturday - Thursday",
                        time: "09:00 AM - 09:00 PM",
                        open: true,
                      },
                      {
                        day: "Friday",
                        time: "03:00 PM - 09:00 PM",
                        open: true,
                      },
                    ],
              reviews: p.reviews || [],
            });
          }
        })
        .catch((err) => {
          console.warn("Could not fetch provider from API:", err);
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [id]);

  const [activeTab, setActiveTab] = useState<
    "services" | "about" | "doctors" | "reviews"
  >("services");
  const [bookingModalService, setBookingModalService] = useState<any | null>(null);

  return (
    <div className="relative min-h-screen text-[#06395F] pb-16 selection:bg-[#2FB0FF]/20 selection:text-[#06395F]">
      {/* Background ambient blurred blobs */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none overflow-hidden -z-10"
      >
        <div className="absolute -top-16 -left-20 h-[520px] w-[520px] rounded-full bg-[#9EE7FF]/60 blur-3xl" />
        <div className="absolute top-[28%] -right-24 h-[480px] w-[480px] rounded-full bg-[#FFD6E8]/70 blur-3xl" />
        <div className="absolute -bottom-20 left-[18%] h-[460px] w-[460px] rounded-full bg-[#FFF1C9]/60 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32 space-y-6">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px] text-[#06395F]/70">
          <Link href="/" className="hover:text-[#06395F] transition">
            Home
          </Link>
          <span>/</span>
          <Link href="/providers" className="hover:text-[#06395F] transition">
            Find providers
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#06395F] truncate">
            {clinic.name}
          </span>
        </nav>

        {/* Hero Visual Cover Banner */}
        <div className="rounded-[13px] overflow-hidden border border-white/80 bg-white/70 shadow-[0_8px_30px_rgba(1,95,160,0.10),inset_0_1px_0_rgba(255,255,255,0.95)]">
          <div className="relative h-60 sm:h-72 lg:h-80 w-full overflow-hidden bg-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={clinic.coverImage}
              alt={clinic.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06395F]/85 via-[#06395F]/30 to-black/30" />

            {/* Top Badges */}
            <div className="absolute top-4 inset-x-4 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[8px] bg-white/95 backdrop-blur-md text-emerald-700 text-[12px] font-semibold shadow-xs border border-white/80">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified veterinary practice</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toast.success("Clinic saved to favorites")}
                  className="p-2 rounded-[8px] bg-white/95 backdrop-blur-md text-[#06395F] hover:bg-white shadow-xs transition"
                  title="Save clinic"
                  aria-label="Save clinic"
                >
                  <Heart className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Profile link copied!");
                  }}
                  className="p-2 rounded-[8px] bg-white/95 backdrop-blur-md text-[#06395F] hover:bg-white shadow-xs transition"
                  title="Share profile"
                  aria-label="Share profile"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom Header Info overlay on cover */}
            <div className="absolute bottom-4 sm:bottom-6 inset-x-4 sm:inset-x-6 text-white space-y-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[6px] bg-white/20 backdrop-blur-md text-white text-[11px] font-medium border border-white/30">
                {clinic.highlightBadge}
              </span>

              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
                    {clinic.name}
                  </h1>

                  <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-sky-100/90 pt-1">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <strong className="text-white font-bold">{clinic.rating}</strong>
                      <span>({clinic.reviewCount} client reviews)</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-sky-300" />
                      <span>{clinic.address}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`tel:${clinic.phone}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[11px] bg-white/90 text-[#06395F] text-[13px] font-semibold hover:bg-white transition shadow-sm whitespace-nowrap"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#0D8BE0]" />
                    <span>Call clinic</span>
                  </a>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(clinic.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[11px] bg-sky-500/30 text-white border border-white/30 text-[13px] font-semibold hover:bg-sky-500/40 transition whitespace-nowrap"
                  >
                    <span>Directions</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="px-4 sm:px-6 py-3 border-t border-[#06395F]/10 flex items-center gap-2 overflow-x-auto scrollbar-none bg-white/40">
            {[
              { id: "services", label: "Services & pricing", count: clinic.services.length },
              { id: "about", label: "About & operating hours" },
              { id: "doctors", label: "Attending doctors", count: clinic.doctors.length },
              { id: "reviews", label: `Reviews (${clinic.reviewCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-[11px] text-[13px] font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-[#0D8BE0] text-white shadow-xs"
                    : "bg-white/80 text-[#06395F]/80 border border-[#06395F]/10 hover:bg-white hover:text-[#06395F]"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Services & Pricing */}
        {activeTab === "services" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div>
                <h2 className="font-display text-lg font-bold text-[#06395F]">
                  Available clinical services &amp; appointments
                </h2>
                <p className="text-[13px] text-[#06395F]/75">
                  Book online with transparent 10% confirmation deposit via UddoktaPay (bKash/Nagad/Cards).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clinic.services.map((service) => (
                <div
                  key={service.id}
                  className="rounded-[13px] bg-white/85 border border-[#06395F]/10 p-5 shadow-[0_1px_2px_rgba(6,57,95,0.06)] hover:border-[#0D8BE0]/30 hover:-translate-y-0.5 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-[6px] bg-sky-50 text-[#0D8BE0] border border-sky-100 text-[11px] font-semibold">
                        {service.category}
                      </span>
                      <div className="text-right">
                        <span className="text-base font-bold text-[#06395F] tabular-nums">
                          {formatBDT(service.priceBDT)}
                        </span>
                        <span className="block text-[10px] text-[#06395F]/60">
                          (10% online deposit: {formatBDT(Math.round(service.priceBDT * 0.1))})
                        </span>
                      </div>
                    </div>

                    <h3 className="font-display font-bold text-sm sm:text-base text-[#06395F] group-hover:text-[#0D8BE0] transition">
                      {service.title}
                    </h3>

                    <p className="text-[12px] text-[#06395F]/75 leading-relaxed font-normal">
                      {service.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-[11px] text-[#06395F]/70 pt-1">
                      <Clock className="w-3.5 h-3.5 text-[#0D8BE0]" />
                      <span>Estimated duration: <strong>{service.duration}</strong></span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setBookingModalService(service)}
                    className="w-full py-2.5 px-4 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white text-[13px] font-semibold shadow-[0_4px_14px_rgba(13,150,230,0.25)] hover:-translate-y-0.5 transition flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book appointment</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: About & Operating Hours */}
        {activeTab === "about" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Column: About & Amenities */}
            <div className="md:col-span-7 rounded-[13px] bg-white/85 border border-[#06395F]/10 p-6 shadow-[0_1px_2px_rgba(6,57,95,0.06)] space-y-4">
              <h3 className="font-display text-base font-bold text-[#06395F]">
                About the practice
              </h3>
              <p className="text-[13px] text-[#06395F]/80 leading-relaxed font-normal">
                {clinic.bio}
              </p>

              <div className="pt-3 border-t border-[#06395F]/10">
                <span className="text-[13px] font-semibold text-[#06395F] block mb-2.5">
                  Clinical infrastructure &amp; amenities:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px] text-[#06395F]/80">
                  {clinic.amenities.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Operating Hours & Emergency Alert */}
            <div className="md:col-span-5 space-y-5">
              <div className="rounded-[13px] bg-white/85 border border-[#06395F]/10 p-6 shadow-[0_1px_2px_rgba(6,57,95,0.06)] space-y-3">
                <h3 className="font-display text-base font-bold text-[#06395F]">
                  Weekly clinic hours
                </h3>
                <div className="divide-y divide-[#06395F]/10 rounded-[11px] border border-[#06395F]/10 bg-[#F8FBFE] overflow-hidden text-[12px]">
                  {clinic.hours.map((h) => (
                    <div
                      key={h.day}
                      className="p-2.5 flex items-center justify-between"
                    >
                      <span className="font-semibold text-[#06395F]">{h.day}</span>
                      <span className="text-[#06395F]/80">{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency dispatch box */}
              <div className="rounded-[13px] bg-gradient-to-br from-[#06395F] to-[#0B4C7A] p-5 text-white shadow-md">
                <div className="flex items-center gap-2 mb-1.5">
                  <PhoneCall className="w-4 h-4 text-rose-300" />
                  <span className="text-[12px] font-medium text-rose-300">
                    24/7 emergency veterinary line
                  </span>
                </div>
                <h4 className="font-display font-bold text-sm text-white">
                  Need urgent trauma or poison triage?
                </h4>
                <p className="text-[12px] text-sky-100/80 mt-1 leading-relaxed">
                  Call the hospital hotline directly for prioritized admission.
                </p>
                <div className="mt-3">
                  <a
                    href={`tel:${clinic.phone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[9px] bg-white text-[#06395F] font-bold text-[12px] shadow-xs hover:bg-sky-50 transition"
                  >
                    <span>{clinic.phone}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Attending Doctors & Specialists */}
        {activeTab === "doctors" && (
          <div className="space-y-4">
            <h2 className="font-display text-lg font-bold text-[#06395F] px-1">
              Registered veterinary specialists
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clinic.doctors.map((doc, idx) => (
                <div
                  key={idx}
                  className="rounded-[13px] bg-white/85 border border-[#06395F]/10 p-5 shadow-[0_1px_2px_rgba(6,57,95,0.06)] flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-[11px] bg-sky-500/15 text-[#0D8BE0] border border-sky-300/40 flex items-center justify-center font-bold text-lg shrink-0">
                    <User className="w-6 h-6" />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <h3 className="font-display font-bold text-base text-[#06395F] truncate">
                      {doc.name}
                    </h3>
                    <p className="text-[12px] font-semibold text-[#0D8BE0]">
                      {doc.role}
                    </p>
                    <p className="text-[12px] text-[#06395F]/75">
                      {doc.qualification}
                    </p>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-[#F3F9FF] border border-[#06395F]/10 text-[11px] text-[#06395F]/70 font-medium mt-1">
                      <Award className="w-3 h-3 text-amber-500" />
                      <span>{doc.experience}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Reviews */}
        {activeTab === "reviews" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="font-display text-lg font-bold text-[#06395F]">
                Verified client feedback ({clinic.reviewCount})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clinic.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="rounded-[13px] bg-white/85 border border-[#06395F]/10 p-4.5 shadow-[0_1px_2px_rgba(6,57,95,0.06)] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2FB0FF] to-[#0D8BE0] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                        {rev.name.charAt(0)}
                      </div>
                      <div>
                        <span className="text-[13px] font-bold text-[#06395F] block">
                          {rev.name}
                        </span>
                        <span className="text-[11px] text-[#06395F]/60">
                          {rev.petName} • {rev.service}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#06395F]/60">
                      {rev.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>

                  <p className="text-[12px] text-[#06395F]/80 leading-relaxed font-normal">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Cal.com-Style Booking Modal */}
      {bookingModalService && (
        <CalBookingModal
          provider={{
            id: clinic.id,
            name: clinic.name,
            address: clinic.address,
          }}
          service={bookingModalService}
          onClose={() => setBookingModalService(null)}
        />
      )}
    </div>
  );
}
