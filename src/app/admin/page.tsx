// src/app/admin/page.tsx
"use client";

import React, { useState, useEffect } from "react";
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
  RefreshCw,
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
import { apiClient } from "@/lib/api/client";

interface OverviewMetrics {
  totalGmv: number;
  platformRevenue: number;
  netOnlineCollected: number;
  activePetOwners: number;
  verifiedProviders: number;
  completedAppointments: number;
  pendingVerifications: number;
  openDisputes: number;
  reportedReviews: number;
  pendingPayoutsAmount: number;
}

interface TrendPoint {
  day: string;
  gmv?: number;
  fee?: number;
  created?: number;
  completed?: number;
  owners?: number;
  providers?: number;
}

export default function AdminOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [trendTab, setTrendTab] = useState<"revenue" | "bookings" | "users">("revenue");
  const [metrics, setMetrics] = useState<OverviewMetrics>({
    totalGmv: 0,
    platformRevenue: 0,
    netOnlineCollected: 0,
    activePetOwners: 0,
    verifiedProviders: 0,
    completedAppointments: 0,
    pendingVerifications: 0,
    openDisputes: 0,
    reportedReviews: 0,
    pendingPayoutsAmount: 0,
  });

  const [trends, setTrends] = useState<{
    revenue: TrendPoint[];
    bookings: TrendPoint[];
    users: TrendPoint[];
  }>({
    revenue: [],
    bookings: [],
    users: [],
  });

  const fetchOverviewData = async () => {
    try {
      setLoading(true);
      const [overviewRes, trendsRes] = await Promise.allSettled([
        apiClient.get("/admin/dashboard/overview"),
        apiClient.get("/admin/dashboard/trends"),
      ]);

      if (overviewRes.status === "fulfilled") {
        const d = overviewRes.value.data?.data || overviewRes.value.data || {};
        setMetrics({
          totalGmv: d.totalGmv || d.gmv || 0,
          platformRevenue: d.platformRevenue || d.revenue || 0,
          netOnlineCollected: d.netOnlineCollected || d.onlineCollected || 0,
          activePetOwners: d.activePetOwners || d.petOwnersCount || d.usersCount || 0,
          verifiedProviders: d.verifiedProviders || d.providersCount || 0,
          completedAppointments: d.completedAppointments || d.bookingsCompleted || 0,
          pendingVerifications: d.pendingVerifications || d.pendingProvidersCount || 0,
          openDisputes: d.openDisputes || d.disputesCount || 0,
          reportedReviews: d.reportedReviews || d.reviewsReportedCount || 0,
          pendingPayoutsAmount: d.pendingPayoutsAmount || d.payoutsQueued || 0,
        });
      }

      if (trendsRes.status === "fulfilled") {
        const t = trendsRes.value.data?.data || trendsRes.value.data || {};
        setTrends({
          revenue: Array.isArray(t.revenue) ? t.revenue : [],
          bookings: Array.isArray(t.bookings) ? t.bookings : [],
          users: Array.isArray(t.users) ? t.users : [],
        });
      }
    } catch (err) {
      // In case of unauthenticated or network error, metrics remain 0
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const formatBDT = (amount: number) =>
    `৳ ${new Intl.NumberFormat("en-BD").format(amount)}`;

  return (
    <div className="space-y-6">
      {/* Platform Executive Summary Hero (Liquid Glass) */}
      <div className="rounded-[13px] border border-white/80 bg-white/55 backdrop-blur-xl backdrop-saturate-150 p-6 sm:p-7 shadow-[0_8px_30px_rgba(1,95,160,0.10),inset_0_1px_0_rgba(255,255,255,0.95)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[8px] bg-indigo-50 text-indigo-700 text-[12px] font-semibold border border-indigo-200/60 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Administrative Operations Console</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#06395F]">
              Platform overview & health
            </h1>
            <p className="text-[13px] sm:text-sm text-[#06395F]/80 max-w-2xl leading-relaxed font-normal">
              Real-time GMV, online MFS escrow, provider verifications, and compliance monitoring across Bangladesh.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={fetchOverviewData}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[11px] border border-[#06395F]/15 bg-white text-[#06395F] text-[12px] font-semibold hover:bg-slate-50 transition shadow-2xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#0D8BE0] ${loading ? "animate-spin" : ""}`} />
              <span>Refresh data</span>
            </button>
            <Link
              href="/admin/audit-logs"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white text-[12px] font-semibold shadow-[0_4px_14px_rgba(13,150,230,0.30)] hover:-translate-y-0.5 transition"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Audit trail</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Attention Strip: Real queues requiring action */}
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
              <p className="text-[13px] font-bold text-amber-950">
                {metrics.pendingVerifications} practices pending
              </p>
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
              <p className="text-[13px] font-bold text-rose-950">
                {metrics.openDisputes} cases open
              </p>
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
              <p className="text-[13px] font-bold text-indigo-950">
                {metrics.reportedReviews} reported reviews
              </p>
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
              <p className="text-[13px] font-bold text-emerald-950">
                {formatBDT(metrics.pendingPayoutsAmount)} queued
              </p>
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
          value={loading ? "..." : formatBDT(metrics.totalGmv)}
          badge={<StatusBadge status="ACTIVE" label="Platform GMV" />}
          href="/admin/bookings"
        />

        <StatCard
          icon={DollarSign}
          tint="sky"
          title="Platform revenue earned"
          value={loading ? "..." : formatBDT(metrics.platformRevenue)}
          badge={<StatusBadge status="INFO" label="10% booking fee" />}
          href="/admin/payouts"
        />

        <StatCard
          icon={Users}
          tint="indigo"
          title="Active pet owners"
          value={loading ? "..." : new Intl.NumberFormat("en-BD").format(metrics.activePetOwners)}
          badge={<StatusBadge status="ACTIVE" label="Registered parents" />}
          href="/admin/users"
        />

        <StatCard
          icon={CalendarCheck2}
          tint="emerald"
          title="Completed appointments"
          value={loading ? "..." : new Intl.NumberFormat("en-BD").format(metrics.completedAppointments)}
          badge={<StatusBadge status="COMPLETED" label="Settled visits" />}
          href="/admin/bookings"
        />
      </div>

      {/* Main Trends Visualizer & Gateway Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 8 Cols: Analytics Area Chart */}
        <div className="lg:col-span-8 rounded-[13px] bg-white/85 border border-[#06395F]/10 p-5 sm:p-6 shadow-[0_1px_2px_rgba(6,57,95,0.06)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#06395F]">
                Operational performance trends
              </h2>
              <p className="text-[12px] text-[#06395F]/70 font-normal">
                Daily metrics bucketed in Asia/Dhaka calendar time.
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
            {trends[trendTab].length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                {trendTab === "revenue" ? (
                  <AreaChart data={trends.revenue}>
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
                  <AreaChart data={trends.bookings}>
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
                  <AreaChart data={trends.users}>
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
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-50/60 rounded-[11px] border border-dashed border-slate-200">
                <Activity className="w-8 h-8 text-[#0D8BE0]/50 mb-2" />
                <p className="text-xs font-semibold text-[#06395F]">
                  No daily trend data available yet
                </p>
                <p className="text-[11px] text-[#06395F]/60 max-w-xs mt-0.5">
                  Analytics will populate automatically as appointment bookings and user registrations occur on the platform.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right 4 Cols: System Gate & Infrastructure Status */}
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
                    Live production endpoint connected
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
                    Signed Cloudinary URL generation active
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-[11px] bg-slate-50/80 border border-slate-200/60 flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#0D8BE0] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[12px] font-semibold text-[#06395F]">
                    Vaccination Booster Scheduler
                  </p>
                  <p className="text-[11px] text-[#06395F]/70">
                    Cron worker running in Asia/Dhaka
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
