// src/app/admin/providers/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  FileText,
  Building2,
  MapPin,
  ExternalLink,
  Phone,
  Clock,
  Sparkles,
  AlertTriangle,
  X,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { apiClient } from "@/lib/api/client";

interface ProviderVerification {
  id: string;
  clinicName: string;
  leadDoctor: string;
  licenseNumber: string;
  degreeCredentials: string;
  district: string;
  address: string;
  phone: string;
  submittedAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  documents: { title: string; type: string; size: string; url?: string }[];
  notes?: string;
}

export default function AdminProvidersPage() {
  const [verifications, setVerifications] = useState<ProviderVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("PENDING");
  const [search, setSearch] = useState("");

  // Inspect Modal
  const [inspecting, setInspecting] = useState<ProviderVerification | null>(null);

  // Reject Modal
  const [rejecting, setRejecting] = useState<ProviderVerification | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProviders = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (statusFilter !== "ALL") params.status = statusFilter;
      if (search.trim()) params.searchTerm = search.trim();

      const res = await apiClient.get("/providers/admin", { params });
      const data = res.data?.data || res.data || [];
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.providers)
        ? data.providers
        : [];

      setVerifications(
        list.map((pv: any) => ({
          id: pv.id || pv._id,
          clinicName: pv.businessName || pv.clinicName || "Practice Application",
          leadDoctor: pv.doctorName || pv.leadDoctor || pv.user?.name || "Licensed Practitioner",
          licenseNumber: pv.tradeLicense || pv.licenseNumber || "—",
          degreeCredentials: pv.degree || pv.qualifications || "DVM Certified",
          district: pv.district || pv.city || "Dhaka",
          address: pv.address || "—",
          phone: pv.phone || pv.user?.phone || "—",
          submittedAt: pv.createdAt
            ? new Date(pv.createdAt).toLocaleDateString("en-BD", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "Recently",
          status: pv.status || "PENDING",
          documents: Array.isArray(pv.documents)
            ? pv.documents.map((d: any) => ({
                title: d.name || d.title || "Credential Document",
                type: d.type || "PDF Document",
                size: d.size || "1.2 MB",
                url: d.url,
              }))
            : [],
          notes: pv.rejectionReason || pv.notes,
        }))
      );
    } catch (err: any) {
      setVerifications([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProviders();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchProviders]);

  const handleApprove = async (pv: ProviderVerification) => {
    try {
      setActionLoading(true);
      await apiClient.patch(`/providers/admin/${pv.id}/verification`, {
        status: "APPROVED",
      });
      setVerifications((prev) =>
        prev.map((item) =>
          item.id === pv.id ? { ...item, status: "APPROVED" } : item
        )
      );
      toast.success(`${pv.clinicName} has been approved as a Verified Practice!`);
      if (inspecting?.id === pv.id) setInspecting(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to approve provider");
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenReject = (pv: ProviderVerification) => {
    setRejecting(pv);
    setRejectReason("");
  };

  const confirmReject = async () => {
    if (!rejecting) return;
    if (!rejectReason.trim()) {
      toast.error("Please state the inadequate documentation or rejection reason");
      return;
    }
    try {
      setActionLoading(true);
      await apiClient.patch(`/providers/admin/${rejecting.id}/verification`, {
        status: "REJECTED",
        reason: rejectReason.trim(),
      });
      setVerifications((prev) =>
        prev.map((item) =>
          item.id === rejecting.id
            ? { ...item, status: "REJECTED", notes: rejectReason }
            : item
        )
      );
      toast.success(`Verification for ${rejecting.clinicName} has been rejected`);
      setRejecting(null);
      if (inspecting?.id === rejecting.id) setInspecting(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to reject provider");
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
            Practice verification queue
          </h1>
          <p className="text-[13px] text-[#06395F]/75 mt-0.5 font-normal">
            Verify veterinary degrees, government trade licenses, and clinic premises in Bangladesh.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchProviders}
            disabled={loading}
            className="p-2 rounded-[11px] border border-[#06395F]/15 bg-white text-[#06395F] hover:bg-slate-50 transition"
            aria-label="Refresh providers list"
          >
            <RefreshCw className={`w-4 h-4 text-[#0D8BE0] ${loading ? "animate-spin" : ""}`} />
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[11px] bg-amber-50 border border-amber-200 text-xs text-amber-800 font-semibold">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>
              {verifications.filter((v) => v.status === "PENDING").length} pending reviews
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
            placeholder="Search clinic or doctor..."
            className="w-full h-10 pl-10 pr-3.5 rounded-[11px] border border-[#06395F]/15 bg-white text-xs text-[#06395F] placeholder:text-[#06395F]/40 focus:outline-none focus:ring-2 focus:ring-[#0D8BE0]"
          />
        </div>

        <div className="flex items-center gap-1 p-1 rounded-[11px] bg-slate-100 border border-slate-200 text-xs font-semibold text-[#06395F]">
          {["PENDING", "APPROVED", "REJECTED", "ALL"].map((s) => (
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
              {s === "PENDING"
                ? "Pending reviews"
                : s === "APPROVED"
                ? "Verified practices"
                : s === "REJECTED"
                ? "Rejected"
                : "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Cards Grid */}
      {loading ? (
        <div className="p-12 text-center space-y-3 rounded-[13px] bg-white/85 border border-[#06395F]/10">
          <RefreshCw className="w-6 h-6 text-[#0D8BE0] animate-spin mx-auto" />
          <p className="text-xs text-[#06395F]/70 font-medium">Loading verification dossiers...</p>
        </div>
      ) : verifications.length === 0 ? (
        <div className="p-12 text-center space-y-2 rounded-[13px] bg-white/85 border border-[#06395F]/10">
          <ShieldCheck className="w-10 h-10 text-emerald-500/40 mx-auto" />
          <h3 className="font-bold text-sm text-[#06395F]">No applications in this view</h3>
          <p className="text-xs text-[#06395F]/70 max-w-sm mx-auto">
            {statusFilter === "PENDING"
              ? "All practice verification requests have been audited and processed."
              : "No provider profiles found for this filter."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {verifications.map((pv) => (
            <div
              key={pv.id}
              className="rounded-[13px] bg-white/85 border border-[#06395F]/10 p-5 shadow-[0_1px_2px_rgba(6,57,95,0.06)] space-y-4 hover:border-[#0D8BE0]/30 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-[11px] bg-sky-500/15 border border-sky-300/40 flex items-center justify-center text-[#0D8BE0] shrink-0 mt-0.5">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#06395F]">
                      {pv.clinicName}
                    </h3>
                    <p className="text-xs text-[#06395F]/80 font-medium">
                      {pv.leadDoctor}
                    </p>
                    <p className="text-[11px] text-[#06395F]/60">
                      License: <span className="font-mono">{pv.licenseNumber}</span>
                    </p>
                  </div>
                </div>

                <div>
                  {pv.status === "PENDING" ? (
                    <StatusBadge status="PENDING" label="Pending verification" />
                  ) : pv.status === "APPROVED" ? (
                    <StatusBadge status="APPROVED" label="Verified practice" />
                  ) : (
                    <StatusBadge status="CANCELLED" label="Rejected" />
                  )}
                </div>
              </div>

              {/* Address & Credentials */}
              <div className="p-3 rounded-[11px] bg-slate-50 border border-slate-200/60 space-y-1.5 text-xs text-[#06395F]">
                <div className="flex items-center gap-1.5 text-[11px] text-[#06395F]/80">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>{pv.district} • {pv.address}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#06395F]/80">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{pv.degreeCredentials}</span>
                </div>
              </div>

              {/* Uploaded Documents List */}
              {pv.documents.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold text-[#06395F]/70">
                    Uploaded credentials ({pv.documents.length} files)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {pv.documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-white border border-[#06395F]/15 text-[11px] text-[#06395F]"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#0D8BE0]" />
                        <span className="font-medium">{doc.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {pv.notes && (
                <p className="text-[11px] text-rose-700 bg-rose-50 p-2.5 rounded-[8px] border border-rose-200">
                  Reason: {pv.notes}
                </p>
              )}

              {/* Action Bar */}
              <div className="pt-2 border-t border-[#06395F]/10 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setInspecting(pv)}
                  className="px-3 py-1.5 rounded-[9px] border border-[#06395F]/15 bg-white text-[#06395F] text-xs font-semibold hover:bg-slate-50 transition shadow-2xs inline-flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5 text-[#0D8BE0]" />
                  <span>Inspect dossier</span>
                </button>

                {pv.status === "PENDING" && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenReject(pv)}
                      disabled={actionLoading}
                      className="px-3 py-1.5 rounded-[9px] border border-rose-300 bg-rose-50 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition shadow-2xs disabled:opacity-50"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApprove(pv)}
                      disabled={actionLoading}
                      className="px-3.5 py-1.5 rounded-[9px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white text-xs font-semibold shadow-xs hover:-translate-y-0.5 transition disabled:opacity-50"
                    >
                      Approve practice
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dossier Inspection Modal */}
      {inspecting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl rounded-[13px] border border-white/80 bg-white/95 p-6 shadow-2xl backdrop-blur-xl space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#06395F]/10">
              <div>
                <h2 className="font-bold text-lg text-[#06395F]">{inspecting.clinicName}</h2>
                <p className="text-xs text-[#06395F]/70">Submitted {inspecting.submittedAt}</p>
              </div>
              <button
                type="button"
                onClick={() => setInspecting(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#06395F]">
              <div className="p-3 rounded-[11px] bg-slate-50 border border-slate-200/60 space-y-1.5">
                <p>Lead Veterinarian: <strong>{inspecting.leadDoctor}</strong></p>
                <p>Degree & Credentials: <strong>{inspecting.degreeCredentials}</strong></p>
                <p>Trade License: <strong>{inspecting.licenseNumber}</strong></p>
                <p>Direct Phone: <strong>{inspecting.phone}</strong></p>
                <p>Clinic Address: <strong>{inspecting.address}, {inspecting.district}</strong></p>
              </div>

              <div>
                <h3 className="font-bold text-xs text-[#06395F] mb-2">
                  Uploaded Documents & Certifications
                </h3>
                {inspecting.documents.length > 0 ? (
                  <div className="space-y-2">
                    {inspecting.documents.map((doc, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-[11px] border border-[#06395F]/15 bg-white flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#0D8BE0]" />
                          <div>
                            <p className="font-semibold text-xs text-[#06395F]">{doc.title}</p>
                            <p className="text-[10px] text-[#06395F]/60">{doc.type} • {doc.size}</p>
                          </div>
                        </div>
                        {doc.url ? (
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-semibold text-[#0D8BE0] hover:underline inline-flex items-center gap-1"
                          >
                            <span>Open file</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-[10px] text-slate-400">Available on server</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#06395F]/60 italic p-3 bg-slate-50 rounded-[9px]">
                    No digital attachments uploaded with this initial application.
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#06395F]/10">
              <button
                type="button"
                onClick={() => setInspecting(null)}
                className="px-4 py-2 rounded-[11px] bg-slate-100 text-[#06395F] text-xs font-semibold hover:bg-slate-200 transition"
              >
                Close
              </button>

              {inspecting.status === "PENDING" && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenReject(inspecting)}
                    disabled={actionLoading}
                    className="px-4 py-2 rounded-[11px] border border-rose-300 bg-rose-50 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition disabled:opacity-50"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApprove(inspecting)}
                    disabled={actionLoading}
                    className="px-4 py-2 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white text-xs font-semibold shadow-xs hover:-translate-y-0.5 transition disabled:opacity-50"
                  >
                    Approve practice
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejecting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[13px] border border-white/80 bg-white/95 p-6 shadow-2xl backdrop-blur-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[11px] bg-rose-500/15 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#06395F]">
                  Reject practice verification
                </h3>
                <p className="text-xs text-[#06395F]/70">{rejecting.clinicName}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#06395F]">
                Reason for rejection (sent to clinic email)
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Unreadable trade license, BVCA registration expired, or surgical premises certification missing..."
                rows={3}
                className="w-full p-2.5 rounded-[11px] border border-[#06395F]/20 text-xs text-[#06395F] focus:outline-none focus:ring-2 focus:ring-[#0D8BE0]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejecting(null)}
                className="px-4 py-2 rounded-[11px] border border-[#06395F]/15 bg-white text-xs font-semibold text-[#06395F]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmReject}
                disabled={actionLoading}
                className="px-4 py-2 rounded-[11px] bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 disabled:opacity-50"
              >
                {actionLoading ? "Rejecting..." : "Confirm rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
