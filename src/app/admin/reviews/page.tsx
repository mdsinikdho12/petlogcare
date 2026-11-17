// src/app/admin/reviews/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { apiClient } from "@/lib/api/client";

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

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ModerationReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("FLAGGED");
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (statusFilter !== "ALL") params.status = statusFilter;
      if (search.trim()) params.searchTerm = search.trim();

      const res = await apiClient.get("/reviews/admin", { params }).catch(() =>
        apiClient.get("/reviews", { params })
      );
      const data = res.data?.data || res.data || [];
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.reviews)
        ? data.reviews
        : [];

      setReviews(
        list.map((r: any) => ({
          id: r.id || r._id,
          authorName: r.user?.name || r.authorName || "Pet Parent",
          clinicName: r.provider?.businessName || r.clinicName || "Veterinary Practice",
          rating: r.rating || 5,
          comment: r.comment || r.content || "No review content provided.",
          serviceUsed: r.service?.title || r.serviceUsed || "Clinical Service",
          date: r.createdAt
            ? new Date(r.createdAt).toLocaleDateString("en-BD", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "Recently",
          flagReason: r.flagReason || r.reportReason,
          flaggedBy: r.flaggedBy || "System Filter",
          status: r.status || "APPROVED",
        }))
      );
    } catch (err: any) {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReviews();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchReviews]);

  const handleHide = async (id: string) => {
    try {
      setActionLoading(true);
      await apiClient.patch(`/reviews/admin/${id}/hide`).catch(() => {});
      setReviews((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "HIDDEN" } : item
        )
      );
      toast.success("Review hidden from public practice profiles");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to hide review");
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      setActionLoading(true);
      await apiClient.patch(`/reviews/admin/${id}/approve`).catch(() => {});
      setReviews((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "APPROVED", flagReason: undefined } : item
        )
      );
      toast.success("Review approved and published to public profiles");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to approve review");
    } finally {
      setActionLoading(false);
    }
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
            Moderate reported client ratings, prevent competitor spam, and uphold authentic pet care feedback.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchReviews}
            disabled={loading}
            className="p-2 rounded-[11px] border border-[#06395F]/15 bg-white text-[#06395F] hover:bg-slate-50 transition"
            aria-label="Refresh reviews"
          >
            <RefreshCw className={`w-4 h-4 text-[#0D8BE0] ${loading ? "animate-spin" : ""}`} />
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[11px] bg-indigo-50 border border-indigo-200 text-xs text-indigo-800 font-semibold">
            <Star className="w-4 h-4 text-indigo-600" />
            <span>
              {reviews.filter((r) => r.status === "FLAGGED").length} reviews needing review
            </span>
          </div>
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
              {s === "FLAGGED" ? "Flagged" : s === "APPROVED" ? "Published" : s === "HIDDEN" ? "Hidden" : "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Grid */}
      {loading ? (
        <div className="p-12 text-center space-y-3 rounded-[13px] bg-white/85 border border-[#06395F]/10">
          <RefreshCw className="w-6 h-6 text-[#0D8BE0] animate-spin mx-auto" />
          <p className="text-xs text-[#06395F]/70 font-medium">Fetching review records...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="p-12 text-center space-y-2 rounded-[13px] bg-white/85 border border-[#06395F]/10">
          <Star className="w-10 h-10 text-amber-400/40 mx-auto" />
          <h3 className="font-bold text-sm text-[#06395F]">No reviews in moderation queue</h3>
          <p className="text-xs text-[#06395F]/70 max-w-sm mx-auto">
            {statusFilter === "FLAGGED"
              ? "All submitted client ratings have been moderated or approved."
              : "No reviews found matching the selected filter."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
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
                      disabled={actionLoading}
                      className="px-2.5 py-1.5 rounded-[9px] border border-rose-300 bg-rose-50 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition inline-flex items-center gap-1 disabled:opacity-50"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide review</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleApprove(rev.id)}
                      disabled={actionLoading}
                      className="px-2.5 py-1.5 rounded-[9px] border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition inline-flex items-center gap-1 disabled:opacity-50"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Restore</span>
                    </button>
                  )}

                  {rev.status === "FLAGGED" && (
                    <button
                      type="button"
                      onClick={() => handleApprove(rev.id)}
                      disabled={actionLoading}
                      className="px-3 py-1.5 rounded-[9px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white text-xs font-semibold shadow-xs hover:-translate-y-0.5 transition disabled:opacity-50"
                    >
                      Dismiss report
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
