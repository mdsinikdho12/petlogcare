// src/app/admin/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShieldAlert,
  CalendarCheck2,
  Users,
  Wallet,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Star,
  Activity,
  CheckCircle2,
  Clock,
  Sparkles,
  DollarSign,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/dashboard/StatusBadge";

const revenueTrends = [
  { day: "01 Nov", gmv: 14200, fee: 1420 },
  { day: "03 Nov", gmv: 18500, fee: 1850 },
  { day: "05 Nov", gmv: 16800, fee: 1680 },
  { day: "07 Nov", gmv: 22400, fee: 2240 },
  { day: "09 Nov", gmv: 19800, fee: 1980 },
  { day: "11 Nov", gmv: 25600, fee: 2560 },
  { day: "13 Nov", gmv: 28900, fee: 2890 },
  { day: "15 Nov", gmv: 31200, fee: 3120 },
];

const bookingsTrends = [
  { day: "01 Nov", created: 28, completed: 25 },
  { day: "03 Nov", created: 35, completed: 31 },
  { day: "05 Nov", created: 30, completed: 28 },
  { day: "07 Nov", created: 42, completed: 39 },
  { day: "09 Nov", created: 38, completed: 36 },
  { day: "11 Nov", created: 46, completed: 41 },
  { day: "13 Nov", created: 52, completed: 48 },
  { day: "15 Nov", created: 58, completed: 53 },
];

const userTrends = [
  { day: "01 Nov", owners: 1240, providers: 74 },
  { day: "05 Nov", owners: 1290, providers: 77 },
  { day: "09 Nov", owners: 1345, providers: 81 },
  { day: "13 Nov", owners: 1390, providers: 84 },
  { day: "15 Nov", owners: 1420, providers: 86 },
];

