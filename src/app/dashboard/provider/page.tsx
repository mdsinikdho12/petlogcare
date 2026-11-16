"use client";

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
} from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/dashboard/StatusBadge";

export default function ProviderOverviewPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Verification Prompt Hero (Liquid Glass) */}
      <div className="rounded-[13px] border border-white/80 bg-white/55 backdrop-blur-xl backdrop-saturate-150 p-6 sm:p-7 shadow-[0_8px_30px_rgba(1,95,160,0.10),inset_0_1px_0_rgba(255,255,255,0.95)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-[11px] bg-amber-500/15 border border-amber-300/40 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[8px] bg-amber-50 text-amber-800 text-[12px] font-medium mb-1.5 border border-amber-200">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>Verification recommended</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#06395F]">
              Complete practice verification
            </h2>
            <p className="text-[13px] text-[#06395F]/80 mt-1 max-w-xl font-normal leading-relaxed">
              Upload your trade license and veterinary credentials to receive a verified badge and begin accepting online bookings from pet owners.
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/provider/onboarding"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white text-[13px] font-semibold shadow-[0_4px_14px_rgba(13,150,230,0.30)] hover:-translate-y-0.5 transition shrink-0 whitespace-nowrap"
        >
          <span>Complete verification</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-[28px] font-bold tracking-tight text-[#06395F]">
            Practice console
          </h1>
          <p className="text-[13px] text-[#06395F]/75 mt-0.5 font-normal">
            Monitor clinic appointments, veterinary services and earnings in Bangladesh.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/provider/services"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white text-[13px] font-semibold shadow-[0_4px_14px_rgba(13,150,230,0.30)] hover:-translate-y-0.5 transition whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add service</span>
          </Link>
          <Link
            href="/dashboard/provider/staff"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[11px] border border-[#06395F]/10 bg-white/80 text-[13px] font-semibold text-[#06395F] hover:bg-white shadow-[0_1px_2px_rgba(6,57,95,0.04)] hover:-translate-y-0.5 transition whitespace-nowrap"
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
            value={0}
            subtitle="Scheduled this week"
            icon={CalendarCheck2}
            tint="sky"
            badge={<StatusBadge status="ACTIVE" label="Current" />}
            href="/dashboard/provider/bookings"
          />
        </div>

        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <StatCard
            title="Practice rating"
            value="5.0"
            subtitle="Based on 0 client reviews"
            icon={Star}
            tint="amber"
            badge={<StatusBadge status="COMPLETED" label="Top rated" />}
            href="/dashboard/provider/profile"
          />
        </div>

        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <StatCard
            title="Wallet balance"
            value="৳0"
            subtitle="Available for payout"
            icon={Wallet}
            tint="emerald"
            badge={<StatusBadge status="VALID" label="Cleared" />}
            href="/dashboard/provider/wallet"
          />
        </div>

        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <StatCard
            title="Practice status"
            value="Pending"
            subtitle="Action required"
            icon={Stethoscope}
            tint="indigo"
            badge={<StatusBadge status="PENDING" label="Action needed" />}
            href="/dashboard/provider/onboarding"
          />
        </div>
      </div>

      {/* Appointment Overview and Quick Calendar (Solid Surface) */}
      <div className="rounded-[13px] bg-white/85 border border-[#06395F]/10 p-8 sm:p-10 shadow-[0_1px_2px_rgba(6,57,95,0.06)] text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-[11px] bg-sky-50 flex items-center justify-center text-[#0D8BE0] border border-sky-100 mb-2">
          <CalendarCheck2 className="w-6 h-6" />
        </div>
        <h3 className="font-display text-base sm:text-lg font-bold text-[#06395F]">
          No appointments today
        </h3>
        <p className="text-[13px] text-[#06395F]/75 max-w-md mx-auto font-normal leading-relaxed">
          Once your practice is verified and services are published, clients in Dhaka will be able to book in-clinic and home vet appointments directly through your page.
        </p>
        <div className="pt-2">
          <Link
            href="/dashboard/provider/onboarding"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white text-[13px] font-semibold shadow-[0_4px_14px_rgba(13,150,230,0.30)] hover:-translate-y-0.5 transition"
          >
            <span>Complete setup wizard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
