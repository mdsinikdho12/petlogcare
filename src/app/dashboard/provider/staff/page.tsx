"use client";

import { useState } from "react";
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
} from "lucide-react";
import type { ProviderStaff } from "@/types";

export default function ProviderStaffPage() {
  const [staffList, setStaffList] = useState<ProviderStaff[]>([
    {
      id: "staff-1",
      name: "Dr. Nazmul Hasan",
      roleTitle: "Consultant Veterinary Surgeon",
      phone: "+8801712345678",
      isActive: true,
    },
    {
      id: "staff-2",
      name: "Sabrina Akter",
      roleTitle: "Lead Pet Groomer",
      phone: "+8801812345678",
      isActive: true,
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [roleTitle, setRoleTitle] = useState("Junior Veterinarian");
  const [phone, setPhone] = useState("");

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      toast.error("Please enter staff name and phone number");
      return;
    }

    const newStaff: ProviderStaff = {
      id: Math.random().toString(),
      name,
      roleTitle,
      phone,
      isActive: true,
    };

    setStaffList((prev) => [newStaff, ...prev]);
    toast.success("Staff member added successfully!");
    setName("");
    setPhone("");
    setModalOpen(false);
  };

  const toggleActive = (id: string) => {
    setStaffList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
    toast.info("Staff status updated");
  };

  const removeStaff = (id: string) => {
    setStaffList((prev) => prev.filter((s) => s.id !== id));
    toast.info("Staff member removed");
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#06395F]">
            Staff & Team Management
          </h1>
          <p className="text-xs sm:text-sm text-[#0B4C7A]/75 mt-0.5 font-light">
            Assign vets, technicians, and pet care assistants to manage incoming patient bookings.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#2FB0FF] to-[#0D8BE0] hover:from-[#259DE6] hover:to-[#0A77C2] text-white text-xs font-semibold shadow-md shadow-[#0D8BE0]/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Staff Table Glass Panel */}
      <div className="rounded-[2.5rem] border border-white/70 bg-white/55 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_10px_40px_rgba(1,95,160,0.1),inset_0_1px_0_rgba(255,255,255,0.9)] overflow-hidden">
        {staffList.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <Users className="w-10 h-10 mx-auto text-[#0D8BE0]/40" />
            <h3 className="text-sm font-bold text-[#06395F]">
              No staff members added yet
            </h3>
            <p className="text-xs text-[#0B4C7A]/70 max-w-xs mx-auto">
              Add your doctors, groomers, and assistants to let clients know who will take care of their pets.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#06395F]/10 text-[#0B4C7A]/70 uppercase tracking-wider font-semibold text-[10px]">
                  <th className="pb-3 pl-2">Staff Name</th>
                  <th className="pb-3">Role / Specialty</th>
                  <th className="pb-3">Phone</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 pr-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/60">
                {staffList.map((staff) => (
                  <tr key={staff.id} className="hover:bg-white/40 transition-colors">
                    <td className="py-3.5 pl-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-[#0D8BE0] text-white font-bold flex items-center justify-center text-xs shadow-xs">
                          {staff.name.charAt(0)}
                        </div>
                        <span className="font-bold text-[#06395F]">
                          {staff.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 text-[#06395F] font-medium">
                      {staff.roleTitle}
                    </td>
                    <td className="py-3.5 text-[#0B4C7A]/80">{staff.phone}</td>
                    <td className="py-3.5">
                      <button
                        type="button"
                        onClick={() => toggleActive(staff.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                          staff.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-gray-100 text-gray-500 border-gray-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            staff.isActive ? "bg-emerald-500" : "bg-gray-400"
                          }`}
                        />
                        <span>{staff.isActive ? "Active" : "Inactive"}</span>
                      </button>
                    </td>
                    <td className="py-3.5 pr-2 text-right">
                      <button
                        type="button"
                        onClick={() => removeStaff(staff.id)}
                        className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                        title="Remove Staff"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Staff Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-[2.5rem] border border-white/80 bg-white/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#06395F]/10">
              <h3 className="text-base font-bold text-[#06395F]">
                Add Staff Member
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-full text-[#06395F] hover:bg-black/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#06395F] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dr. Arman Hossain"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-200 bg-white text-xs text-[#06395F] outline-none focus:ring-2 focus:ring-[#0D8BE0]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#06395F] mb-1">
                  Role Title *
                </label>
                <select
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-200 bg-white text-xs text-[#06395F] outline-none focus:ring-2 focus:ring-[#0D8BE0]"
                >
                  <option value="Senior Veterinarian">Senior Veterinarian</option>
                  <option value="Junior Veterinarian">Junior Veterinarian</option>
                  <option value="Consultant Surgeon">Consultant Surgeon</option>
                  <option value="Senior Groomer">Senior Groomer</option>
                  <option value="Veterinary Assistant">Veterinary Assistant</option>
                  <option value="Frontdesk Receptionist">Frontdesk Receptionist</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#06395F] mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+8801712345678"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-200 bg-white text-xs text-[#06395F] outline-none focus:ring-2 focus:ring-[#0D8BE0]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#0D8BE0] hover:bg-[#0A77C2] text-white text-xs font-semibold shadow-xs"
                >
                  Save Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
