// src/app/dashboard/owner/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  PawPrint,
  Dog,
  CalendarCheck2,
  Bell,
  Plus,
  ArrowRight,
  Stethoscope,
  MapPin,
  MessageSquare,
  FileText,
  Activity,
  ChevronRight,
  PhoneCall,
  CheckCircle2,
  CreditCard,
  Banknote,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { apiClient } from "@/lib/api/client";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import EmptyState from "@/components/dashboard/EmptyState";
import { BentoHeroSkeleton, StatCardsSkeleton } from "@/components/dashboard/DashboardSkeleton";

interface PetSummary {
  id: string;
  name: string;
  species: "DOG" | "CAT" | "OTHER";
  breed: string;
  age: string;
  weight: string;
  vaccineStatus: "UP_TO_DATE" | "EXPIRING_SOON" | "PENDING";
  lastCheckup: string;
}

// Bangladesh currency formatter using en-BD locale
function formatBDT(amount: number): string {
  return `৳${new Intl.NumberFormat("en-BD").format(amount)}`;
}

export default function OwnerDashboardPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  // Companion data for Bangladesh context
  const [pets, setPets] = useState<PetSummary[]>([
    {
      id: "pet-1",
      name: "Milo",
      species: "DOG",
      breed: "Golden Retriever",
      age: "2 yrs 3 mos",
      weight: "28.4 kg",
      vaccineStatus: "UP_TO_DATE",
      lastCheckup: "02 Nov 2026",
    },
    {
      id: "pet-2",
      name: "Luna",
      species: "CAT",
      breed: "Persian Cat",
      age: "1 yr 6 mos",
      weight: "4.1 kg",
      vaccineStatus: "UP_TO_DATE",
      lastCheckup: "24 Oct 2026",
    },
  ]);

  useEffect(() => {
    async function loadPets() {
      try {
        setLoading(true);
        const { data } = await apiClient.get("/pets");
        if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
          setPets(data.data);
        }
      } catch (err) {
        // Fallback gracefully to demo state
      } finally {
        setLoading(false);
      }
    }
    loadPets();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-12 gap-5 sm:gap-6">
          <BentoHeroSkeleton />
        </div>
        <StatCardsSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* ── 12-Column Overview Grid ────────────────────────────────────────── */}

      {/* ROW 1: Bento Hero Card (8 cols) + Emergency Helpline Card (4 cols) */}
      <div className="grid grid-cols-12 gap-5 sm:gap-6">
        {/* Bento Hero Card (Liquid Glass) */}
        <div className="col-span-12 xl:col-span-8 rounded-[13px] border border-white/80 bg-white/55 p-6 sm:p-7 backdrop-blur-xl backdrop-saturate-150 shadow-[0_8px_30px_rgba(1,95,160,0.10),inset_0_1px_0_rgba(255,255,255,0.95)] flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-sky-500/15 text-[#0D8BE0] text-[12px] font-semibold mb-3 border border-white/80 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pet care command center</span>
            </div>

            <h1 className="font-display text-2xl sm:text-[28px] font-bold tracking-tight text-[#06395F] leading-tight">
              Welcome back, {user?.name?.split(" ")[0] || "Pet Parent"}
            </h1>

            <p className="text-sm text-[#06395F]/80 mt-1.5 max-w-2xl font-normal leading-relaxed">
              All registered pet passports are synchronized. Next preventative booster vaccination scheduled in 18 days.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <Link
              href="/dashboard/owner/pets"
              className="inline-flex items-center justify-center gap-2 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] px-4 py-2.5 text-[13px] font-semibold text-white shadow-[0_4px_14px_rgba(13,150,230,0.30)] transition hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add pet</span>
            </Link>

            <Link
              href="/providers"
              className="inline-flex items-center justify-center gap-2 rounded-[11px] border border-[#06395F]/10 bg-white/80 px-4 py-2.5 text-[13px] font-semibold text-[#06395F] shadow-[0_1px_2px_rgba(6,57,95,0.04)] hover:bg-white hover:-translate-y-0.5 transition"
            >
              <Stethoscope className="w-4 h-4 text-[#0D8BE0]" />
              <span>Find verified vet</span>
            </Link>
          </div>
        </div>

        {/* Emergency Vet Quick Action Card (Single Dark Accent, 4 cols) */}
        <div className="col-span-12 xl:col-span-4 rounded-[13px] bg-gradient-to-br from-[#06395F] to-[#0B4C7A] p-6 text-white shadow-[0_8px_30px_rgba(6,57,95,0.18)] flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-[8px] bg-rose-500/30 text-rose-300">
                <PhoneCall className="w-3.5 h-3.5" />
              </div>
              <span className="text-[12px] font-medium text-rose-300">
                24/7 emergency vet helpline
              </span>
            </div>

            <h2 className="font-display text-base sm:text-lg font-bold text-white">
              Emergency veterinary dispatch
            </h2>

            <p className="text-[13px] text-sky-100/85 mt-1 leading-relaxed font-normal">
              Immediate critical care, poison control and trauma triage across Dhaka and all Bangladesh districts.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a
              href="tel:+8801700000000"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[11px] bg-white text-[#06395F] font-bold text-[13px] shadow-sm hover:bg-sky-50 transition whitespace-nowrap"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
              <span>Call 01700-000000</span>
            </a>

            <Link
              href="/providers"
              className="text-[13px] font-semibold text-white/90 hover:underline whitespace-nowrap"
            >
              Find clinics →
            </Link>
          </div>
        </div>
      </div>

      {/* ROW 2: Stat Cards Grid (4 x 3 cols = 12 cols, zero orphan gaps) */}
      <div className="grid grid-cols-12 gap-5 sm:gap-6">
        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <StatCard
            title="Registered pets"
            value={pets.length}
            subtitle="All passports valid"
            icon={Dog}
            tint="sky"
            badge={<StatusBadge status="ACTIVE" label="Verified" />}
            href="/dashboard/owner/pets"
          />
        </div>

        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <StatCard
            title="Next clinic visit"
            value="Tomorrow"
            subtitle="10:30 AM • Central Vet"
            icon={CalendarCheck2}
            tint="indigo"
            badge={<StatusBadge status="CONFIRMED" label="Scheduled" />}
            href="/dashboard/owner/bookings"
          />
        </div>

        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <StatCard
            title="Booster schedule"
            value="18 days"
            subtitle="Rabies annual booster"
            icon={Bell}
            tint="amber"
            badge={<StatusBadge status="PENDING" label="Due soon" />}
            href="/dashboard/owner/reminders"
          />
        </div>

        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <StatCard
            title="Health vault files"
            value="6 files"
            subtitle="Encrypted records"
            icon={FileText}
            tint="emerald"
            badge={<StatusBadge status="VALID" label="Secured" />}
            href="/dashboard/owner/pets/pet-1"
          />
        </div>
      </div>

      {/* ROW 3: Companion Pets (7 cols) + Booster Reminders (5 cols) */}
      <div className="grid grid-cols-12 gap-5 sm:gap-6">
        {/* Left Column (7 cols): Companion Pets */}
        <div className="col-span-12 xl:col-span-7 rounded-[13px] bg-white/85 border border-[#06395F]/10 p-5 sm:p-6 shadow-[0_1px_2px_rgba(6,57,95,0.06)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-base font-bold text-[#06395F]">
                My companion pets
              </h2>
              <p className="text-[13px] text-[#06395F]/75 font-normal">
                Vaccine status, biological passport and health records
              </p>
            </div>

            <Link
              href="/dashboard/owner/pets"
              className="text-[13px] font-semibold text-[#0D8BE0] hover:underline flex items-center gap-1 whitespace-nowrap"
            >
              <span>Manage all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {pets.length === 0 ? (
            <EmptyState
              icon={Dog}
              title="No pets added yet"
              description="Add your first companion to track vaccinations, medical history, and appointments."
              action={{
                label: "Create pet profile",
                href: "/dashboard/owner/pets",
              }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {pets.map((pet) => (
                <div
                  key={pet.id}
                  className="rounded-[11px] bg-[#F3F9FF] border border-[#06395F]/10 p-4 hover:border-[#0D8BE0]/30 hover:-translate-y-0.5 transition-all shadow-xs group"
                >
                  <div className="flex items-start justify-between gap-2 min-w-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-sky-500/15 text-[#0D8BE0] border border-sky-300/40">
                        {pet.species === "CAT" ? (
                          <PawPrint className="h-4.5 w-4.5" />
                        ) : (
                          <Dog className="h-4.5 w-4.5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-[#06395F] truncate">
                          {pet.name}
                        </h3>
                        <p className="text-[12px] text-[#06395F]/75 font-medium truncate">
                          {pet.breed || pet.species}
                        </p>
                      </div>
                    </div>

                    <StatusBadge status={pet.vaccineStatus} label="Healthy" />
                  </div>

                  <div className="mt-3.5 pt-2.5 border-t border-[#06395F]/10 grid grid-cols-2 gap-2 text-[12px] text-[#06395F]/80">
                    <div>
                      <span className="text-[11px] text-[#06395F]/60 block font-medium">Age</span>
                      <strong className="text-[#06395F] tabular-nums font-semibold">{pet.age}</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-[#06395F]/60 block font-medium">Weight</span>
                      <strong className="text-[#06395F] tabular-nums font-semibold">{pet.weight}</strong>
                    </div>
                  </div>

                  <div className="mt-3 pt-1">
                    <Link
                      href={`/dashboard/owner/pets/${pet.id}`}
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-[9px] bg-white text-[#0D8BE0] border border-[#06395F]/10 hover:bg-sky-50 text-[12px] font-semibold transition shadow-2xs"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>Open health hub</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (5 cols): Booster Reminders */}
        <div className="col-span-12 xl:col-span-5 rounded-[13px] bg-white/85 border border-[#06395F]/10 p-5 sm:p-6 shadow-[0_1px_2px_rgba(6,57,95,0.06)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-base font-bold text-[#06395F]">
                  Booster reminders
                </h2>
                <p className="text-[13px] text-[#06395F]/75 font-normal">
                  Automated schedules for vaccines & preventative care
                </p>
              </div>

              <Link
                href="/dashboard/owner/reminders"
                className="text-[13px] font-semibold text-[#0D8BE0] hover:underline whitespace-nowrap"
              >
                View all
              </Link>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-[11px] bg-[#F3F9FF] border border-[#06395F]/10 flex items-start gap-3 shadow-xs">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[11px] bg-amber-500/15 text-amber-600 border border-amber-300/40 mt-0.5">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-[13px] text-[#06395F] truncate">
                      Rabies multi-booster
                    </h3>
                    <StatusBadge status="PENDING" label="Due in 18d" />
                  </div>
                  <p className="text-[12px] text-[#06395F]/75 mt-0.5">
                    For <strong>Milo</strong> • Central Pet Hospital
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-[11px] bg-[#F3F9FF] border border-[#06395F]/10 flex items-start gap-3 shadow-xs">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[11px] bg-emerald-500/15 text-emerald-600 border border-emerald-300/40 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-[13px] text-[#06395F] truncate">
                      Tricat core vaccination
                    </h3>
                    <StatusBadge status="COMPLETED" label="Completed" />
                  </div>
                  <p className="text-[12px] text-[#06395F]/75 mt-0.5">
                    For <strong>Luna</strong> • Given by Dr. Tanvir
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 4: Next Scheduled Appointment (Full Width 12 Columns, Zero Orphan Gaps) */}
      <div className="grid grid-cols-12 gap-5 sm:gap-6">
        <div className="col-span-12 rounded-[13px] bg-white/85 border border-[#06395F]/10 p-5 sm:p-6 shadow-[0_1px_2px_rgba(6,57,95,0.06)]">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <h2 className="font-display text-base font-bold text-[#06395F]">
                Next scheduled appointment
              </h2>
            </div>
            <StatusBadge status="UPCOMING" label="Tomorrow at 10:30 AM" />
          </div>

          <div className="p-4 rounded-[11px] bg-[#F3F9FF] border border-[#06395F]/10 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white shadow-xs">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-[#06395F] truncate">
                    Central Pet Hospital &amp; Surgery Center
                  </h3>
                  <p className="text-[13px] text-[#06395F]/80 mt-0.5">
                    Attending: <strong>Dr. Tanvir Ahmed (DVM, MS)</strong>
                  </p>
                  <p className="text-[12px] text-[#0D8BE0] font-semibold mt-0.5">
                    Service: Annual booster vaccination for Milo
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/dashboard/owner/messages"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[11px] bg-white border border-[#06395F]/10 text-[12px] font-semibold text-[#06395F] hover:bg-sky-50 shadow-2xs transition whitespace-nowrap"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#0D8BE0]" />
                  <span>Chat</span>
                </Link>
                <Link
                  href="/dashboard/owner/bookings"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white text-[12px] font-semibold shadow-xs transition hover:-translate-y-0.5 whitespace-nowrap"
                >
                  <span>View slip</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Financial Split Visual Split Pill */}
            <div className="mt-4 p-3 rounded-[9px] bg-white border border-[#06395F]/10 flex flex-wrap items-center justify-between text-[13px] gap-2.5">
              <div className="flex items-center gap-2 text-[#06395F]">
                <CreditCard className="w-4 h-4 text-[#0D8BE0] shrink-0" />
                <span>
                  10% deposit: <strong className="font-bold tabular-nums text-[#06395F]">{formatBDT(250)}</strong> (Paid online via UddoktaPay)
                </span>
              </div>
              <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                <Banknote className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  90% balance: <strong className="font-bold tabular-nums text-emerald-800">{formatBDT(2250)}</strong> (Cash at counter)
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-[#06395F]/10 flex flex-wrap items-center justify-between text-[12px] text-[#06395F]/75 gap-2">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#0D8BE0] shrink-0" />
                <span>House 42, Road 9/A, Dhanmondi, Dhaka</span>
              </div>
              <span className="text-[12px] text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Booking confirmed
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
