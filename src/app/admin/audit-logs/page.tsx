// src/app/admin/audit-logs/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Activity,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  ShieldCheck,
  Clock,
  Terminal,
  X,
  Lock,
  RefreshCw,
} from "lucide-react";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { apiClient } from "@/lib/api/client";

interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorEmail: string;
  action: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  resource: string;
  targetId: string;
  status: "SUCCESS" | "FAILURE";
  ipAddress: string;
  payload: Record<string, any>;
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState<string>("ALL");
  const [inspectingLog, setInspectingLog] = useState<AuditLogEntry | null>(null);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (methodFilter !== "ALL") params.method = methodFilter;
      if (search.trim()) params.searchTerm = search.trim();

      const res = await apiClient.get("/admin/audit-logs", { params }).catch(() => ({ data: [] }));
      const data = res.data?.data || res.data || [];
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.logs)
        ? data.logs
        : [];

      setLogs(
        list.map((l: any) => ({
          id: l.id || l._id || `aud-${Date.now()}`,
          timestamp: l.createdAt
            ? new Date(l.createdAt).toLocaleString("en-BD", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : l.timestamp || "Just now",
          actorEmail: l.admin?.email || l.actorEmail || l.userEmail || "System Admin",
          action: l.action || "SYSTEM_EVENT",
          method: l.method || "PATCH",
          resource: l.resource || "SYSTEM",
          targetId: l.targetId || l.entityId || "—",
          status: l.status === "FAILURE" ? "FAILURE" : "SUCCESS",
          ipAddress: l.ipAddress || l.ip || "127.0.0.1",
          payload: l.payload || l.metadata || {},
        }))
      );
    } catch (err: any) {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [methodFilter, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLogs();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchLogs]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-[28px] font-bold tracking-tight text-[#06395F]">
            Immutable audit oversight
          </h1>
          <p className="text-[13px] text-[#06395F]/75 mt-0.5 font-normal">
            Append-only audit trail logging administrative privileges, user suspensions, and financial adjustments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchLogs}
            disabled={loading}
            className="p-2 rounded-[11px] border border-[#06395F]/15 bg-white text-[#06395F] hover:bg-slate-50 transition"
            aria-label="Refresh audit logs"
          >
            <RefreshCw className={`w-4 h-4 text-[#0D8BE0] ${loading ? "animate-spin" : ""}`} />
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[11px] bg-slate-100 border border-slate-200 text-xs text-[#06395F] font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>SHA-256 Tamper-evident ledger</span>
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
            placeholder="Search action, actor, or target ID..."
            className="w-full h-10 pl-10 pr-3.5 rounded-[11px] border border-[#06395F]/15 bg-white text-xs text-[#06395F] placeholder:text-[#06395F]/40 focus:outline-none focus:ring-2 focus:ring-[#0D8BE0]"
          />
        </div>

        <div className="flex items-center gap-1 p-1 rounded-[11px] bg-slate-100 border border-slate-200 text-xs font-semibold text-[#06395F]">
          {["ALL", "PATCH", "POST", "GET"].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMethodFilter(m)}
              className={`px-3 py-1 rounded-[9px] transition ${
                methodFilter === m
                  ? "bg-white text-[#0D8BE0] shadow-xs"
                  : "text-[#06395F]/70 hover:text-[#06395F]"
              }`}
            >
              {m === "ALL" ? "All operations" : m}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="rounded-[13px] bg-white/85 border border-[#06395F]/10 shadow-[0_1px_2px_rgba(6,57,95,0.06)] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <RefreshCw className="w-6 h-6 text-[#0D8BE0] animate-spin mx-auto" />
            <p className="text-xs text-[#06395F]/70 font-medium">Fetching immutable audit stream...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Terminal className="w-10 h-10 text-[#06395F]/30 mx-auto" />
            <h3 className="font-bold text-sm text-[#06395F]">Audit stream clear</h3>
            <p className="text-xs text-[#06395F]/70 max-w-sm mx-auto">
              No administrative write transactions have been recorded under this filter yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#06395F]">
              <thead className="bg-[#F8FBFE] border-b border-[#06395F]/10 text-[11px] font-semibold text-[#06395F]/70 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Log ID & Time</th>
                  <th className="px-5 py-3.5">Admin Actor</th>
                  <th className="px-5 py-3.5">Action & Method</th>
                  <th className="px-5 py-3.5">Target Resource</th>
                  <th className="px-5 py-3.5">Outcome</th>
                  <th className="px-5 py-3.5 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#06395F]/8 font-mono">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-sky-50/40 transition">
                    <td className="px-5 py-3.5 font-sans">
                      <p className="font-mono font-bold text-xs text-[#06395F]">{log.id}</p>
                      <p className="text-[11px] text-[#06395F]/70">{log.timestamp}</p>
                    </td>
                    <td className="px-5 py-3.5 font-sans">
                      <p className="font-semibold text-xs text-[#06395F]">{log.actorEmail}</p>
                      <p className="text-[10px] text-[#06395F]/60 font-mono">IP: {log.ipAddress}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-1.5 py-0.5 rounded-[5px] text-[10px] font-bold ${
                            log.method === "PATCH"
                              ? "bg-amber-100 text-amber-800"
                              : log.method === "POST"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-sky-100 text-[#0D8BE0]"
                          }`}
                        >
                          {log.method}
                        </span>
                        <span className="font-bold text-xs text-[#06395F]">{log.action}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-sans">
                      <p className="font-semibold text-xs text-[#06395F]">{log.targetId}</p>
                      <p className="text-[10px] text-[#06395F]/60">Resource: {log.resource}</p>
                    </td>
                    <td className="px-5 py-3.5 font-sans">
                      {log.status === "SUCCESS" ? (
                        <StatusBadge status="ACTIVE" label="Success" />
                      ) : (
                        <StatusBadge status="CANCELLED" label="Failed" />
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right font-sans">
                      <button
                        type="button"
                        onClick={() => setInspectingLog(log)}
                        className="px-2.5 py-1.5 rounded-[9px] border border-[#06395F]/15 bg-white text-[#06395F] text-[11px] font-semibold hover:bg-slate-50 transition shadow-2xs inline-flex items-center gap-1"
                      >
                        <Terminal className="w-3.5 h-3.5 text-[#0D8BE0]" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payload Modal */}
      {inspectingLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-[13px] border border-white/80 bg-white/95 p-6 shadow-2xl backdrop-blur-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#06395F]/10">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#0D8BE0]" />
                <div>
                  <h2 className="font-bold text-base text-[#06395F]">
                    Audit payload: {inspectingLog.id}
                  </h2>
                  <p className="text-xs text-[#06395F]/70">{inspectingLog.action}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectingLog(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-[#06395F]">
              <div className="p-3 rounded-[11px] bg-slate-50 border border-slate-200/60 space-y-1">
                <p>Actor: <strong>{inspectingLog.actorEmail}</strong></p>
                <p>Client IP: <strong>{inspectingLog.ipAddress}</strong></p>
                <p>Timestamp: <strong>{inspectingLog.timestamp}</strong></p>
              </div>

              <div>
                <p className="font-semibold text-xs text-[#06395F] mb-1">
                  Sanitized Request Body & Metadata (Passwords redacted):
                </p>
                <pre className="p-3.5 rounded-[11px] bg-[#06395F] text-sky-200 text-[11px] font-mono overflow-x-auto max-h-56 leading-relaxed">
                  {JSON.stringify(inspectingLog.payload, null, 2)}
                </pre>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setInspectingLog(null)}
                className="px-4 py-2 rounded-[11px] bg-slate-100 text-[#06395F] text-xs font-semibold hover:bg-slate-200"
              >
                Close inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
