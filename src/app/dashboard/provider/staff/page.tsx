"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Users,
  Plus,
  Phone,
  Briefcase,
  User,
  CheckCircle2,
  XCircle,
  Trash2,
  ShieldCheck,
  X,
  RotateCw,
  Sparkles,
} from "lucide-react";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { apiClient } from "@/lib/api/client";

interface ProviderStaff {
  id: string;
  name: string;
  roleTitle: string;
  phone: string;
  isActive: boolean;
}

export default function ProviderStaffPage() {
  const [staffList, setStaffList] = useState<ProviderStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [roleTitle, setRoleTitle] = useState("Consultant Veterinarian");
  const [phone, setPhone] = useState("+880 1700-000000");

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/providers/me/staff");
      const list = res.data?.data || [];
      if (Array.isArray(list)) {
        const mapped: ProviderStaff[] = list.map((s: any) => ({
          id: s._id || s.id,
          name: s.name,
          roleTitle: s.roleTitle || s.role || "Attending Veterinarian",
          phone: s.phone || "",
          isActive: s.isActive ?? true,
        }));
        setStaffList(mapped);
      }
    } catch (err) {
      console.error("Failed to load staff list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Please enter staff member name and phone number");
      return;
    }

    try {
      setSaving(true);
      await apiClient.post("/providers/me/staff", {
        name: name.trim(),
        roleTitle: roleTitle.trim(),
        phone: phone.trim(),
      });
      toast.success("Staff member added to clinic!");
      setName("");
      setPhone("+880 1700-000000");
      setModalOpen(false);
      fetchStaff();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add staff member");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (s: ProviderStaff) => {
    try {
      await apiClient.patch(`/providers/me/staff/${s.id}`, {
        isActive: !s.isActive,
      });
      toast.info(`Staff status updated`);
      fetchStaff();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update staff status");
    }
  };

  const removeStaff = async (id: string, name: string) => {
    if (confirm(`Remove ${name} from clinic team?`)) {
      try {
        await apiClient.delete(`/providers/me/staff/${id}`);
        toast.info("Staff member removed");
        fetchStaff();
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to remove staff member");
      }
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Top Banner (Liquid Glass) */}
      <div className="rounded-[13px] border border-white/80 bg-white/55 p-6 sm:p-7 backdrop-blur-xl backdrop-saturate-150 shadow-[0_8px_30px_rgba(1,95,160,0.10),inset_0_1px_0_rgba(255,255,255,0.95)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-sky-500/15 text-[#0D8BE0] text-[12px] font-semibold mb-2.5 border border-white/80 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Clinic roster</span>
          </div>
          <h1 className="font-display text-2xl sm:text-[28px] font-bold tracking-tight text-[#06395F]">
            Staff &amp; Team Management
          </h1>
          <p className="text-[13px] sm:text-sm text-[#06395F]/80 mt-1 max-w-xl font-normal leading-relaxed">
            Assign licensed vets, technicians, and pet care assistants to manage incoming patient bookings.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchStaff}
            disabled={loading}
            className="p-2.5 rounded-[11px] bg-white border border-[#06395F]/15 text-[#06395F] hover:bg-slate-50 transition shadow-2xs"
            title="Refresh staff roster"
          >
            <RotateCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] px-4 py-2.5 text-[13px] font-semibold text-white shadow-[0_4px_14px_rgba(13,150,230,0.30)] hover:-translate-y-0.5 active:translate-y-0 transition shrink-0 whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add team member</span>
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && staffList.length === 0 && (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-[13px] bg-white/85 border border-[#06395F]/10 p-5 space-y-3 animate-pulse shadow-xs"
            >
              <div className="h-5 bg-slate-200 rounded w-1/4" />
              <div className="h-4 bg-slate-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && staffList.length === 0 && (
        <div className="rounded-[13px] bg-white/85 border border-[#06395F]/10 p-10 sm:p-14 text-center space-y-4 shadow-[0_1px_2px_rgba(6,57,95,0.06)]">
          <div className="w-14 h-14 mx-auto rounded-[13px] bg-sky-50 text-[#0D8BE0] flex items-center justify-center border border-sky-100 shadow-xs">
            <Users className="w-7 h-7" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="font-display text-lg font-bold text-[#06395F]">
              No team members registered yet
            </h3>
            <p className="text-[13px] text-[#06395F]/75 leading-relaxed font-normal">
              Add your attending veterinarians, vet assistants and grooming staff to assign appointments and delegate consultations.
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] px-5 py-2.5 text-[13px] font-semibold text-white shadow-xs hover:-translate-y-0.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add team member</span>
            </button>
          </div>
        </div>
      )}

      {/* Staff List Grid (Solid Surfaces) */}
      {!loading && staffList.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {staffList.map((s) => (
            <div
              key={s.id}
              className={`rounded-[13px] bg-white/85 border border-[#06395F]/10 p-5 shadow-[0_1px_2px_rgba(6,57,95,0.06)] flex items-start justify-between gap-4 transition hover:border-[#0D8BE0]/30 ${
                !s.isActive ? "opacity-60 bg-white/60" : ""
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-[11px] bg-sky-500/15 text-[#0D8BE0] flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                  {s.name[0]}
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-base font-bold text-[#06395F] truncate">
                      {s.name}
                    </h3>
                    <StatusBadge
                      status={s.isActive ? "ACTIVE" : "PENDING"}
                      label={s.isActive ? "Active" : "Inactive"}
                    />
                  </div>
                  <div className="text-[12px] font-semibold text-[#0D8BE0] truncate">
                    {s.roleTitle}
                  </div>
                  <div className="text-[12px] text-[#06395F]/75 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#06395F]/40" />
                    <span>{s.phone}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => toggleActive(s)}
                  className="px-2.5 py-1 rounded-[8px] border border-[#06395F]/15 hover:bg-slate-50 text-[11px] font-semibold text-[#06395F]"
                >
                  {s.isActive ? "Deactivate" : "Activate"}
                </button>
                <button
                  type="button"
                  onClick={() => removeStaff(s.id, s.name)}
                  className="p-1.5 rounded-[8px] text-[#06395F]/40 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Remove staff member"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Staff Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-[13px] border border-white/80 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#06395F]/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[8px] bg-sky-500/15 text-[#0D8BE0] flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="font-display text-base font-bold text-[#06395F]">
                  Add clinic staff member
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-[8px] hover:bg-slate-100 text-[#06395F]/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-3.5 text-[13px]">
              <div>
                <label className="block font-semibold text-[#06395F] mb-1">
                  Full name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Tanvir Ahmed (DVM)"
                  className="w-full px-3.5 py-2 rounded-[11px] border border-[#06395F]/15 focus:outline-none focus:border-[#0D8BE0] text-[#06395F]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#06395F] mb-1">
                  Role / Specialization *
                </label>
                <input
                  type="text"
                  required
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="e.g. Chief Veterinary Surgeon, Lead Groomer"
                  className="w-full px-3.5 py-2 rounded-[11px] border border-[#06395F]/15 focus:outline-none focus:border-[#0D8BE0] text-[#06395F]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#06395F] mb-1">
                  Phone number *
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 17XXXXXXXXX"
                  className="w-full px-3.5 py-2 rounded-[11px] border border-[#06395F]/15 focus:outline-none focus:border-[#0D8BE0] text-[#06395F]"
                />
              </div>

              <div className="pt-3 border-t border-[#06395F]/10 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-[11px] border border-[#06395F]/15 text-[#06395F] font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white font-semibold shadow-xs"
                >
                  {saving ? "Saving..." : "Add to roster"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
