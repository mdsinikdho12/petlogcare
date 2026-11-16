"use client";

import { useState } from "react";
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
} from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "@/components/dashboard/StatusBadge";

interface OwnerBooking {
  id: string;
  clinicName: string;
  clinicAddress: string;
  serviceTitle: string;
  petName: string;
  date: string;
  timeSlot: string;
  status: "CONFIRMED" | "PENDING" | "COMPLETED" | "CANCELLED";
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

  const [bookings, setBookings] = useState<OwnerBooking[]>([
    {
      id: "bk-101",
      clinicName: "CareVet Animal Hospital & Surgery",
      clinicAddress: "House 14, Road 7, Dhanmondi, Dhaka",
      serviceTitle: "Comprehensive Veterinary Consultation",
      petName: "Miu Miu",
      date: "2026-11-20",
      timeSlot: "10:30 AM",
      status: "CONFIRMED",
      paymentType: "PAY_NOW",
      totalPriceBDT: 800,
      paidOnlineBDT: 800,
      dueAtClinicBDT: 0,
    },
    {
      id: "bk-102",
      clinicName: "Paws & Claws Veterinary Care",
      clinicAddress: "Plot 22, Road 113, Gulshan-2, Dhaka",
      serviceTitle: "Full Medicated Grooming & De-Shedding",
      petName: "Rocky",
      date: "2026-11-24",
      timeSlot: "04:00 PM",
      status: "CONFIRMED",
      paymentType: "PAY_ON_VISIT",
      totalPriceBDT: 1600,
      paidOnlineBDT: 160,
      dueAtClinicBDT: 1440,
    },
    {
      id: "bk-100",
      clinicName: "CareVet Animal Hospital & Surgery",
      clinicAddress: "House 14, Road 7, Dhanmondi, Dhaka",
      serviceTitle: "Core Rabies Annual Booster",
      petName: "Miu Miu",
      date: "2026-04-01",
      timeSlot: "11:00 AM",
      status: "COMPLETED",
      paymentType: "PAY_NOW",
      totalPriceBDT: 1200,
      paidOnlineBDT: 1200,
      dueAtClinicBDT: 0,
    },
  ]);

  const filteredBookings = bookings.filter((b) => {
    if (filter === "UPCOMING") return b.status === "CONFIRMED" || b.status === "PENDING";
    if (filter === "COMPLETED") return b.status === "COMPLETED";
    return true;
  });

  const handleCancelBooking = (id: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "CANCELLED" } : b))
      );
      toast.info("Booking cancelled. Confirmation sent via SMS.");
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

        <Link
          href="/providers"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white text-[13px] font-semibold shadow-[0_4px_14px_rgba(13,150,230,0.30)] hover:-translate-y-0.5 active:translate-y-0 transition shrink-0 whitespace-nowrap"
        >
          <span>Book new appointment</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
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
            className={`px-3.5 py-2 rounded-[11px] text-[12px] font-semibold transition-all ${
              filter === tab.id
                ? "bg-[#0D8BE0] text-white shadow-xs"
                : "bg-white/80 text-[#06395F]/80 border border-[#06395F]/10 hover:bg-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List (Solid Surfaces) */}
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
                  <div className="text-[12px] text-[#06395F]/80 font-semibold pl-5">
                    {b.timeSlot}
                  </div>
                </div>
              </div>

              {/* Patient & Financial Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#06395F]/10 text-[12px]">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-medium text-[#06395F]/60 block capitalize">
                    Patient details
                  </span>
                  <div className="font-semibold text-[#06395F] flex items-center gap-1.5">
                    <span>{b.petName}</span>
                    <span className="text-[11px] text-[#06395F]/60 font-normal">
                      (Digital passport linked)
                    </span>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[11px] font-medium text-[#06395F]/60 block capitalize">
                    Payment plan
                  </span>
                  <div className="font-semibold text-[#06395F]">
                    {b.paymentType === "PAY_NOW" ? (
                      <span className="text-emerald-700">
                        Paid online: <strong className="tabular-nums font-bold">{formatBDT(b.paidOnlineBDT)}</strong> (Fully cleared)
                      </span>
                    ) : (
                      <span>
                        Paid online: <strong className="tabular-nums font-bold">{formatBDT(b.paidOnlineBDT)}</strong> •{" "}
                        <span className="text-emerald-800">
                          Due at clinic: <strong className="tabular-nums font-bold">{formatBDT(b.dueAtClinicBDT)}</strong>
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {b.status === "CONFIRMED" && (
                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleCancelBooking(b.id)}
                    className="px-3.5 py-1.5 rounded-[9px] border border-rose-200 bg-rose-50 text-[12px] font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
                  >
                    Cancel booking
                  </button>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(
                      b.clinicAddress
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-[9px] bg-[#0D8BE0] hover:bg-[#0A77C2] text-white text-[12px] font-semibold shadow-xs flex items-center gap-1 transition"
                  >
                    <span>Get directions</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
