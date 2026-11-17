// src/app/dashboard/provider/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Stethoscope,
  CalendarCheck2,
  Wallet,
  Star,
  Users,
  ShieldCheck,
  ArrowRight,
  Plus,
  Sparkles,
  RotateCw,
  Clock,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { apiClient } from "@/lib/api/client";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { BentoHeroSkeleton, StatCardsSkeleton } from "@/components/dashboard/DashboardSkeleton";

interface ProviderProfileData {
  id?: string;
  businessName?: string;
  rating?: number;
  reviewCount?: number;
  verificationStatus?: string;
  verified?: boolean;
}

interface ProviderBookingItem {
  id: string;
  clientName: string;
  petName: string;
  serviceTitle: string;
  date: string;
  timeSlot: string;
  status: any;
  amountBDT: number;
}

function formatBDT(amount: number): string {
  return `৳${new Intl.NumberFormat("en-BD").format(amount)}`;
}

export default function ProviderOverviewPage() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<ProviderProfileData | null>(null);
  const [bookings, setBookings] = useState<ProviderBookingItem[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const [profRes, bookRes, wallRes] = await Promise.allSettled([
        apiClient.get("/providers/me"),
        apiClient.get("/bookings/provider"),
        apiClient.get("/wallet/me"),
      ]);

      if (profRes.status === "fulfilled" && profRes.value.data?.data) {
        setProfile(profRes.value.data.data);
      }

      if (bookRes.status === "fulfilled" && bookRes.value.data?.data) {
        const rawBookings = bookRes.value.data.data;
        if (Array.isArray(rawBookings)) {
          const mapped: ProviderBookingItem[] = rawBookings.map((b: any) => ({
            id: b._id || b.id,
            clientName: b.user?.name || b.clientName || "Pet Parent",
            petName: b.pet?.name || "Companion Pet",
            serviceTitle: b.serviceType?.name || b.serviceType?.title || "Consultation",
            date: b.date || "Scheduled",
            timeSlot: b.startTime || "10:30 AM",
            status: b.status || "CONFIRMED",
            amountBDT: b.pricing?.totalPrice || b.totalAmount || 800,
          }));
          setBookings(mapped);
        }
      }

      if (wallRes.status === "fulfilled" && wallRes.value.data?.data) {
        setWalletBalance(wallRes.value.data.data.availableBalance || 0);
      }
    } catch (err) {
      console.error("Provider overview fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const isVerified = profile?.verificationStatus === "APPROVED" || profile?.verified;
  const isPending = profile?.verificationStatus === "PENDING";

  if (loading && !profile) {
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
      {/* Verification Prompt Hero (Liquid Glass) */}
      {!isVerified && (
        <div className="rounded-[13px] border border-white/80 bg-white/55 backdrop-blur-xl backdrop-saturate-150 p-6 sm:p-7 shadow-[0_8px_30px_rgba(1,95,160,0.10),inset_0_1px_0_rgba(255,255,255,0.95)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-[11px] bg-amber-500/15 border border-amber-300/40 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[8px] bg-amber-50 text-amber-800 text-[12px] font-medium mb-1.5 border border-amber-200">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>{isPending ? "Verification under review" : "Verification recommended"}</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#06395F]">
                {isPending ? "Practice credentials submitted" : "Complete practice verification"}
              </h2>
              <p className="text-[13px] text-[#06395F]/80 mt-1 max-w-xl font-normal leading-relaxed">
                {isPending
                  ? "Our veterinary compliance board is currently reviewing your clinic trade license. Approved clinics receive verified badges and priority search ranking."
                  : "Upload your clinic trade license and veterinary doctor credentials to receive a verified badge and begin accepting online bookings from pet owners."}
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/provider/onboarding"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white text-[13px] font-semibold shadow-[0_4px_14px_rgba(13,150,230,0.30)] hover:-translate-y-0.5 transition shrink-0 whitespace-nowrap"
          >
            <span>{isPending ? "View submission" : "Complete verification"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Main Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-[28px] font-bold tracking-tight text-[#06395F]">
            {profile?.businessName || "Veterinary Practice Console"}
          </h1>
          <p className="text-[13px] text-[#06395F]/75 mt-0.5 font-normal">
            Monitor clinic appointments, veterinary services and earnings in Bangladesh.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchOverview}
            disabled={loading}
            className="p-2.5 rounded-[11px] bg-white border border-[#06395F]/15 text-[#06395F] hover:bg-slate-50 transition shadow-2xs"
            title="Refresh dashboard metrics"
          >
            <RotateCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <Link
            href="/dashboard/provider/services"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white text-[13px] font-semibold shadow-[0_4px_14px_rgba(13,150,230,0.30)] hover:-translate-y-0.5 transition whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add service</span>
          </Link>

          <Link
            href="/dashboard/provider/staff"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[11px] border border-[#06395F]/10 bg-white/80 text-[13px] font-semibold text-[#06395F] hover:bg-white shadow-2xs hover:-translate-y-0.5 transition whitespace-nowrap"
          >
            <Users className="w-4 h-4 text-[#0D8BE0]" />
            <span>Staff</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row (4 Stat Cards, 12 columns bento) */}
      <div className="grid grid-cols-12 gap-5 sm:gap-6">
        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <StatCard
            title="Active bookings"
            value={bookings.length}
            subtitle={bookings.length > 0 ? "Upcoming patient queue" : "No appointments yet"}
            icon={CalendarCheck2}
            tint="sky"
            badge={<StatusBadge status={bookings.length > 0 ? "ACTIVE" : "PENDING"} label={bookings.length > 0 ? "Live queue" : "Empty"} />}
            href="/dashboard/provider/bookings"
          />
        </div>

        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <StatCard
            title="Practice rating"
            value={typeof profile?.rating === "number" ? profile.rating.toFixed(1) : "5.0"}
            subtitle={`Based on ${profile?.reviewCount || 0} client reviews`}
            icon={Star}
            tint="amber"
            badge={<StatusBadge status="COMPLETED" label="Patient rating" />}
            href="/dashboard/provider/profile"
          />
        </div>

        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <StatCard
            title="Wallet balance"
            value={formatBDT(walletBalance)}
            subtitle="Available for payout"
            icon={Wallet}
            tint="emerald"
            badge={<StatusBadge status="ACTIVE" label="Cleared" />}
            href="/dashboard/provider/wallet"
          />
        </div>

        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <StatCard
            title="Practice status"
            value={isVerified ? "Verified" : isPending ? "Under review" : "Action needed"}
            subtitle={isVerified ? "Verified partner clinic" : "Upload credentials"}
            icon={Stethoscope}
            tint="indigo"
            badge={<StatusBadge status={isVerified ? "ACTIVE" : "PENDING"} label={isVerified ? "Active" : "Pending"} />}
            href="/dashboard/provider/onboarding"
          />
        </div>
      </div>

      {/* Appointment Overview and Patient Queue */}
      <div className="rounded-[13px] bg-white/85 border border-[#06395F]/10 p-6 sm:p-8 shadow-[0_1px_2px_rgba(6,57,95,0.06)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#06395F]/10">
          <div>
            <h2 className="font-display text-base sm:text-lg font-bold text-[#06395F]">
              Patient Appointments Queue
            </h2>
            <p className="text-[13px] text-[#06395F]/75">
              Live incoming patient reservations from pet parents across Bangladesh.
            </p>
          </div>

          <Link
            href="/dashboard/provider/bookings"
            className="text-[13px] font-semibold text-[#0D8BE0] hover:underline"
          >
            View all appointments →
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-[11px] bg-sky-50 flex items-center justify-center text-[#0D8BE0] border border-sky-100 mb-2">
              <CalendarCheck2 className="w-6 h-6" />
            </div>
            <h3 className="font-display text-base font-bold text-[#06395F]">
              No patient bookings yet
            </h3>
            <p className="text-[13px] text-[#06395F]/75 max-w-md mx-auto font-normal leading-relaxed">
              Ensure your services, pricing, and operating hours are published so pet parents can discover and book consultations at your clinic.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-2.5">
              <Link
                href="/dashboard/provider/services"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white text-[12px] font-semibold shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Configure services</span>
              </Link>
              <Link
                href="/dashboard/provider/availability"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[11px] border border-[#06395F]/15 bg-white text-[#06395F] text-[12px] font-semibold shadow-2xs hover:bg-slate-50"
              >
                <Clock className="w-3.5 h-3.5 text-[#0D8BE0]" />
                <span>Set operating hours</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 4).map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-[11px] bg-[#F3F9FF] border border-[#06395F]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-[14px] text-[#06395F] truncate">
                      {b.serviceTitle}
                    </h4>
                    <StatusBadge status={b.status} />
                  </div>
                  <div className="text-[12px] text-[#06395F]/80">
                    Patient: <strong>{b.petName}</strong> • Guardian: <strong>{b.clientName}</strong>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-[#06395F]/60">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#0D8BE0]" />
                      <span>{b.date} at {b.timeSlot}</span>
                    </span>
                    <span>•</span>
                    <span>Fee: <strong className="text-[#06395F] font-semibold">{formatBDT(b.amountBDT)}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href="/dashboard/provider/bookings"
                    className="px-3.5 py-1.5 rounded-[9px] bg-white border border-[#06395F]/15 text-[#06395F] text-[12px] font-semibold hover:bg-slate-50 transition shadow-2xs"
                  >
                    Manage
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
