// src/app/admin/reviews/page.tsx
"use client";

import React, { useState } from "react";
import {
  Star,
  Search,
  Filter,
  AlertTriangle,
  EyeOff,
  Eye,
  CheckCircle2,
  ThumbsDown,
  Building2,
  User,
  Clock,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "@/components/dashboard/StatusBadge";

interface ModerationReview {
  id: string;
  authorName: string;
  clinicName: string;
  rating: number;
  comment: string;
  serviceUsed: string;
  date: string;
  flagReason?: string;
  flaggedBy?: string;
  status: "FLAGGED" | "APPROVED" | "HIDDEN";
}

const mockReviews: ModerationReview[] = [
  {
    id: "rev-101",
    authorName: "Anisur Rahman",
    clinicName: "CareVet Animal Hospital & Surgery",
    rating: 1,
    comment: "Doctor did not show up on time and charges were different from what was shown in the app.",
    serviceUsed: "Comprehensive Clinical Consultation",
    date: "14 Nov 2026",
    flagReason: "Reported by clinic for false statement regarding doctor availability.",
    flaggedBy: "CareVet Administration",
    status: "FLAGGED",
  },
  {
    id: "rev-98",
    authorName: "Sabrina Hossain",
    clinicName: "Mirpur Central Pet Clinic",
    rating: 2,
    comment: "Poor hygiene in the examination table and rude receptionist.",
    serviceUsed: "Annual Rabies Vaccination",
    date: "12 Nov 2026",
    flagReason: "Profanity reported in original Bengali text before translation.",
    flaggedBy: "System Content Filter",
    status: "FLAGGED",
  },
  {
    id: "rev-85",
    authorName: "Tanzir Ahmed",
    clinicName: "Paws & Claws Veterinary Care",
    rating: 5,
    comment: "Dr. Farhan is an absolute lifesaver. Handled my cat's urinary blockage with incredible care and surgical skill.",
    serviceUsed: "Feline Emergency Surgery",
    date: "10 Nov 2026",
    status: "APPROVED",
  },
  {
    id: "rev-70",
    authorName: "Anonymous User",
    clinicName: "Uttara Pet Wellness Center",
    rating: 1,
    comment: "Scam clinic, do not visit them, go to my clinic instead.",
    serviceUsed: "General Checkup",
    date: "05 Nov 2026",
    flagReason: "Competitor spam and self-promotion.",
    flaggedBy: "Automated Fraud Detection",
    status: "HIDDEN",
  },
];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ModerationReview[]>(mockReviews);
  const [statusFilter, setStatusFilter] = useState<string>("FLAGGED");
  const [search, setSearch] = useState("");

  const filtered = reviews.filter((r) => {
    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    const matchesSearch =
      r.clinicName.toLowerCase().includes(search.toLowerCase()) ||
      r.authorName.toLowerCase().includes(search.toLowerCase()) ||
      r.comment.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleHide = (id: string) => {
    setReviews((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "HIDDEN" } : item
      )
    );
    toast.success("Review hidden from public practice profiles");
  };

  const handleApprove = (id: string) => {
    setReviews((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "APPROVED", flagReason: undefined } : item
      )
    );
    toast.success("Review approved and restored to public profiles");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-[28px] font-bold tracking-tight text-[#06395F]">
            Review & rating moderation
          </h1>
          <p className="text-[13px] text-[#06395F]/75 mt-0.5 font-normal">
            Moderate reported client ratings, prevent competitor smear attacks, and uphold authentic pet care feedback.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[11px] bg-indigo-50 border border-indigo-200 text-xs text-indigo-800 font-semibold">
          <Star className="w-4 h-4 text-indigo-600" />
          <span>
            {reviews.filter((r) => r.status === "FLAGGED").length} reviews needing review
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
            placeholder="Search review content, clinic or client..."
            className="w-full h-10 pl-10 pr-3.5 rounded-[11px] border border-[#06395F]/15 bg-white text-xs text-[#06395F] placeholder:text-[#06395F]/40 focus:outline-none focus:ring-2 focus:ring-[#0D8BE0]"
          />
        </div>

        <div className="flex items-center gap-1 p-1 rounded-[11px] bg-slate-100 border border-slate-200 text-xs font-semibold text-[#06395F]">
          {["FLAGGED", "APPROVED", "HIDDEN", "ALL"].map((s) => (
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
              {s === "FLAGGED" ? "Flagged / Reported" : s === "APPROVED" ? "Published" : s === "HIDDEN" ? "Hidden" : "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((rev) => (
          <div
            key={rev.id}
            className="rounded-[13px] bg-white/85 border border-[#06395F]/10 p-5 shadow-[0_1px_2px_rgba(6,57,95,0.06)] space-y-3.5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-200"
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-[#06395F] ml-1">
                    {rev.rating}.0
                  </span>
                </div>
                <h3 className="font-bold text-sm text-[#06395F]">{rev.clinicName}</h3>
                <p className="text-[11px] text-[#06395F]/70">
                  By {rev.authorName} • {rev.serviceUsed}
                </p>
              </div>

              <div>
                {rev.status === "FLAGGED" ? (
                  <StatusBadge status="CRITICAL" label="Reported" />
                ) : rev.status === "APPROVED" ? (
                  <StatusBadge status="SUCCESS" label="Published" />
                ) : (
                  <StatusBadge status="NEUTRAL" label="Hidden" />
                )}
              </div>
            </div>

            <p className="text-xs text-[#06395F]/85 italic bg-slate-50 p-3 rounded-[9px] border border-slate-200/50 leading-relaxed font-normal">
              &ldquo;{rev.comment}&rdquo;
            </p>

            {rev.flagReason && (
              <div className="p-2.5 rounded-[8px] bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Flag reason: </span>
                  {rev.flagReason}
                  {rev.flaggedBy && (
                    <span className="block text-[10px] text-amber-800/80 mt-0.5">
                      Flagged by: {rev.flaggedBy}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-[#06395F]/10 flex items-center justify-between">
              <span className="text-[11px] text-[#06395F]/60">{rev.date}</span>

              <div className="flex items-center gap-2">
                {rev.status !== "HIDDEN" ? (
                  <button
                    type="button"
                    onClick={() => handleHide(rev.id)}
                    className="px-2.5 py-1.5 rounded-[9px] border border-rose-300 bg-rose-50 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition inline-flex items-center gap-1"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide review</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleApprove(rev.id)}
                    className="px-2.5 py-1.5 rounded-[9px] border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition inline-flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Restore</span>
                  </button>
                )}

                {rev.status === "FLAGGED" && (
                  <button
                    type="button"
                    onClick={() => handleApprove(rev.id)}
                    className="px-3 py-1.5 rounded-[9px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white text-xs font-semibold shadow-xs hover:-translate-y-0.5 transition"
                  >
                    Dismiss report
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
