// src/app/admin/users/page.tsx
"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  Filter,
  ShieldAlert,
  ShieldCheck,
  UserX,
  UserCheck,
  Eye,
  Calendar,
  Phone,
  Mail,
  X,
  AlertTriangle,
  Dog,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "@/components/dashboard/StatusBadge";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "USER" | "PROVIDER" | "ADMIN";
  status: "ACTIVE" | "INACTIVE";
  joinedDate: string;
  petsCount?: number;
  bookingsCount?: number;
  clinicName?: string;
}

const mockUsers: UserRecord[] = [
  {
    id: "usr-1",
    name: "MD Ferdous Ahmed",
    email: "mdferdous@gmail.com",
    phone: "+880 1711-234567",
    role: "USER",
    status: "ACTIVE",
    joinedDate: "12 Oct 2026",
    petsCount: 2,
    bookingsCount: 5,
  },
  {
    id: "usr-2",
    name: "Dr. Samira Khan",
    email: "samira@carevet.bd",
    phone: "+880 1812-987654",
    role: "PROVIDER",
    status: "ACTIVE",
    joinedDate: "28 Sep 2026",
    clinicName: "CareVet Animal Hospital & Surgery",
    bookingsCount: 142,
  },
  {
    id: "usr-3",
    name: "Tanzir Hossain",
    email: "tanzir.h@yahoo.com",
    phone: "+880 1914-554433",
    role: "USER",
    status: "ACTIVE",
    joinedDate: "04 Nov 2026",
    petsCount: 1,
    bookingsCount: 2,
  },
  {
    id: "usr-4",
    name: "Farhan Chowdhury",
    email: "farhan@pawsandclaws.com",
    phone: "+880 1622-778899",
    role: "PROVIDER",
    status: "ACTIVE",
    joinedDate: "15 Aug 2026",
    clinicName: "Paws & Claws Veterinary Care",
    bookingsCount: 98,
  },
  {
    id: "usr-5",
    name: "Nusrat Jahan",
    email: "nusrat.catmom@gmail.com",
    phone: "+880 1733-112233",
    role: "USER",
    status: "INACTIVE",
    joinedDate: "19 Sep 2026",
    petsCount: 3,
    bookingsCount: 0,
  },
  {
    id: "usr-6",
    name: "SuperAdmin Console",
    email: "admin@petcarelog.com",
    phone: "+880 1700-000000",
    role: "ADMIN",
    status: "ACTIVE",
    joinedDate: "01 Jul 2026",
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>(mockUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Inspection modal state
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);

  // Suspend modal state
  const [suspendingUser, setSuspendingUser] = useState<UserRecord | null>(null);
  const [suspendReason, setSuspendReason] = useState("");

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search);
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesStatus = statusFilter === "ALL" || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleToggleStatus = (u: UserRecord) => {
    if (u.status === "ACTIVE") {
      setSuspendingUser(u);
      setSuspendReason("");
    } else {
      // Reactivate immediately
      setUsers((prev) =>
        prev.map((item) =>
          item.id === u.id ? { ...item, status: "ACTIVE" } : item
        )
      );
      toast.success(`Account for ${u.name} has been reactivated`);
    }
  };

  const confirmSuspend = () => {
    if (!suspendingUser) return;
    if (!suspendReason.trim()) {
      toast.error("Please provide an administrative reason for suspension");
      return;
    }
    setUsers((prev) =>
      prev.map((item) =>
        item.id === suspendingUser.id ? { ...item, status: "INACTIVE" } : item
      )
    );
    toast.success(`Account for ${suspendingUser.name} suspended`);
    setSuspendingUser(null);
    setSuspendReason("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-[28px] font-bold tracking-tight text-[#06395F]">
            User & account directory
          </h1>
          <p className="text-[13px] text-[#06395F]/75 mt-0.5 font-normal">
            Manage authenticated pet owners, veterinary providers, and platform privileges.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[11px] bg-white/80 border border-[#06395F]/10 text-xs text-[#06395F] font-semibold">
          <Users className="w-4 h-4 text-[#0D8BE0]" />
          <span>{filteredUsers.length} accounts found</span>
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
            placeholder="Search by name, email, or phone..."
            className="w-full h-10 pl-10 pr-3.5 rounded-[11px] border border-[#06395F]/15 bg-white text-xs text-[#06395F] placeholder:text-[#06395F]/40 focus:outline-none focus:ring-2 focus:ring-[#0D8BE0]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Role Filter */}
          <div className="flex items-center gap-1 p-1 rounded-[11px] bg-slate-100 border border-slate-200 text-xs font-semibold text-[#06395F]">
            {["ALL", "USER", "PROVIDER", "ADMIN"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRoleFilter(r)}
                className={`px-2.5 py-1 rounded-[9px] transition ${
                  roleFilter === r
                    ? "bg-white text-[#0D8BE0] shadow-xs"
                    : "text-[#06395F]/70 hover:text-[#06395F]"
                }`}
              >
                {r === "ALL" ? "All roles" : r === "USER" ? "Owners" : r === "PROVIDER" ? "Providers" : "Admins"}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 p-1 rounded-[11px] bg-slate-100 border border-slate-200 text-xs font-semibold text-[#06395F]">
            {["ALL", "ACTIVE", "INACTIVE"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded-[9px] transition ${
                  statusFilter === s
                    ? "bg-white text-[#0D8BE0] shadow-xs"
                    : "text-[#06395F]/70 hover:text-[#06395F]"
                }`}
              >
                {s === "ALL" ? "All status" : s === "ACTIVE" ? "Active" : "Suspended"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table (Desktop) / Cards (Mobile) */}
      <div className="rounded-[13px] bg-white/85 border border-[#06395F]/10 shadow-[0_1px_2px_rgba(6,57,95,0.06)] overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs text-[#06395F]">
            <thead className="bg-[#F8FBFE] border-b border-[#06395F]/10 text-[11px] font-semibold text-[#06395F]/70 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">User profile</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Phone</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Joined date</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#06395F]/8">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-sky-50/40 transition">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2FB0FF] to-[#0D8BE0] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-[13px] text-[#06395F]">
                          {u.name}
                        </p>
                        <p className="text-[11px] text-[#06395F]/70 font-normal">
                          {u.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-[8px] text-[11px] font-semibold ${
                        u.role === "ADMIN"
                          ? "bg-purple-100 text-purple-800 border border-purple-200"
                          : u.role === "PROVIDER"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : "bg-sky-100 text-sky-800 border border-sky-200"
                      }`}
                    >
                      {u.role === "ADMIN" ? "Super Admin" : u.role === "PROVIDER" ? "Veterinary Provider" : "Pet Parent"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-medium">{u.phone}</td>
                  <td className="px-5 py-3.5">
                    {u.status === "ACTIVE" ? (
                      <StatusBadge status="ACTIVE" />
                    ) : (
                      <StatusBadge status="INACTIVE" label="Suspended" />
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-[#06395F]/75">{u.joinedDate}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedUser(u)}
                        className="px-2.5 py-1.5 rounded-[9px] border border-[#06395F]/15 bg-white text-[#06395F] text-[11px] font-semibold hover:bg-slate-50 transition shadow-2xs inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#0D8BE0]" />
                        <span>Inspect</span>
                      </button>

                      {u.role !== "ADMIN" && (
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(u)}
                          className={`px-2.5 py-1.5 rounded-[9px] border text-[11px] font-semibold transition shadow-2xs inline-flex items-center gap-1 ${
                            u.status === "ACTIVE"
                              ? "border-rose-300 bg-rose-50/80 text-rose-700 hover:bg-rose-100"
                              : "border-emerald-300 bg-emerald-50/80 text-emerald-700 hover:bg-emerald-100"
                          }`}
                        >
                          {u.status === "ACTIVE" ? (
                            <>
                              <UserX className="w-3.5 h-3.5" />
                              <span>Suspend</span>
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Reactivate</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Cards */}
        <div className="block md:hidden divide-y divide-[#06395F]/10">
          {filteredUsers.map((u) => (
            <div key={u.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2FB0FF] to-[#0D8BE0] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-[#06395F]">{u.name}</h3>
                    <p className="text-[11px] text-[#06395F]/70">{u.email}</p>
                  </div>
                </div>
                {u.status === "ACTIVE" ? (
                  <StatusBadge status="ACTIVE" />
                ) : (
                  <StatusBadge status="INACTIVE" label="Suspended" />
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-[#06395F]/80">
                <span>Role: <strong>{u.role}</strong></span>
                <span>{u.phone}</span>
              </div>

              <div className="pt-2 flex items-center gap-2 border-t border-[#06395F]/10">
                <button
                  type="button"
                  onClick={() => setSelectedUser(u)}
                  className="flex-1 py-1.5 rounded-[9px] border border-[#06395F]/15 bg-white text-xs font-semibold text-[#06395F]"
                >
                  Inspect details
                </button>
                {u.role !== "ADMIN" && (
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(u)}
                    className="flex-1 py-1.5 rounded-[9px] border border-rose-300 bg-rose-50 text-xs font-semibold text-rose-700"
                  >
                    {u.status === "ACTIVE" ? "Suspend" : "Reactivate"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Inspection Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-[13px] border border-white/80 bg-white/95 p-6 shadow-2xl backdrop-blur-xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#06395F]/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2FB0FF] to-[#0D8BE0] text-white flex items-center justify-center font-bold text-sm">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h2 className="font-bold text-base text-[#06395F]">{selectedUser.name}</h2>
                  <p className="text-xs text-[#06395F]/70">{selectedUser.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#06395F]">
              <div className="p-3 rounded-[11px] bg-slate-50 border border-slate-200/60 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#06395F]/70">Email Address</span>
                  <span className="font-semibold">{selectedUser.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#06395F]/70">Phone Number</span>
                  <span className="font-semibold">{selectedUser.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#06395F]/70">Registration Date</span>
                  <span className="font-semibold">{selectedUser.joinedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#06395F]/70">Account Privilege</span>
                  <span className="font-semibold text-[#0D8BE0]">{selectedUser.role}</span>
                </div>
              </div>

              {selectedUser.role === "USER" && (
                <div className="p-3 rounded-[11px] bg-sky-50/60 border border-sky-100 space-y-1.5">
                  <p className="font-bold text-[13px] text-[#06395F] flex items-center gap-1.5">
                    <Dog className="w-4 h-4 text-[#0D8BE0]" />
                    <span>Pet Parent Activity</span>
                  </p>
                  <p>Registered companion pets: <strong>{selectedUser.petsCount || 0}</strong></p>
                  <p>Total clinic appointments booked: <strong>{selectedUser.bookingsCount || 0}</strong></p>
                </div>
              )}

              {selectedUser.role === "PROVIDER" && (
                <div className="p-3 rounded-[11px] bg-emerald-50/60 border border-emerald-100 space-y-1.5">
                  <p className="font-bold text-[13px] text-[#06395F] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Practice Profile</span>
                  </p>
                  <p>Clinic name: <strong>{selectedUser.clinicName}</strong></p>
                  <p>Completed appointments: <strong>{selectedUser.bookingsCount || 0}</strong></p>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 rounded-[11px] bg-slate-100 text-[#06395F] text-xs font-semibold hover:bg-slate-200 transition"
              >
                Close inspection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Confirmation Modal */}
      {suspendingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[13px] border border-white/80 bg-white/95 p-6 shadow-2xl backdrop-blur-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[11px] bg-rose-500/15 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#06395F]">
                  Suspend user account
                </h3>
                <p className="text-xs text-[#06395F]/70">
                  {suspendingUser.name} ({suspendingUser.email})
                </p>
              </div>
            </div>

            <p className="text-xs text-[#06395F]/80 leading-relaxed font-normal">
              Suspending this account immediately revokes all active login refresh tokens, terminates WebSocket chat sessions, and flags the account as inactive.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#06395F]">
                Administrative reason (required for audit log)
              </label>
              <textarea
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                placeholder="e.g. Terms violation, fraudulent appointment booking, spam..."
                rows={3}
                className="w-full p-2.5 rounded-[11px] border border-[#06395F]/20 text-xs text-[#06395F] focus:outline-none focus:ring-2 focus:ring-[#0D8BE0]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSuspendingUser(null)}
                className="px-4 py-2 rounded-[11px] border border-[#06395F]/15 bg-white text-xs font-semibold text-[#06395F] hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmSuspend}
                className="px-4 py-2 rounded-[11px] bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 shadow-sm transition"
              >
                Confirm suspension
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
