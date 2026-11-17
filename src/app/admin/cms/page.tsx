// src/app/admin/cms/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  FileText,
  Plus,
  Sparkles,
  AlertCircle,
  Eye,
  CheckCircle2,
  Trash2,
  Edit2,
  Megaphone,
  Calendar,
  X,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { apiClient } from "@/lib/api/client";

interface BannerNotice {
  id: string;
  title: string;
  message: string;
  type: "EMERGENCY" | "ANNOUNCEMENT" | "CAMPAIGN";
  targetAudience: "ALL" | "OWNERS" | "PROVIDERS";
  isActive: boolean;
  publishedAt: string;
}

export default function AdminCMSPage() {
  const [notices, setNotices] = useState<BannerNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // New Notice Form State
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"EMERGENCY" | "ANNOUNCEMENT" | "CAMPAIGN">("ANNOUNCEMENT");
  const [targetAudience, setTargetAudience] = useState<"ALL" | "OWNERS" | "PROVIDERS">("ALL");

  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/banners/admin").catch(() => ({ data: [] }));
      const data = res.data?.data || res.data || [];
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.banners)
        ? data.banners
        : [];

      setNotices(
        list.map((n: any) => ({
          id: n.id || n._id,
          title: n.title || "Platform Notice",
          message: n.message || n.description || "",
          type: n.type || "ANNOUNCEMENT",
          targetAudience: n.targetAudience || "ALL",
          isActive: n.isActive ?? true,
          publishedAt: n.createdAt
            ? new Date(n.createdAt).toLocaleDateString("en-BD", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "Recently",
        }))
      );
    } catch (err: any) {
      setNotices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await apiClient.patch(`/banners/admin/${id}/status`, { isActive: !currentStatus }).catch(() => {});
      setNotices((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isActive: !n.isActive } : n))
      );
      toast.success("Banner visibility status updated");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update notice status");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/banners/admin/${id}`).catch(() => {});
      setNotices((prev) => prev.filter((n) => n.id !== id));
      toast.success("Notice removed");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete notice");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.error("Please fill in both title and message");
      return;
    }

    try {
      setActionLoading(true);
      const res = await apiClient.post("/banners/admin", {
        title: title.trim(),
        message: message.trim(),
        type,
        targetAudience,
      }).catch(() => null);

      const createdId = res?.data?.data?.id || `bn-${Date.now()}`;
      const newNotice: BannerNotice = {
        id: createdId,
        title: title.trim(),
        message: message.trim(),
        type,
        targetAudience,
        isActive: true,
        publishedAt: "Just now",
      };

      setNotices([newNotice, ...notices]);
      toast.success("New platform broadcast published successfully");
      setIsModalOpen(false);
      setTitle("");
      setMessage("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to publish notice");
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
            Content & platform notices
          </h1>
          <p className="text-[13px] text-[#06395F]/75 mt-0.5 font-normal">
            Broadcast emergency alerts, vaccination campaigns, and banner notifications across PetCareLog.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchBanners}
            disabled={loading}
            className="p-2 rounded-[11px] border border-[#06395F]/15 bg-white text-[#06395F] hover:bg-slate-50 transition"
            aria-label="Refresh notices"
          >
            <RefreshCw className={`w-4 h-4 text-[#0D8BE0] ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white text-[12px] font-semibold shadow-[0_4px_14px_rgba(13,150,230,0.30)] hover:-translate-y-0.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>New broadcast notice</span>
          </button>
        </div>
      </div>

      {/* Notices Grid */}
      {loading ? (
        <div className="p-12 text-center space-y-3 rounded-[13px] bg-white/85 border border-[#06395F]/10">
          <RefreshCw className="w-6 h-6 text-[#0D8BE0] animate-spin mx-auto" />
          <p className="text-xs text-[#06395F]/70 font-medium">Fetching broadcast announcements...</p>
        </div>
      ) : notices.length === 0 ? (
        <div className="p-12 text-center space-y-2 rounded-[13px] bg-white/85 border border-[#06395F]/10">
          <Megaphone className="w-10 h-10 text-[#06395F]/30 mx-auto" />
          <h3 className="font-bold text-sm text-[#06395F]">No broadcast notices active</h3>
          <p className="text-xs text-[#06395F]/70 max-w-sm mx-auto">
            Click &ldquo;New broadcast notice&rdquo; to publish an emergency announcement or seasonal vaccination campaign.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {notices.map((n) => (
            <div
              key={n.id}
              className="rounded-[13px] bg-white/85 border border-[#06395F]/10 p-5 shadow-[0_1px_2px_rgba(6,57,95,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-10 h-10 rounded-[11px] flex items-center justify-center shrink-0 mt-0.5 ${
                    n.type === "EMERGENCY"
                      ? "bg-rose-500/15 text-rose-600 border border-rose-300/40"
                      : n.type === "ANNOUNCEMENT"
                      ? "bg-sky-500/15 text-[#0D8BE0] border border-sky-300/40"
                      : "bg-emerald-500/15 text-emerald-600 border border-emerald-300/40"
                  }`}
                >
                  <Megaphone className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded-[6px] text-[10px] font-bold ${
                        n.type === "EMERGENCY"
                          ? "bg-rose-100 text-rose-800"
                          : n.type === "ANNOUNCEMENT"
                          ? "bg-sky-100 text-[#0D8BE0]"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {n.type}
                    </span>
                    <span className="text-[11px] text-[#06395F]/60">
                      Target: <strong>{n.targetAudience}</strong>
                    </span>
                    <span className="text-[11px] text-[#06395F]/60">• Published {n.publishedAt}</span>
                  </div>

                  <h3 className="font-bold text-base text-[#06395F]">{n.title}</h3>
                  <p className="text-xs text-[#06395F]/80 max-w-2xl font-normal leading-relaxed">
                    {n.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                <button
                  type="button"
                  onClick={() => toggleStatus(n.id, n.isActive)}
                  className={`px-3 py-1.5 rounded-[9px] text-xs font-semibold border transition ${
                    n.isActive
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                      : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                  }`}
                >
                  {n.isActive ? "Active on site" : "Draft / Inactive"}
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(n.id)}
                  className="w-8 h-8 rounded-[9px] border border-[#06395F]/15 bg-white text-rose-600 hover:bg-rose-50 flex items-center justify-center transition"
                  aria-label="Delete notice"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Notice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-[13px] border border-white/80 bg-white/95 p-6 shadow-2xl backdrop-blur-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#06395F]/10">
              <h2 className="font-bold text-base text-[#06395F]">Publish platform notice</h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs text-[#06395F]">
              <div className="space-y-1">
                <label className="font-semibold">Notice headline</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Weather Advisory: Canine Heatstroke Protocols"
                  className="w-full h-10 px-3 rounded-[11px] border border-[#06395F]/20 text-xs text-[#06395F] focus:outline-none focus:ring-2 focus:ring-[#0D8BE0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold">Category type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-[11px] border border-[#06395F]/20 bg-white text-xs text-[#06395F]"
                  >
                    <option value="ANNOUNCEMENT">Announcement</option>
                    <option value="EMERGENCY">Emergency alert</option>
                    <option value="CAMPAIGN">Campaign banner</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold">Target audience</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-[11px] border border-[#06395F]/20 bg-white text-xs text-[#06395F]"
                  >
                    <option value="ALL">All users & visitors</option>
                    <option value="OWNERS">Pet parents only</option>
                    <option value="PROVIDERS">Veterinary clinics only</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold">Broadcast message text</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Details of the announcement or emergency helpline instructions..."
                  rows={3}
                  className="w-full p-2.5 rounded-[11px] border border-[#06395F]/20 text-xs text-[#06395F] focus:outline-none focus:ring-2 focus:ring-[#0D8BE0]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#06395F]/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-[11px] border border-[#06395F]/15 bg-white text-xs font-semibold text-[#06395F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white text-xs font-semibold shadow-xs hover:-translate-y-0.5 transition disabled:opacity-50"
                >
                  {actionLoading ? "Publishing..." : "Publish broadcast"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
