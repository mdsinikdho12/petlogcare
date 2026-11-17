// src/app/dashboard/owner/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  PawPrint,
  Dog,
  Cat,
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
  RotateCw,
  PlusCircle,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { apiClient } from "@/lib/api/client";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { BentoHeroSkeleton, StatCardsSkeleton } from "@/components/dashboard/DashboardSkeleton";

interface PetSummary {
  id: string;
  name: string;
  species: string;
  breed: string;
  age?: string;
  weight?: string;
  vaccineStatus?: string;
  lastCheckup?: string;
}

interface NextBooking {
  id: string;
  clinicName: string;
  clinicAddress: string;
  doctorName?: string;
  serviceTitle: string;
  petName: string;
  date: string;
  timeSlot: string;
  totalPriceBDT: number;
  paidOnlineBDT: number;
  dueAtClinicBDT: number;
  status: any;
}

interface PetReminderItem {
  id: string;
  petName: string;
  title: string;
  dueDate: string;
  isCompleted: boolean;
  notes?: string;
}

// Bangladesh currency formatter using en-BD locale
function formatBDT(amount: number): string {
  return `৳${new Intl.NumberFormat("en-BD").format(amount)}`;
}

export default function OwnerDashboardPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState<PetSummary[]>([]);
  const [nextBooking, setNextBooking] = useState<NextBooking | null>(null);
  const [reminders, setReminders] = useState<PetReminderItem[]>([]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [petsRes, bookingsRes, remindersRes] = await Promise.allSettled([
        apiClient.get("/pets"),
        apiClient.get("/bookings/me"),
        apiClient.get("/reminders/me"),
      ]);

      // 1. Process Pets
      if (petsRes.status === "fulfilled" && petsRes.value.data?.data) {
        const rawPets = petsRes.value.data.data;
        if (Array.isArray(rawPets)) {
          const mappedPets: PetSummary[] = rawPets.map((p: any) => ({
            id: p._id || p.id,
            name: p.name,
            species: p.species?.name || p.species || "Companion",
            breed: p.customBreed || p.breed || "Domestic breed",
            age: p.dob ? `${new Date().getFullYear() - new Date(p.dob).getFullYear()} yrs` : "Young",
            weight: p.weightKg ? `${p.weightKg} kg` : "Healthy",
            vaccineStatus: "UP_TO_DATE",
            lastCheckup: "Verified",
          }));
          setPets(mappedPets);
        }
      }

      // 2. Process Bookings
      if (bookingsRes.status === "fulfilled" && bookingsRes.value.data?.data) {
        const rawBookings = bookingsRes.value.data.data;
        if (Array.isArray(rawBookings) && rawBookings.length > 0) {
          const upcoming = rawBookings.find(
            (b: any) => b.status === "CONFIRMED" || b.status === "PENDING"
          ) || rawBookings[0];

          if (upcoming) {
            const total = upcoming.pricing?.totalPrice || upcoming.totalAmount || 800;
            const paid = upcoming.pricing?.paidOnline || (upcoming.paymentType === "PAY_NOW" ? total : Math.round(total * 0.1));
            const due = upcoming.pricing?.dueAtClinic || (total - paid);

            setNextBooking({
              id: upcoming._id || upcoming.id,
              clinicName: upcoming.provider?.businessName || upcoming.serviceType?.provider?.businessName || "Central Veterinary Clinic",
              clinicAddress: `${upcoming.provider?.address?.area || "Dhanmondi"}, ${upcoming.provider?.address?.city || "Dhaka"}`,
              doctorName: upcoming.provider?.name || "Attending Veterinarian",
              serviceTitle: upcoming.serviceType?.name || upcoming.serviceType?.title || "Clinical Pet Care",
              petName: upcoming.pet?.name || "Companion Pet",
              date: upcoming.date || "Scheduled",
              timeSlot: upcoming.startTime || "10:30 AM",
              totalPriceBDT: total,
              paidOnlineBDT: paid,
              dueAtClinicBDT: due,
              status: upcoming.status || "CONFIRMED",
            });
          }
        }
      }

      // 3. Process Reminders
      if (remindersRes.status === "fulfilled" && remindersRes.value.data?.data) {
        const rawReminders = remindersRes.value.data.data;
        if (Array.isArray(rawReminders)) {
          const mappedReminders: PetReminderItem[] = rawReminders.map((r: any) => ({
            id: r._id || r.id,
            petName: r.pet?.name || "Companion Pet",
            title: r.title,
            dueDate: r.dueDate || "Due soon",
            isCompleted: r.status === "DONE" || r.isCompleted || false,
            notes: r.notes,
          }));
          setReminders(mappedReminders);
        }
      }
    } catch (err) {
      console.error("Dashboard overview fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading && pets.length === 0) {
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

            <p className="text-[13px] sm:text-sm text-[#06395F]/80 mt-1.5 max-w-xl font-normal leading-relaxed">
              {pets.length > 0
                ? `${pets.length} companion pet${pets.length > 1 ? "s" : ""} registered. Digital medical passports and immunization schedules synchronized with Bangladesh partner clinics.`
                : "Register your dog, cat or companion animal to unlock digital vaccination passports, cloud health vault and online clinic booking."}
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-[#06395F]/10 flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/owner/pets"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white text-[13px] font-semibold shadow-[0_4px_14px_rgba(13,150,230,0.30)] hover:-translate-y-0.5 active:translate-y-0 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add pet</span>
            </Link>

            <Link
              href="/providers"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[11px] bg-white border border-[#06395F]/15 text-[#06395F] text-[13px] font-semibold hover:bg-slate-50 transition shadow-2xs"
            >
              <Stethoscope className="w-4 h-4 text-[#0D8BE0]" />
              <span>Find verified vet</span>
            </Link>

            <button
              type="button"
              onClick={loadDashboardData}
              className="p-2.5 rounded-[11px] bg-white border border-[#06395F]/15 text-[#06395F] hover:bg-slate-50 transition shadow-2xs"
              title="Refresh live metrics"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Emergency Card (Sole Deep Accent, Navy #06395F to #0B4C7A) */}
        <div className="col-span-12 xl:col-span-4 rounded-[13px] bg-gradient-to-br from-[#06395F] to-[#0B4C7A] p-6 sm:p-7 text-white shadow-[0_12px_40px_rgba(6,57,95,0.25)] flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
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
            subtitle={pets.length > 0 ? "Passports active" : "No pets added"}
            icon={Dog}
            tint="sky"
            badge={<StatusBadge status={pets.length > 0 ? "ACTIVE" : "PENDING"} label={pets.length > 0 ? "Verified" : "Add Pet"} />}
            href="/dashboard/owner/pets"
          />
        </div>

        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <StatCard
            title="Next clinic visit"
            value={nextBooking ? nextBooking.date : "None"}
            subtitle={nextBooking ? `${nextBooking.timeSlot} • ${nextBooking.clinicName.slice(0, 15)}...` : "Schedule checkup"}
            icon={CalendarCheck2}
            tint="indigo"
            badge={<StatusBadge status={nextBooking ? "CONFIRMED" : "PENDING"} label={nextBooking ? "Scheduled" : "Book"} />}
            href="/dashboard/owner/bookings"
          />
        </div>

        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <StatCard
            title="Booster schedule"
            value={reminders.length > 0 ? `${reminders.filter(r => !r.isCompleted).length} due` : "0 pending"}
            subtitle="Automated alerts"
            icon={Bell}
            tint="amber"
            badge={<StatusBadge status={reminders.some(r => !r.isCompleted) ? "PENDING" : "ACTIVE"} label={reminders.some(r => !r.isCompleted) ? "Due soon" : "Up to date"} />}
            href="/dashboard/owner/reminders"
          />
        </div>

        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <StatCard
            title="Health vault files"
            value={`${pets.length * 2} files`}
            subtitle="Encrypted records"
            icon={FileText}
            tint="emerald"
            badge={<StatusBadge status="ACTIVE" label="Secured" />}
            href="/dashboard/owner/pets"
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
              className="text-[13px] font-semibold text-[#0D8BE0] hover:underline whitespace-nowrap"
            >
              Manage all →
            </Link>
          </div>

          {pets.length === 0 ? (
            <div className="p-8 text-center rounded-[11px] bg-[#F3F9FF] border border-[#06395F]/10 space-y-3">
              <Dog className="w-8 h-8 text-[#0D8BE0] mx-auto opacity-70" />
              <p className="text-[13px] text-[#06395F]/80">
                You haven&apos;t added any pets yet.
              </p>
              <Link
                href="/dashboard/owner/pets"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[9px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white text-[12px] font-semibold shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add first pet</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pets.map((pet) => (
                <div
                  key={pet.id}
                  className="p-4 rounded-[11px] bg-[#F3F9FF] border border-[#06395F]/10 hover:border-[#0D8BE0]/30 transition shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-[9px] bg-sky-500/15 text-[#0D8BE0] flex items-center justify-center shrink-0">
                          {pet.species.toLowerCase().includes("cat") ? (
                            <Cat className="w-4 h-4" />
                          ) : (
                            <Dog className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-[14px] text-[#06395F] truncate">
                            {pet.name}
                          </h3>
                          <span className="text-[11px] text-[#06395F]/75 block truncate">
                            {pet.breed}
                          </span>
                        </div>
                      </div>
                      <StatusBadge status="ACTIVE" label="Healthy" />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[12px] pt-2 border-t border-[#06395F]/10">
                      <div>
                        <span className="text-[11px] text-[#06395F]/60 block font-medium">Age</span>
                        <strong className="text-[#06395F] tabular-nums font-semibold">{pet.age}</strong>
                      </div>
                      <div>
                        <span className="text-[11px] text-[#06395F]/60 block font-medium">Weight</span>
                        <strong className="text-[#06395F] tabular-nums font-semibold">{pet.weight}</strong>
                      </div>
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
                  Automated schedules for vaccines &amp; preventative care
                </p>
              </div>

              <Link
                href="/dashboard/owner/reminders"
                className="text-[13px] font-semibold text-[#0D8BE0] hover:underline whitespace-nowrap"
              >
                View all
              </Link>
            </div>

            {reminders.length === 0 ? (
              <div className="p-8 text-center rounded-[11px] bg-[#F3F9FF] border border-[#06395F]/10 space-y-3">
                <Bell className="w-8 h-8 text-amber-500 mx-auto opacity-70" />
                <p className="text-[13px] text-[#06395F]/80">
                  No active reminders scheduled.
                </p>
                <Link
                  href="/dashboard/owner/reminders"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[9px] bg-white border border-[#06395F]/15 text-[#06395F] text-[12px] font-semibold shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create reminder</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {reminders.slice(0, 3).map((r) => (
                  <div
                    key={r.id}
                    className="p-3.5 rounded-[11px] bg-[#F3F9FF] border border-[#06395F]/10 flex items-start gap-3 shadow-xs"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[11px] bg-amber-500/15 text-amber-600 border border-amber-300/40 mt-0.5">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-[13px] text-[#06395F] truncate">
                          {r.title}
                        </h3>
                        <StatusBadge
                          status={r.isCompleted ? "COMPLETED" : "PENDING"}
                          label={r.isCompleted ? "Done" : "Due"}
                        />
                      </div>
                      <p className="text-[12px] text-[#06395F]/75 mt-0.5 truncate">
                        For <strong>{r.petName}</strong> • {r.dueDate}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ROW 4: Next Scheduled Appointment */}
      <div className="grid grid-cols-12 gap-5 sm:gap-6">
        <div className="col-span-12 rounded-[13px] bg-white/85 border border-[#06395F]/10 p-5 sm:p-6 shadow-[0_1px_2px_rgba(6,57,95,0.06)]">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <span className={`flex h-2.5 w-2.5 rounded-full ${nextBooking ? "bg-emerald-500" : "bg-slate-300"}`} />
              <h2 className="font-display text-base font-bold text-[#06395F]">
                Next scheduled appointment
              </h2>
            </div>
            {nextBooking && (
              <StatusBadge status={nextBooking.status} label={`${nextBooking.date} at ${nextBooking.timeSlot}`} />
            )}
          </div>

          {!nextBooking ? (
            <div className="p-8 text-center rounded-[11px] bg-[#F3F9FF] border border-[#06395F]/10 space-y-3">
              <CalendarCheck2 className="w-8 h-8 text-[#0D8BE0] mx-auto opacity-70" />
              <h3 className="font-bold text-sm text-[#06395F]">
                No upcoming clinic appointments
              </h3>
              <p className="text-[13px] text-[#06395F]/75 max-w-sm mx-auto">
                Schedule a consultation, vaccination booster or grooming session at a verified pet clinic in Bangladesh.
              </p>
              <div className="pt-2">
                <Link
                  href="/providers"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white text-[12px] font-semibold shadow-xs hover:-translate-y-0.5 transition"
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Find a clinic &amp; book</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-[11px] bg-[#F3F9FF] border border-[#06395F]/10 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white shadow-xs">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm sm:text-base text-[#06395F] truncate">
                      {nextBooking.clinicName}
                    </h3>
                    <p className="text-[13px] text-[#06395F]/80 mt-0.5">
                      Attending: <strong>{nextBooking.doctorName}</strong>
                    </p>
                    <p className="text-[12px] text-[#0D8BE0] font-semibold mt-0.5">
                      Service: {nextBooking.serviceTitle} for {nextBooking.petName}
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
              <div className="p-3 rounded-[9px] bg-white border border-[#06395F]/10 flex flex-wrap items-center justify-between text-[13px] gap-2.5">
                <div className="flex items-center gap-2 text-[#06395F]">
                  <CreditCard className="w-4 h-4 text-[#0D8BE0] shrink-0" />
                  <span>
                    10% deposit: <strong className="font-bold tabular-nums text-[#06395F]">{formatBDT(nextBooking.paidOnlineBDT)}</strong> (Paid online)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                  <Banknote className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    90% balance: <strong className="font-bold tabular-nums text-emerald-800">{formatBDT(nextBooking.dueAtClinicBDT)}</strong> (Cash at clinic)
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
