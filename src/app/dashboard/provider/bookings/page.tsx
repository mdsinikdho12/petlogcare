"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarCheck2,
  Clock,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  Play,
  Check,
  X,
  Sparkles,
  FileText,
  RotateCw,
  MessageSquare,
  CreditCard,
  Banknote,
} from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { apiClient } from "@/lib/api/client";

interface ProviderAppointment {
  id: string;
  clientName: string;
  clientPhone: string;
  petName: string;
  petSpecies: string;
  serviceTitle: string;
  date: string;
  timeSlot: string;
  status: any;
  paymentType: "PAY_NOW" | "PAY_ON_VISIT";
  totalPriceBDT: number;
  paidOnlineBDT: number;
  dueAtClinicBDT: number;
  notes?: string;
}

function formatBDT(amount: number): string {
  return `৳${new Intl.NumberFormat("en-BD").format(amount)}`;
}

export default function ProviderBookingsPage() {
  const [appointments, setAppointments] = useState<ProviderAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "CONFIRMED" | "COMPLETED">("ALL");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/bookings/provider");
      const list = res.data?.data || [];
      if (Array.isArray(list)) {
        const mapped: ProviderAppointment[] = list.map((b: any) => {
          const total = b.pricing?.totalPrice || b.totalAmount || 800;
          const paid = b.pricing?.paidOnline || (b.paymentType === "PAY_NOW" ? total : Math.round(total * 0.1));
          const due = b.pricing?.dueAtClinic || (total - paid);

          return {
            id: b._id || b.id,
            clientName: b.user?.name || b.clientName || "Pet Parent",
            clientPhone: b.user?.phone || b.clientPhone || "+880 1700-000000",
            petName: b.pet?.name || "Companion Pet",
            petSpecies: b.pet?.species?.name || b.pet?.species || "Companion",
            serviceTitle: b.serviceType?.name || b.serviceType?.title || "Clinical Appointment",
            date: b.date || "Scheduled",
            timeSlot: b.startTime || "10:30 AM",
            status: b.status || "CONFIRMED",
            paymentType: b.paymentType || "PAY_ON_VISIT",
            totalPriceBDT: total,
            paidOnlineBDT: paid,
            dueAtClinicBDT: due,
            notes: b.notes,
          };
        });
        setAppointments(mapped);
      }
    } catch (err) {
      console.error("Failed to load provider bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleAction = async (id: string, action: "accept" | "decline" | "start" | "complete" | "no-show") => {
    try {
      await apiClient.patch(`/bookings/${id}/${action}`, {});
      toast.success(`Booking ${action}ed successfully!`);
      fetchBookings();
    } catch (err: any) {
      toast.error(err.response?.data?.message || `Failed to ${action} booking`);
    }
  };

  const filteredAppointments = appointments.filter((app) => {
    if (filter === "PENDING") return app.status === "PENDING";
    if (filter === "CONFIRMED") return app.status === "CONFIRMED" || app.status === "IN_PROGRESS";
    if (filter === "COMPLETED") return app.status === "COMPLETED";
    return true;
  });

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Top Banner (Liquid Glass) */}
      <div className="rounded-[13px] border border-white/80 bg-white/55 p-6 sm:p-7 backdrop-blur-xl backdrop-saturate-150 shadow-[0_8px_30px_rgba(1,95,160,0.10),inset_0_1px_0_rgba(255,255,255,0.95)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-sky-500/15 text-[#0D8BE0] text-[12px] font-semibold mb-2.5 border border-white/80 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Patient intake &amp; flow</span>
          </div>
          <h1 className="font-display text-2xl sm:text-[28px] font-bold tracking-tight text-[#06395F]">
            Patient Appointments
          </h1>
          <p className="text-[13px] sm:text-sm text-[#06395F]/80 mt-1 max-w-xl font-normal leading-relaxed">
            Manage daily checkups, patient intake, in-clinic consultations, and cash settlements in Bangladesh.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchBookings}
            disabled={loading}
            className="p-2.5 rounded-[11px] bg-white border border-[#06395F]/15 text-[#06395F] hover:bg-slate-50 transition shadow-2xs"
            title="Refresh bookings"
          >
            <RotateCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {[
          { id: "ALL", label: "All appointments" },
          { id: "PENDING", label: "Pending approval" },
          { id: "CONFIRMED", label: "Scheduled & Active" },
          { id: "COMPLETED", label: "Completed" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id as any)}
            className={`px-3.5 py-2 rounded-[11px] text-[12px] font-semibold transition-all cursor-pointer ${
              filter === tab.id
                ? "bg-[#0D8BE0] text-white shadow-xs"
                : "bg-white/80 text-[#06395F]/80 border border-[#06395F]/10 hover:bg-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading Skeleton */}
      {loading && appointments.length === 0 && (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-[13px] bg-white/85 border border-[#06395F]/10 p-6 space-y-4 animate-pulse shadow-xs"
            >
              <div className="h-5 bg-slate-200 rounded w-1/3" />
              <div className="h-4 bg-slate-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredAppointments.length === 0 && (
        <div className="rounded-[13px] bg-white/85 border border-[#06395F]/10 p-10 sm:p-14 text-center space-y-4 shadow-[0_1px_2px_rgba(6,57,95,0.06)]">
          <div className="w-14 h-14 mx-auto rounded-[13px] bg-sky-50 text-[#0D8BE0] flex items-center justify-center border border-sky-100 shadow-xs">
            <CalendarCheck2 className="w-7 h-7" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="font-display text-lg font-bold text-[#06395F]">
              No {filter.toLowerCase()} appointments
            </h3>
            <p className="text-[13px] text-[#06395F]/75 leading-relaxed font-normal">
              When pet parents schedule consultations or procedures with your clinic, patient profiles will appear here in real time.
            </p>
          </div>
        </div>
      )}

      {/* Appointment Cards (Solid Surfaces) */}
      {!loading && filteredAppointments.length > 0 && (
        <div className="space-y-4">
          {filteredAppointments.map((app) => (
            <div
              key={app.id}
              className="rounded-[13px] bg-white/85 border border-[#06395F]/10 p-5 sm:p-6 shadow-[0_1px_2px_rgba(6,57,95,0.06)] hover:border-[#0D8BE0]/30 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-base font-bold text-[#06395F] truncate">
                      {app.serviceTitle}
                    </h3>
                    <StatusBadge status={app.status} />
                  </div>

                  <div className="flex items-center gap-3 text-[13px] text-[#06395F]">
                    <span>Pet: <strong className="font-bold">{app.petName}</strong> ({app.petSpecies})</span>
                    <span>•</span>
                    <span>Guardian: <strong>{app.clientName}</strong></span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[12px] text-[#06395F]/75">
                    <Phone className="w-3.5 h-3.5 text-[#0D8BE0]" />
                    <a href={`tel:${app.clientPhone}`} className="hover:underline font-medium">
                      {app.clientPhone}
                    </a>
                  </div>
                </div>

                <div className="p-3 rounded-[11px] bg-[#F3F9FF] border border-[#06395F]/10 text-right sm:text-left space-y-0.5 shrink-0">
                  <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#06395F]">
                    <CalendarCheck2 className="w-4 h-4 text-[#0D8BE0]" />
                    <span>{app.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#06395F]/70 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#06395F]/50" />
                    <span>{app.timeSlot}</span>
                  </div>
                </div>
              </div>

              {/* Financial Breakdown Pill */}
              <div className="p-3.5 rounded-[11px] bg-white border border-[#06395F]/10 flex flex-col md:flex-row md:items-center justify-between gap-3 text-[12px]">
                <div className="flex items-center gap-3">
                  <div className="text-[#06395F]">
                    Total fee: <strong className="font-bold tabular-nums text-[#06395F]">{formatBDT(app.totalPriceBDT)}</strong>
                  </div>
                  <span className="text-[#06395F]/50">•</span>
                  <div className="text-[#06395F]">
                    10% online deposit: <strong className="font-bold text-emerald-700">{formatBDT(app.paidOnlineBDT)}</strong>
                  </div>
                </div>

                <div className="text-emerald-800 font-bold">
                  Collect cash at clinic counter: {formatBDT(app.dueAtClinicBDT)}
                </div>
              </div>

              {app.notes && (
                <div className="text-[12px] text-[#06395F]/75 bg-slate-50 p-2.5 rounded-[8px]">
                  <strong>Guardian notes:</strong> {app.notes}
                </div>
              )}

              {/* Workflow Actions */}
              <div className="pt-2 border-t border-[#06395F]/10 flex flex-wrap items-center justify-between gap-2.5">
                <span className="text-[11px] text-[#06395F]/60">
                  Ref ID: <strong>{app.id}</strong>
                </span>

                <div className="flex flex-wrap items-center gap-2">
                  {app.status === "PENDING" && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleAction(app.id, "accept")}
                        className="px-3.5 py-1.5 rounded-[9px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white text-[12px] font-semibold shadow-xs"
                      >
                        Accept visit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAction(app.id, "decline")}
                        className="px-3 py-1.5 rounded-[9px] border border-rose-200 text-rose-600 hover:bg-rose-50 text-[12px] font-semibold"
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {app.status === "CONFIRMED" && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleAction(app.id, "start")}
                        className="px-3.5 py-1.5 rounded-[9px] bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-semibold shadow-xs flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Start appointment</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAction(app.id, "no-show")}
                        className="px-3 py-1.5 rounded-[9px] border border-slate-200 text-[#06395F]/70 hover:bg-slate-50 text-[12px] font-semibold"
                      >
                        Mark no-show
                      </button>
                    </>
                  )}

                  {app.status === "IN_PROGRESS" && (
                    <button
                      type="button"
                      onClick={() => handleAction(app.id, "complete")}
                      className="px-4 py-1.5 rounded-[9px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white text-[12px] font-semibold shadow-xs flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Complete consultation</span>
                    </button>
                  )}

                  <Link
                    href="/dashboard/provider/messages"
                    className="px-3.5 py-1.5 rounded-[9px] bg-white border border-[#06395F]/15 text-[#06395F] text-[12px] font-semibold hover:bg-slate-50 transition shadow-2xs flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#0D8BE0]" />
                    <span>Chat</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