export default function AdminOverviewPage() {
  const [trendTab, setTrendTab] = useState<"revenue" | "bookings" | "users">("revenue");

  return (
    <div className="space-y-6">
      {/* Platform Executive Summary Hero (Liquid Glass) */}
      <div className="rounded-[13px] border border-white/80 bg-white/55 backdrop-blur-xl backdrop-saturate-150 p-6 sm:p-7 shadow-[0_8px_30px_rgba(1,95,160,0.10),inset_0_1px_0_rgba(255,255,255,0.95)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[8px] bg-indigo-50 text-indigo-700 text-[12px] font-semibold border border-indigo-200/60 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Super administrative control center</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#06395F]">
              Platform operations & health
            </h1>
            <p className="text-[13px] sm:text-sm text-[#06395F]/80 max-w-2xl leading-relaxed font-normal">
              PetCareLog operations in Dhaka and Chittagong. Monitor real-time GMV, online MFS escrow, provider verifications, and compliance logs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/admin/providers"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white text-[13px] font-semibold shadow-[0_4px_14px_rgba(13,150,230,0.30)] hover:-translate-y-0.5 transition"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Review 4 pending providers</span>
            </Link>
            <Link
              href="/admin/audit-logs"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[11px] border border-[#06395F]/15 bg-white text-[#06395F] text-[13px] font-semibold hover:bg-slate-50 transition shadow-2xs"
            >
              <Activity className="w-4 h-4 text-[#0D8BE0]" />
              <span>Audit trail</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Attention Strip: Urgent queues requiring action */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Link
          href="/admin/providers"
          className="rounded-[13px] border border-amber-300/60 bg-amber-50/80 p-3.5 flex items-center justify-between hover:bg-amber-100/80 transition group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[8px] bg-amber-500/20 text-amber-800 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-amber-900/80">Verification queue</p>
              <p className="text-[13px] font-bold text-amber-950">4 practices pending</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-amber-800 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        <Link
          href="/admin/bookings"
          className="rounded-[13px] border border-rose-300/60 bg-rose-50/80 p-3.5 flex items-center justify-between hover:bg-rose-100/80 transition group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[8px] bg-rose-500/20 text-rose-800 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-rose-900/80">Active disputes</p>
              <p className="text-[13px] font-bold text-rose-950">2 cases need resolution</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-rose-800 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        <Link
          href="/admin/reviews"
          className="rounded-[13px] border border-indigo-300/60 bg-indigo-50/80 p-3.5 flex items-center justify-between hover:bg-indigo-100/80 transition group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[8px] bg-indigo-500/20 text-indigo-800 flex items-center justify-center shrink-0">
              <Star className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-indigo-900/80">Review moderation</p>
              <p className="text-[13px] font-bold text-indigo-950">3 reported reviews</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-indigo-800 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        <Link
          href="/admin/payouts"
          className="rounded-[13px] border border-emerald-300/60 bg-emerald-50/80 p-3.5 flex items-center justify-between hover:bg-emerald-100/80 transition group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[8px] bg-emerald-500/20 text-emerald-800 flex items-center justify-center shrink-0">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-emerald-900/80">Payout batches</p>
              <p className="text-[13px] font-bold text-emerald-950">৳ 42,500 queued</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-emerald-800 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Primary 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={TrendingUp}
          tint="emerald"
          title="Total GMV (30 days)"
          value="৳ 485,000"
          badge={<StatusBadge status="ACTIVE" label="+18% vs Oct" />}
          href="/admin/bookings"
        />

        <StatCard
          icon={DollarSign}
          tint="sky"
          title="Platform revenue earned"
          value="৳ 48,500"
          badge={<StatusBadge status="INFO" label="10% booking fee" />}
          href="/admin/payouts"
        />

        <StatCard
          icon={Users}
          tint="indigo"
          title="Active pet owners"
          value="1,420"
          badge={<StatusBadge status="ACTIVE" label="98.2% active" />}
          href="/admin/users"
        />

        <StatCard
          icon={CalendarCheck2}
          tint="emerald"
          title="Completed appointments"
          value="942"
          badge={<StatusBadge status="COMPLETED" label="94% satisfaction" />}
          href="/admin/bookings"
        />
      </div>

      {/* Main Trends Visualizer & Recent Administrative Events */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 8 Cols: Analytics Area Chart */}
        <div className="lg:col-span-8 rounded-[13px] bg-white/85 border border-[#06395F]/10 p-5 sm:p-6 shadow-[0_1px_2px_rgba(6,57,95,0.06)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#06395F]">
                Operational performance trends
              </h2>
              <p className="text-[12px] text-[#06395F]/70 font-normal">
                Aggregated daily volume bucketed in Asia/Dhaka timezone.
              </p>
            </div>

            <div className="inline-flex p-1 rounded-[11px] bg-slate-100 border border-slate-200 text-[12px] font-semibold text-[#06395F]">
              <button
                type="button"
                onClick={() => setTrendTab("revenue")}
                className={`px-3 py-1.5 rounded-[9px] transition ${
                  trendTab === "revenue"
                    ? "bg-white shadow-xs text-[#0D8BE0]"
                    : "text-[#06395F]/75 hover:text-[#06395F]"
                }`}
              >
                Revenue
              </button>
              <button
                type="button"
                onClick={() => setTrendTab("bookings")}
                className={`px-3 py-1.5 rounded-[9px] transition ${
                  trendTab === "bookings"
                    ? "bg-white shadow-xs text-[#0D8BE0]"
                    : "text-[#06395F]/75 hover:text-[#06395F]"
                }`}
              >
                Bookings
              </button>
              <button
                type="button"
                onClick={() => setTrendTab("users")}
                className={`px-3 py-1.5 rounded-[9px] transition ${
                  trendTab === "users"
                    ? "bg-white shadow-xs text-[#0D8BE0]"
                    : "text-[#06395F]/75 hover:text-[#06395F]"
                }`}
              >
                Users
              </button>
            </div>
          </div>

          <div className="h-[280px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              {trendTab === "revenue" ? (
                <AreaChart data={revenueTrends}>
                  <defs>
                    <linearGradient id="gmvGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D8BE0" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#0D8BE0" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#06395F" strokeOpacity={0.06} />
                  <XAxis dataKey="day" stroke="#06395F" opacity={0.6} fontSize={11} tickLine={false} />
                  <YAxis stroke="#06395F" opacity={0.6} fontSize={11} tickLine={false} tickFormatter={(v) => `৳${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "11px",
                      border: "1px solid rgba(6, 57, 95, 0.12)",
                      boxShadow: "0 8px 24px rgba(1, 95, 160, 0.12)",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#06395F",
                    }}
                    formatter={(val: any) => [`৳ ${new Intl.NumberFormat("en-BD").format(Number(val) || 0)}`, "GMV"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="gmv"
                    stroke="#0D8BE0"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#gmvGrad)"
                  />
                </AreaChart>
              ) : trendTab === "bookings" ? (
                <AreaChart data={bookingsTrends}>
                  <defs>
                    <linearGradient id="bkGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#06395F" strokeOpacity={0.06} />
                  <XAxis dataKey="day" stroke="#06395F" opacity={0.6} fontSize={11} tickLine={false} />
                  <YAxis stroke="#06395F" opacity={0.6} fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "11px",
                      border: "1px solid rgba(6, 57, 95, 0.12)",
                      fontSize: "12px",
                      color: "#06395F",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    name="Completed"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#bkGrad)"
                  />
                </AreaChart>
              ) : (
                <AreaChart data={userTrends}>
                  <defs>
                    <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#06395F" strokeOpacity={0.06} />
                  <XAxis dataKey="day" stroke="#06395F" opacity={0.6} fontSize={11} tickLine={false} />
                  <YAxis stroke="#06395F" opacity={0.6} fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "11px",
                      border: "1px solid rgba(6, 57, 95, 0.12)",
                      fontSize: "12px",
                      color: "#06395F",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="owners"
                    name="Pet Owners"
                    stroke="#6366F1"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#userGrad)"
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 4 Cols: System & Security Ledger */}
        <div className="lg:col-span-4 rounded-[13px] bg-white/85 border border-[#06395F]/10 p-5 sm:p-6 shadow-[0_1px_2px_rgba(6,57,95,0.06)] space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#06395F]">
                Security & gate status
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[8px] bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Operational
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3 rounded-[11px] bg-slate-50/80 border border-slate-200/60 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[12px] font-semibold text-[#06395F]">
                    UddoktaPay MFS Gateway
                  </p>
                  <p className="text-[11px] text-[#06395F]/70">
                    bKash / Nagad webhooks returning 200 OK
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-[11px] bg-slate-50/80 border border-slate-200/60 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[12px] font-semibold text-[#06395F]">
                    Digital Health Vault
                  </p>
                  <p className="text-[11px] text-[#06395F]/70">
                    Cloudinary signed access URLs expiring in 5 min
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-[11px] bg-slate-50/80 border border-slate-200/60 flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#0D8BE0] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[12px] font-semibold text-[#06395F]">
                    Scheduled Booster Dispatch
                  </p>
                  <p className="text-[11px] text-[#06395F]/70">
                    Next SMS & push trigger tomorrow at 09:00 AM
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#06395F]/10">
            <Link
              href="/admin/audit-logs"
              className="text-[12px] font-semibold text-[#0D8BE0] hover:underline flex items-center justify-between"
            >
              <span>Inspect recent audit logs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
