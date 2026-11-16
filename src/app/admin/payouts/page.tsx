// src/app/admin/payouts/page.tsx
"use client";

import React, { useState } from "react";
import {
  Wallet,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Building2,
  ArrowUpRight,
  X,
  CreditCard,
  DollarSign,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "@/components/dashboard/StatusBadge";

interface PayoutRequest {
  id: string;
  clinicName: string;
  leadDoctor: string;
  amountBDT: number;
  method: "BKASH" | "NAGAD" | "BANK";
  accountDetails: string;
  accountName: string;
  requestedAt: string;
  status: "QUEUED" | "PROCESSING" | "PAID" | "REJECTED";
  transactionRef?: string;
}

const mockPayouts: PayoutRequest[] = [
  {
    id: "po-701",
    clinicName: "CareVet Animal Hospital & Surgery",
    leadDoctor: "Dr. Samira Khan",
    amountBDT: 18500,
    method: "BKASH",
    accountDetails: "01812-987654 (Merchant)",
    accountName: "CareVet Animal Hospital Ltd",
    requestedAt: "Today, 09:30 AM",
    status: "QUEUED",
  },
  {
    id: "po-702",
    clinicName: "Paws & Claws Veterinary Care",
    leadDoctor: "Farhan Chowdhury",
    amountBDT: 24000,
    method: "BANK",
    accountDetails: "City Bank • Acc: 1102938475 • Gulshan Br.",
    accountName: "Paws and Claws BD",
    requestedAt: "Yesterday, 06:15 PM",
    status: "QUEUED",
  },
  {
    id: "po-698",
    clinicName: "Uttara Pet Wellness Center",
    leadDoctor: "Dr. Anisur Rahman",
    amountBDT: 12400,
    method: "NAGAD",
    accountDetails: "01722-334455 (Personal)",
    accountName: "Anisur Rahman",
    requestedAt: "13 Nov, 11:20 AM",
    status: "PAID",
    transactionRef: "TXN-NGD-99882103",
  },
  {
    id: "po-689",
    clinicName: "Mirpur Central Pet Clinic",
    leadDoctor: "Dr. Kazi Tanvir",
    amountBDT: 9500,
    method: "BKASH",
    accountDetails: "01911-223344 (Personal)",
    accountName: "Kazi Tanvir",
    requestedAt: "10 Nov, 03:45 PM",
    status: "PAID",
    transactionRef: "TXN-BKS-88129034",
  },
];

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<PayoutRequest[]>(mockPayouts);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Mark Paid Modal
  const [payingPayout, setPayingPayout] = useState<PayoutRequest | null>(null);
  const [txnRef, setTxnRef] = useState("");

  const filtered = payouts.filter((p) => {
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    const matchesSearch =
      p.clinicName.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.accountName.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalQueued = payouts
    .filter((p) => p.status === "QUEUED")
    .reduce((sum, p) => sum + p.amountBDT, 0);

  const confirmMarkPaid = () => {
    if (!payingPayout) return;
    if (!txnRef.trim()) {
      toast.error("Please provide the bank or MFS transaction reference number");
      return;
    }
    setPayouts((prev) =>
      prev.map((item) =>
        item.id === payingPayout.id
          ? { ...item, status: "PAID", transactionRef: txnRef }
          : item
      )
    );
    toast.success(`Payout ${payingPayout.id} marked as PAID`);
    setPayingPayout(null);
    setTxnRef("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-[28px] font-bold tracking-tight text-[#06395F]">
            Provider payout settlements
          </h1>
          <p className="text-[13px] text-[#06395F]/75 mt-0.5 font-normal">
            Manage provider wallet withdrawal requests and dispatch settlements via bKash, Nagad, and BEFTN.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[11px] bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold">
          <Wallet className="w-4 h-4 text-emerald-600" />
          <span>
            ৳ {new Intl.NumberFormat("en-BD").format(totalQueued)} queued for payout
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
            placeholder="Search clinic or batch ID..."
            className="w-full h-10 pl-10 pr-3.5 rounded-[11px] border border-[#06395F]/15 bg-white text-xs text-[#06395F] placeholder:text-[#06395F]/40 focus:outline-none focus:ring-2 focus:ring-[#0D8BE0]"
          />
        </div>

        <div className="flex items-center gap-1 p-1 rounded-[11px] bg-slate-100 border border-slate-200 text-xs font-semibold text-[#06395F]">
          {["ALL", "QUEUED", "PAID"].map((s) => (
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
              {s === "ALL" ? "All settlements" : s === "QUEUED" ? "Queued" : "Settled"}
            </button>
          ))}
        </div>
      </div>

      {/* Payouts Table */}
      <div className="rounded-[13px] bg-white/85 border border-[#06395F]/10 shadow-[0_1px_2px_rgba(6,57,95,0.06)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#06395F]">
            <thead className="bg-[#F8FBFE] border-b border-[#06395F]/10 text-[11px] font-semibold text-[#06395F]/70 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Batch ID & Request Time</th>
                <th className="px-5 py-3.5">Clinic Practice</th>
                <th className="px-5 py-3.5">Disbursement Account</th>
                <th className="px-5 py-3.5">Net Amount (BDT)</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Settlement Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#06395F]/8">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-sky-50/40 transition">
                  <td className="px-5 py-3.5">
                    <p className="font-mono font-bold text-xs text-[#06395F]">{p.id}</p>
                    <p className="text-[11px] text-[#06395F]/70">{p.requestedAt}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-[13px] text-[#06395F]">{p.clinicName}</p>
                    <p className="text-[11px] text-[#06395F]/70">{p.leadDoctor}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="space-y-0.5">
                      <span className="inline-block px-1.5 py-0.5 rounded-[6px] bg-slate-100 font-bold text-[10px] text-[#06395F]">
                        {p.method}
                      </span>
                      <p className="font-medium text-xs text-[#06395F]">{p.accountDetails}</p>
                      <p className="text-[10px] text-[#06395F]/60">{p.accountName}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-sm text-[#06395F]">
                      ৳ {new Intl.NumberFormat("en-BD").format(p.amountBDT)}
                    </p>
                    <p className="text-[10px] text-emerald-600 font-semibold">100% net of fees</p>
                  </td>
                  <td className="px-5 py-3.5">
                    {p.status === "QUEUED" ? (
                      <StatusBadge status="PENDING" label="Queued for payout" />
                    ) : (
                      <StatusBadge status="PAID" />
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {p.status === "QUEUED" ? (
                      <button
                        type="button"
                        onClick={() => {
                          setPayingPayout(p);
                          setTxnRef("");
                        }}
                        className="px-3 py-1.5 rounded-[9px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white text-[11px] font-semibold hover:-translate-y-0.5 transition shadow-xs"
                      >
                        Process payout
                      </button>
                    ) : (
                      <div className="text-[11px] font-mono text-[#06395F]/70">
                        {p.transactionRef}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mark Paid Confirmation Modal */}
      {payingPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[13px] border border-white/80 bg-white/95 p-6 shadow-2xl backdrop-blur-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#06395F]/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-[11px] bg-emerald-500/15 text-emerald-600 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-[#06395F]">
                    Disburse payout {payingPayout.id}
                  </h2>
                  <p className="text-xs text-[#06395F]/70">
                    ৳ {new Intl.NumberFormat("en-BD").format(payingPayout.amountBDT)} to {payingPayout.clinicName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPayingPayout(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-[11px] bg-slate-50 border border-slate-200/60 text-xs space-y-1 text-[#06395F]">
              <p>Account Type: <strong>{payingPayout.method}</strong></p>
              <p>Recipient: <strong>{payingPayout.accountName}</strong></p>
              <p>Account Details: <strong>{payingPayout.accountDetails}</strong></p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#06395F]">
                Bank / MFS Transaction Reference ID
              </label>
              <input
                type="text"
                value={txnRef}
                onChange={(e) => setTxnRef(e.target.value)}
                placeholder="e.g. TXN-BKS-99182301 or BEFTN-102938"
                className="w-full h-10 px-3 rounded-[11px] border border-[#06395F]/20 text-xs text-[#06395F] font-mono focus:outline-none focus:ring-2 focus:ring-[#0D8BE0]"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPayingPayout(null)}
                className="px-4 py-2 rounded-[11px] border border-[#06395F]/15 bg-white text-xs font-semibold text-[#06395F]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmMarkPaid}
                className="px-4 py-2 rounded-[11px] bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition"
              >
                Confirm settlement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
