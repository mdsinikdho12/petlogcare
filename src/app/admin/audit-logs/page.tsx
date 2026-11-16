// src/app/admin/audit-logs/page.tsx
"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import StatusBadge from "@/components/dashboard/StatusBadge";

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

const mockAuditLogs: AuditLogEntry[] = [
  {
    id: "aud-9012",
    timestamp: "16 Nov 2026, 06:14 PM",
    actorEmail: "admin@petcarelog.com",
    action: "SUSPEND_USER_ACCOUNT",
    method: "PATCH",
    resource: "USER",
    targetId: "usr-5 (Nusrat Jahan)",
    status: "SUCCESS",
    ipAddress: "103.205.71.18",
    payload: {
      reason: "Terms violation - fraudulent appointment spam",
      revokedTokensCount: 3,
      password: "[redacted]",
      token: "[redacted]",
    },
  },
  {
    id: "aud-9011",
    timestamp: "16 Nov 2026, 05:40 PM",
    actorEmail: "admin@petcarelog.com",
    action: "APPROVE_PRACTICE_VERIFICATION",
    method: "PATCH",
    resource: "PROVIDER",
    targetId: "pv-3 (CareVet Hospital)",
    status: "SUCCESS",
    ipAddress: "103.205.71.18",
    payload: {
      licenseNumber: "TR-DHAKA-2024-1102",
      leadDoctor: "Dr. Samira Khan",
      directoryListed: true,
    },
  },
  {
    id: "aud-9010",
    timestamp: "16 Nov 2026, 03:22 PM",
    actorEmail: "ops@petcarelog.com",
    action: "RESOLVE_BOOKING_DISPUTE",
    method: "PATCH",
    resource: "BOOKING",
    targetId: "bk-861 (Coco Dental)",
    status: "SUCCESS",
    ipAddress: "103.205.71.22",
    payload: {
      resolution: "REFUND_TO_OWNER",
      refundAmountBDT: 250,
      mfsGateway: "bKash",
    },
  },
  {
    id: "aud-9009",
    timestamp: "15 Nov 2026, 11:15 AM",
    actorEmail: "ops@petcarelog.com",
    action: "DISBURSE_BATCH_PAYOUT",
    method: "POST",
    resource: "WALLET",
    targetId: "po-698 (Uttara Pet)",
    status: "SUCCESS",
    ipAddress: "103.205.71.22",
    payload: {
      amountBDT: 12400,
      method: "NAGAD",
      transactionRef: "TXN-NGD-99882103",
    },
  },
  {
    id: "aud-9008",
    timestamp: "15 Nov 2026, 09:30 AM",
    actorEmail: "admin@petcarelog.com",
    action: "ATTEMPT_ADMIN_LOGIN",
    method: "POST",
    resource: "AUTH",
    targetId: "AUTH_SESSION",
    status: "FAILURE",
    ipAddress: "182.160.114.9",
    payload: {
      error: "INVALID_2FA_TOTP_TOKEN",
      attemptCount: 1,
      password: "[redacted]",
    },
  },
];

export default function AdminAuditLogsPage() {
  const [logs] = useState<AuditLogEntry[]>(mockAuditLogs);
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState<string>("ALL");
  const [inspectingLog, setInspectingLog] = useState<AuditLogEntry | null>(null);

  const filtered = logs.filter((l) => {
    const matchesMethod = methodFilter === "ALL" || l.method === methodFilter;
    const matchesSearch =
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.actorEmail.toLowerCase().includes(search.toLowerCase()) ||
      l.targetId.toLowerCase().includes(search.toLowerCase()) ||
      l.id.toLowerCase().includes(search.toLowerCase());
    return matchesMethod && matchesSearch;
  });

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

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[11px] bg-slate-100 border border-slate-200 text-xs text-[#06395F] font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>SHA-256 Tamper-evident ledger</span>
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
              {filtered.map((log) => (
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
