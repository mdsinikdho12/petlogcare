// src/app/(public)/pricing/page.tsx
import Link from "next/link";
import {
  Check,
  ShieldCheck,
  Sparkles,
  Heart,
  Building2,
  HelpCircle,
  ArrowRight,
  Clock,
  Wallet,
} from "lucide-react";

export const metadata = {
  title: "Transparent Pricing & Deposit Policy | PetCareLog Bangladesh",
  description:
    "100% free pet medical records and digital passports. Transparent 10% clinic reservation deposit and verified provider tiers in Bangladesh.",
};

export default function PricingPage() {
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[8px] bg-sky-500/15 text-[#0D8BE0] text-xs font-semibold border border-white/80">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fair, transparent & honest pet care</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#06395F]">
            Transparent pricing for parents & clinics
          </h1>

          <p className="text-sm sm:text-base text-[#06395F]/80 leading-relaxed font-normal">
            No surprise platform markups. Pet parents always get free health records, while clinics benefit from a cal-style booking engine.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Pet Parents */}
          <div className="rounded-[13px] bg-white/85 border border-[#06395F]/10 p-7 sm:p-9 shadow-[0_1px_2px_rgba(6,57,95,0.06)] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-sky-50 text-[#0D8BE0] text-xs font-bold border border-sky-100">
                <Heart className="w-3.5 h-3.5" />
                <span>For Pet Parents</span>
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold text-[#06395F]">
                  Care & Health Passport
                </h2>
                <p className="text-xs text-[#06395F]/75 mt-1 font-normal">
                  Everything you need to safeguard and coordinate your companion animal&apos;s healthcare.
                </p>
              </div>

              <div className="pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold text-[#06395F]">৳ 0</span>
                  <span className="text-xs text-[#06395F]/60">/ forever free</span>
                </div>
                <p className="text-[11px] text-[#0D8BE0] font-semibold mt-0.5">
                  100% free digital medical vault & reminders
                </p>
              </div>

              <ul className="space-y-2.5 pt-2 text-xs text-[#06395F]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Encrypted digital medical passport for unlimited pets</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Automated SMS & push notifications for rabies and booster vaccines</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct live chat with verified attending doctors</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>24/7 one-touch emergency helpline triage dispatch</span>
                </li>
                <li className="flex items-start gap-2 pt-1 border-t border-[#06395F]/10">
                  <Clock className="w-4 h-4 text-[#0D8BE0] shrink-0 mt-0.5" />
                  <span className="text-[11px] text-[#06395F]/80">
                    <strong>10% Online Reservation Deposit:</strong> When booking a slot, you pay 10% online (via bKash/Nagad). The remaining 90% is settled directly at the clinic counter.
                  </span>
                </li>
              </ul>
            </div>

            <Link
              href="/register"
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white text-xs font-semibold shadow-[0_4px_14px_rgba(13,150,230,0.30)] hover:-translate-y-0.5 transition"
            >
              <span>Create free pet passport</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2: Veterinary Clinics */}
          <div className="rounded-[13px] border border-white/80 bg-white/75 backdrop-blur-xl p-7 sm:p-9 shadow-[0_8px_30px_rgba(1,95,160,0.12),inset_0_1px_0_rgba(255,255,255,0.95)] flex flex-col justify-between space-y-6 relative overflow-hidden">
            <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-[6px] bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              Recommended for Practices
            </span>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <Building2 className="w-3.5 h-3.5" />
                <span>For Veterinary Clinics</span>
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold text-[#06395F]">
                  Verified Practice Pro
                </h2>
                <p className="text-xs text-[#06395F]/75 mt-1 font-normal">
                  Turn walk-in chaos into structured, prepaid calendar appointments.
                </p>
              </div>

              <div className="pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold text-[#06395F]">৳ 1,500</span>
                  <span className="text-xs text-[#06395F]/60">/ month</span>
                </div>
                <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                  First 30 days complimentary trial upon license verification
                </p>
              </div>

              <ul className="space-y-2.5 pt-2 text-xs text-[#06395F]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Cal-style interactive slot scheduler with buffer time protection</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Blue Verified Practice badge on discovery search</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Eliminate no-shows with mandatory 10% online deposits</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct wallet payouts to bKash Merchant, Nagad, or Bank</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Multi-staff management & attending doctor rosters</span>
                </li>
              </ul>
            </div>

            <Link
              href="/dashboard/provider/onboarding"
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-[11px] bg-[#06395F] text-white text-xs font-semibold shadow-xs hover:bg-[#0B4C7A] hover:-translate-y-0.5 transition"
            >
              <span>Onboard your clinic</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Deposit Policy Notice Banner */}
        <div className="rounded-[13px] bg-sky-50/70 border border-sky-200/80 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-[10px] bg-[#0D8BE0]/15 text-[#0D8BE0] flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#06395F]">
                Why does PetCareLog take a 10% reservation deposit?
              </h3>
              <p className="text-xs text-[#06395F]/80 mt-1 max-w-2xl font-normal leading-relaxed">
                Veterinary surgeries and trauma consultations require doctors and sterile rooms to be reserved in advance. The 10% deposit guarantees your slot, prevents empty slots, and is 100% credited against your final clinic bill at the counter.
              </p>
            </div>
          </div>

          <Link
            href="/legal"
            className="text-xs font-bold text-[#0D8BE0] hover:underline whitespace-nowrap self-end sm:self-center"
          >
            Read cancellation & refund terms →
          </Link>
        </div>
      </div>
    </div>
  );
}
