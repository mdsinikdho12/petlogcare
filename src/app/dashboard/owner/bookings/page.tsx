"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarCheck2,
  Clock,
  MapPin,
  ArrowRight,
  ExternalLink,
  Sparkles,
  CreditCard,
  Banknote,
  CheckCircle2,
  Calendar,
  RotateCw,
} from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { apiClient } from "@/lib/api/client";

interface OwnerBooking {
  id: string;
  clinicName: string;
  clinicAddress: string;
  serviceTitle: string;
  petName: string;
  date: string;
  timeSlot: string;
  status: any;
  paymentType: "PAY_NOW" | "PAY_ON_VISIT";
  totalPriceBDT: number;
  paidOnlineBDT: number;
  dueAtClinicBDT: number;
}

function formatBDT(amount: number): string {
  return `৳${new Intl.NumberFormat("en-BD").format(amount)}`;
}

export default function OwnerBookingsPage() {
  const [filter, setFilter] = useState<"ALL" | "UPCOMING" | "COMPLETED">("UPCOMING");
  const [bookings, setBookings] = useState<OwnerBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/bookings/me");
      const items = res.data?.data || [];
      if (Array.isArray(items)) {
        const mapped: OwnerBooking[] = items.map((b: any) => {
          const total = b.pricing?.totalPrice || b.totalAmount || 800;
          const paid = b.pricing?.paidOnline || b.paidAmount || (b.paymentType === "PAY_NOW" ? total : Math.round(total * 0.1));
          const due = b.pricing?.dueAtClinic || (total - paid);

          return {
            id: b._id || b.id,
            clinicName: b.provider?.businessName || b.serviceType?.provider?.businessName || "Partner Veterinary Clinic",
            clinicAddress: `${b.provider?.address?.area || b.provider?.address?.city || "Dhaka"}, ${b.provider?.address?.district || "Dhaka"}`,
            serviceTitle: b.serviceType?.name || b.serviceType?.title || "Clinical Veterinary Care",
            petName: b.pet?.name || "Companion Pet",
            date: b.date || "2026-11-20",
            timeSlot: b.startTime || "10:30 AM",
            status: b.status || "CONFIRMED",
            paymentType: b.paymentType || "PAY_ON_VISIT",
            totalPriceBDT: total,
            paidOnlineBDT: paid,
            dueAtClinicBDT: due,
          };
        });
        setBookings(mapped);
      }
    } catch (err) {
      console.error("Failed to load bookings from API:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    if (filter === "UPCOMING") return b.status === "CONFIRMED" || b.status === "PENDING" || b.status === "IN_PROGRESS";
    if (filter === "COMPLETED") return b.status === "COMPLETED";
    return true;
  });

  const handleCancelBooking = async (id: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      try {
        await apiClient.patch(`/bookings/${id}/cancel`, {
          reason: "Cancelled by pet owner from dashboard",
        });
        toast.info("Booking cancelled. Confirmation sent via SMS.");
        fetchBookings();
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to cancel booking");
      }
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Top Banner (Liquid Glass) */}
      <div className="rounded-[13px] border border-white/80 bg-white/55 p-6 sm:p-7 backdrop-blur-xl backdrop-saturate-150 shadow-[0_8px_30px_rgba(1,95,160,0.10),inset_0_1px_0_rgba(255,255,255,0.95)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-sky-500/15 text-[#0D8BE0] text-[12px] font-semibold mb-2.5 border border-white/80 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Appointment management</span>
          </div>
          <h1 className="font-display text-2xl sm:text-[28px] font-bold tracking-tight text-[#06395F]">
            My pet appointments
          </h1>
          <p className="text-[13px] sm:text-sm text-[#06395F]/80 mt-1 max-w-xl font-normal leading-relaxed">
            Review confirmed clinic visits, location directions, and transparent BDT payment receipts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchBookings}
            disabled={loading}
            className="p-2.5 rounded-[11px] bg-white border border-[#06395F]/15 text-[#06395F] hover:bg-slate-50 transition shadow-2xs"
            title="Refresh appointments"
          >
            <RotateCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <Link
            href="/providers"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white text-[13px] font-semibold shadow-[0_4px_14px_rgba(13,150,230,0.30)] hover:-translate-y-0.5 active:translate-y-0 transition shrink-0 whitespace-nowrap"
          >
            <span>Book new appointment</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Filter Tabs in Glass Pill Group */}
      <div className="flex items-center gap-2">
        {[
          { id: "UPCOMING", label: "Upcoming appointments" },
          { id: "COMPLETED", label: "Past history" },
          { id: "ALL", label: "All records" },
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
      {loading && bookings.length === 0 && (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-[13px] bg-white/85 border border-[#06395F]/10 p-6 space-y-4 animate-pulse shadow-xs"
            >
              <div className="h-5 bg-slate-200 rounded w-1/3" />
              <div className="h-4 bg-slate-200 rounded w-1/2" />
              <div className="h-14 bg-slate-100 rounded-[11px]" />
            </div>
          ))}
        </div>
      )}

      {/* Bookings List (Solid Surfaces) */}
      {!loading && (
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="rounded-[13px] bg-white/85 border border-[#06395F]/10 p-10 sm:p-12 text-center space-y-3 shadow-[0_1px_2px_rgba(6,57,95,0.06)]">
              <div className="w-12 h-12 mx-auto rounded-[11px] bg-sky-50 text-[#0D8BE0] flex items-center justify-center border border-sky-100">
                <CalendarCheck2 className="w-6 h-6" />
              </div>
              <h3 className="font-display text-base font-bold text-[#06395F]">
                No {filter.toLowerCase()} appointments found
              </h3>
              <p className="text-[13px] text-[#06395F]/75 max-w-sm mx-auto font-normal">
                Ready to schedule a checkup, booster vaccination, or grooming session for your pet?
              </p>
              <div className="pt-2">
                <Link
                  href="/providers"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white text-[12px] font-semibold shadow-xs hover:-translate-y-0.5 transition"
                >
                  <span>Find a clinic</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            filteredBookings.map((b) => (
              <div
                key={b.id}
                className="rounded-[13px] bg-white/85 border border-[#06395F]/10 p-5 sm:p-6 shadow-[0_1px_2px_rgba(6,57,95,0.06)] hover:border-[#0D8BE0]/30 hover:-translate-y-0.5 transition-all space-y-4"
              >
                {/* Top Row: Service, Clinic & Schedule */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-base font-bold text-[#06395F] truncate">
                        {b.serviceTitle}
                      </h3>
                      <StatusBadge status={b.status} />
                    </div>
                    <div className="text-[13px] font-semibold text-[#06395F]">
                      {b.clinicName}
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] text-[#06395F]/75">
                      <MapPin className="w-3.5 h-3.5 text-[#0D8BE0] shrink-0" />
                      <span>{b.clinicAddress}</span>
                    </div>
                  </div>

                  {/* Date & Time pill */}
                  <div className="p-3 rounded-[11px] bg-[#F3F9FF] border border-[#06395F]/10 text-right sm:text-left space-y-0.5 shrink-0">
                    <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#06395F]">
                      <CalendarCheck2 className="w-4 h-4 text-[#0D8BE0]" />
                      <span>{b.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#06395F]/70 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#06395F]/50" />
                      <span>{b.timeSlot}</span>
                    </div>
                  </div>
                </div>

                {/* Patient Information & Financial Split */}
                <div className="p-3.5 rounded-[11px] bg-white border border-[#06395F]/10 flex flex-col md:flex-row md:items-center justify-between gap-3 text-[12px]">
                  <div className="flex items-center gap-3">
                    <div className="px-2.5 py-1 rounded-[8px] bg-sky-50 text-[#0D8BE0] font-bold border border-sky-100">
                      Pet: {b.petName}
                    </div>
                    <span className="text-[#06395F]/60">•</span>
                    <div className="flex items-center gap-1 text-[#06395F]">
                      <CreditCard className="w-3.5 h-3.5 text-[#0D8BE0]" />
                      <span>Total: <strong className="font-bold tabular-nums text-[#06395F]">{formatBDT(b.totalPriceBDT)}</strong></span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-[#06395F]/80">
                      Paid online: <strong className="font-bold tabular-nums text-[#06395F]">{formatBDT(b.paidOnlineBDT)}</strong>
                    </div>
                    <div className="text-emerald-800 font-semibold">
                      Due at clinic: <strong className="font-bold tabular-nums text-emerald-800">{formatBDT(b.dueAtClinicBDT)}</strong>
                    </div>
                  </div>
                </div>

                {/* Bottom Row Actions */}
                <div className="pt-2 border-t border-[#06395F]/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[12px] text-[#06395F]/70 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Reference ID: <strong className="text-[#06395F]">{b.id}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    {b.status !== "CANCELLED" && b.status !== "COMPLETED" && (
                      <button
                        type="button"
                        onClick={() => handleCancelBooking(b.id)}
                        className="px-3 py-1.5 rounded-[9px] border border-rose-200 text-rose-700 hover:bg-rose-50 text-[12px] font-semibold transition"
                      >
                        Cancel visit
                      </button>
                    )}

                    <Link
                      href="/dashboard/owner/messages"
                      className="px-3.5 py-1.5 rounded-[9px] bg-white border border-[#06395F]/15 hover:bg-slate-50 text-[#06395F] text-[12px] font-semibold transition shadow-2xs"
                    >
                      Chat with clinic
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
