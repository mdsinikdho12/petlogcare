// src/app/admin/bookings/page.tsx
"use client";

import React, { useState } from "react";
import {
  CalendarCheck2,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  X,
  Building2,
  User,
  DollarSign,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "@/components/dashboard/StatusBadge";

interface AdminBooking {
  id: string;
  patientName: string;
  petSpecies: string;
  ownerName: string;
  clinicName: string;
  serviceTitle: string;
  dateTime: string;
  totalBDT: number;
  depositPaidBDT: number;
  status: "CONFIRMED" | "COMPLETED" | "DISPUTED" | "REFUNDED" | "CANCELLED";
  disputeReason?: string;
  providerNotes?: string;
}

const mockBookings: AdminBooking[] = [
  {
    id: "bk-901",
    patientName: "Milo",
    petSpecies: "Golden Retriever",
    ownerName: "MD Ferdous Ahmed",
    clinicName: "CareVet Animal Hospital & Surgery",
    serviceTitle: "Comprehensive Clinical Veterinary Consultation",
    dateTime: "Tomorrow, 10:30 AM",
    totalBDT: 800,
    depositPaidBDT: 80,
    status: "CONFIRMED",
  },
  {
    id: "bk-892",
    patientName: "Luna",
    petSpecies: "Persian Cat",
    ownerName: "Nusrat Jahan",
    clinicName: "Paws & Claws Veterinary Care",
    serviceTitle: "Emergency Trauma & X-Ray Examination",
    dateTime: "14 Nov, 03:00 PM",
    totalBDT: 3200,
    depositPaidBDT: 320,
    status: "DISPUTED",
    disputeReason: "Attending doctor was absent during scheduled trauma window; had to visit another emergency hospital.",
    providerNotes: "Duty veterinarian was scrubbed in an emergency caesarean section. Offered 45-min rescheduled slot.",
  },
  {
    id: "bk-885",
    patientName: "Rocky",
    petSpecies: "German Shepherd",
    ownerName: "Tanzir Hossain",
    clinicName: "Uttara Pet Wellness Center",
    serviceTitle: "Core Rabies & Annual Vaccine Administration",
    dateTime: "12 Nov, 11:00 AM",
    totalBDT: 1200,
    depositPaidBDT: 120,
    status: "COMPLETED",
  },
  {
    id: "bk-870",
    patientName: "Simba",
    petSpecies: "Domestic Cat",
    ownerName: "Arif Karim",
    clinicName: "Fluffy Tails Grooming & Boarding Resort",
    serviceTitle: "Full Hygienic Pet Grooming & Medicated Bath",
    dateTime: "09 Nov, 02:30 PM",
    totalBDT: 1800,
    depositPaidBDT: 180,
    status: "DISPUTED",
    disputeReason: "Cat sustained skin abrasion during grooming; requested refund of service deposit.",
    providerNotes: "Severe matted fur caused skin irritation prior to grooming. First aid ointment was applied.",
  },
  {
    id: "bk-861",
    patientName: "Coco",
    petSpecies: "Beagle",
    ownerName: "Rifat Hasan",
    clinicName: "Mirpur Central Pet Clinic",
    serviceTitle: "Dental Prophylaxis & Scaling",
    dateTime: "05 Nov, 04:00 PM",
    totalBDT: 2500,
    depositPaidBDT: 250,
    status: "REFUNDED",
  },
];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>(mockBookings);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Dispute resolution modal
  const [resolvingBooking, setResolvingBooking] = useState<AdminBooking | null>(null);

  const filtered = bookings.filter((b) => {
    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
    const matchesSearch =
      b.patientName.toLowerCase().includes(search.toLowerCase()) ||
      b.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      b.clinicName.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleResolveDispute = (decision: "PROVIDER" | "OWNER") => {
    if (!resolvingBooking) return;

    if (decision === "PROVIDER") {
      setBookings((prev) =>
        prev.map((item) =>
          item.id === resolvingBooking.id
            ? { ...item, status: "COMPLETED" }
            : item
        )
      );
      toast.success(
        `Dispute on ${resolvingBooking.id} resolved in favor of clinic provider. Payout finalized.`
      );
    } else {
      setBookings((prev) =>
        prev.map((item) =>
          item.id === resolvingBooking.id
            ? { ...item, status: "REFUNDED" }
            : item
        )
      );
      toast.success(
        `Dispute on ${resolvingBooking.id} resolved in favor of pet parent. Refund of ৳ ${resolvingBooking.depositPaidBDT} initiated.`
      );
    }
    setResolvingBooking(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-[28px] font-bold tracking-tight text-[#06395F]">
            Bookings & dispute oversight
          </h1>
          <p className="text-[13px] text-[#06395F]/75 mt-0.5 font-normal">
            Platform-wide appointment ledger, escrow settlement, and conflict resolution.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[11px] bg-rose-50 border border-rose-200 text-xs text-rose-800 font-semibold">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <span>
            {bookings.filter((b) => b.status === "DISPUTED").length} open disputes
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-[13px] bg-white/85 border border-[#06395F]/10 p-4 shadow-[0_1px_2px_rgba(6,57,95,0.06)] flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#06395F]/50" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search booking ID, pet, owner, or clinic..."
            className="w-full h-10 pl-10 pr-3.5 rounded-[11px] border border-[#06395F]/15 bg-white text-xs text-[#06395F] placeholder:text-[#06395F]/40 focus:outline-none focus:ring-2 focus:ring-[#0D8BE0]"
          />
        </div>

        <div className="flex items-center gap-1 p-1 rounded-[11px] bg-slate-100 border border-slate-200 text-xs font-semibold text-[#06395F]">
          {["ALL", "DISPUTED", "CONFIRMED", "COMPLETED", "REFUNDED"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-[9px] transition ${
                statusFilter === s
                  ? "bg-white text-[#0D8BE0] shadow-xs"
                  : "text-[#06395F]/70 hover:text-[#06395F]"
              }`}
            >
              {s === "ALL"
                ? "All"
                : s === "DISPUTED"
                ? "Disputes"
                : s === "CONFIRMED"
                ? "Confirmed"
                : s === "COMPLETED"
                ? "Completed"
                : "Refunded"}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="rounded-[13px] bg-white/85 border border-[#06395F]/10 shadow-[0_1px_2px_rgba(6,57,95,0.06)] overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs text-[#06395F]">
            <thead className="bg-[#F8FBFE] border-b border-[#06395F]/10 text-[11px] font-semibold text-[#06395F]/70 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Booking ID & Date</th>
                <th className="px-5 py-3.5">Patient & Parent</th>
                <th className="px-5 py-3.5">Clinic & Service</th>
                <th className="px-5 py-3.5">Amount (BDT)</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#06395F]/8">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-sky-50/40 transition">
                  <td className="px-5 py-3.5">
                    <p className="font-mono font-bold text-xs text-[#06395F]">{b.id}</p>
                    <p className="text-[11px] text-[#06395F]/70">{b.dateTime}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-[13px] text-[#06395F]">
                      {b.patientName} <span className="text-[11px] font-normal text-[#06395F]/70">({b.petSpecies})</span>
                    </p>
                    <p className="text-[11px] text-[#06395F]/70">{b.ownerName}</p>
                  </td>
                  <td className="px-5 py-3.5 max-w-xs">
                    <p className="font-semibold text-xs text-[#06395F] truncate">{b.clinicName}</p>
                    <p className="text-[11px] text-[#06395F]/70 truncate">{b.serviceTitle}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-xs text-[#06395F]">
                      ৳ {new Intl.NumberFormat("en-BD").format(b.totalBDT)}
                    </p>
                    <p className="text-[10px] text-[#06395F]/60">
                      Paid deposit: ৳ {b.depositPaidBDT}
                    </p>
                  </td>
                  <td className="px-5 py-3.5">
                    {b.status === "CONFIRMED" ? (
                      <StatusBadge status="CONFIRMED" />
                    ) : b.status === "COMPLETED" ? (
                      <StatusBadge status="COMPLETED" />
                    ) : b.status === "DISPUTED" ? (
                      <StatusBadge status="CANCELLED" label="Disputed" />
                    ) : (
                      <StatusBadge status={b.status} />
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {b.status === "DISPUTED" ? (
                      <button
                        type="button"
                        onClick={() => setResolvingBooking(b)}
                        className="px-3 py-1.5 rounded-[9px] bg-rose-600 text-white text-[11px] font-semibold hover:bg-rose-700 transition shadow-2xs inline-flex items-center gap-1"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Resolve dispute</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-[#06395F]/60">Settled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="block md:hidden divide-y divide-[#06395F]/10">
          {filtered.map((b) => (
            <div key={b.id} className="p-4 space-y-2.5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono font-bold text-xs">{b.id}</span>
                  <h4 className="font-bold text-sm text-[#06395F]">{b.patientName} ({b.ownerName})</h4>
                  <p className="text-xs text-[#06395F]/70">{b.clinicName}</p>
                </div>
                <span className="font-bold text-xs">৳ {b.totalBDT}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#06395F]/75">
                <span>{b.dateTime}</span>
                <span className="font-semibold">{b.status}</span>
              </div>
              {b.status === "DISPUTED" && (
                <button
                  type="button"
                  onClick={() => setResolvingBooking(b)}
                  className="w-full py-2 rounded-[9px] bg-rose-600 text-white text-xs font-semibold"
                >
                  Resolve dispute
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dispute Resolution Modal */}
      {resolvingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-[13px] border border-white/80 bg-white/95 p-6 shadow-2xl backdrop-blur-xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#06395F]/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-[11px] bg-rose-500/15 text-rose-600 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-[#06395F]">
                    Dispute resolution: {resolvingBooking.id}
                  </h2>
                  <p className="text-xs text-[#06395F]/70">
                    Total: ৳ {resolvingBooking.totalBDT} • Deposit Paid: ৳ {resolvingBooking.depositPaidBDT}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setResolvingBooking(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#06395F]">
              <div className="p-3.5 rounded-[11px] bg-rose-50/70 border border-rose-200 space-y-1">
                <p className="font-bold text-rose-900 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>Pet Parent Complaint ({resolvingBooking.ownerName}):</span>
                </p>
                <p className="text-rose-950 leading-relaxed font-normal">
                  {resolvingBooking.disputeReason}
                </p>
              </div>

              <div className="p-3.5 rounded-[11px] bg-sky-50/70 border border-sky-200 space-y-1">
                <p className="font-bold text-[#06395F] flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#0D8BE0]" />
                  <span>Clinic Statement ({resolvingBooking.clinicName}):</span>
                </p>
                <p className="text-[#06395F]/85 leading-relaxed font-normal">
                  {resolvingBooking.providerNotes}
                </p>
              </div>

              <div className="p-3 rounded-[11px] bg-slate-50 border border-slate-200/60 text-[11px] text-[#06395F]/80">
                <p className="font-semibold text-[#06395F] mb-1">Financial Settlement Rules:</p>
                <p>• If Owner wins: Deposit of <strong>৳ {resolvingBooking.depositPaidBDT}</strong> is refunded to user MFS (bKash/Nagad).</p>
                <p>• If Provider wins: <strong>৳ {resolvingBooking.depositPaidBDT - Math.round(resolvingBooking.depositPaidBDT * 0.1)}</strong> is released to provider wallet.</p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={() => setResolvingBooking(null)}
                className="w-full sm:w-auto px-4 py-2 rounded-[11px] border border-[#06395F]/15 bg-white text-xs font-semibold text-[#06395F]"
              >
                Cancel
              </button>

              <div className="w-full sm:w-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleResolveDispute("PROVIDER")}
                  className="flex-1 sm:flex-initial px-3.5 py-2 rounded-[11px] border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition"
                >
                  Provider wins
                </button>
                <button
                  type="button"
                  onClick={() => handleResolveDispute("OWNER")}
                  className="flex-1 sm:flex-initial px-3.5 py-2 rounded-[11px] bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition"
                >
                  Owner wins (Refund ৳{resolvingBooking.depositPaidBDT})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
