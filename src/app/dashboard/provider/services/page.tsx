"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Stethoscope,
  Plus,
  Clock,
  Sparkles,
  Scissors,
  CheckCircle2,
  XCircle,
  Trash2,
  Edit2,
  X,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

interface ServiceType {
  id: string;
  title: string;
  category: string;
  durationMinutes: number;
  priceBDT: number;
  bufferMinutes: number;
  applicablePets: string[];
  isActive: boolean;
}

export default function ProviderServicesPage() {
  const [services, setServices] = useState<ServiceType[]>([
    {
      id: "srv-1",
      title: "Comprehensive Clinical Veterinary Consultation",
      category: "Veterinary Medicine",
      durationMinutes: 30,
      priceBDT: 800,
      bufferMinutes: 10,
      applicablePets: ["Cats", "Dogs"],
      isActive: true,
    },
    {
      id: "srv-2",
      title: "Core Rabies & Annual Vaccine Administration",
      category: "Vaccination",
      durationMinutes: 20,
      priceBDT: 1200,
      bufferMinutes: 10,
      applicablePets: ["Cats", "Dogs"],
      isActive: true,
    },
    {
      id: "srv-3",
      title: "Ultrasonic Pet Dental Scaling & Polishing",
      category: "Dental Care",
      durationMinutes: 45,
      priceBDT: 2500,
      bufferMinutes: 15,
      applicablePets: ["Cats", "Dogs"],
      isActive: true,
    },
    {
      id: "srv-4",
      title: "Medicated Pet Spa & Breed-Specific Styling",
      category: "Grooming",
      durationMinutes: 60,
      priceBDT: 1600,
      bufferMinutes: 15,
      applicablePets: ["Dogs"],
      isActive: true,
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceType | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Veterinary Medicine",
    durationMinutes: 30,
    priceBDT: 500,
    bufferMinutes: 10,
    applicablePets: ["Cats", "Dogs"],
    isActive: true,
  });

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData({
      title: "",
      category: "Veterinary Medicine",
      durationMinutes: 30,
      priceBDT: 500,
      bufferMinutes: 10,
      applicablePets: ["Cats", "Dogs"],
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (srv: ServiceType) => {
    setEditingService(srv);
    setFormData({
      title: srv.title,
      category: srv.category,
      durationMinutes: srv.durationMinutes,
      priceBDT: srv.priceBDT,
      bufferMinutes: srv.bufferMinutes,
      applicablePets: srv.applicablePets,
      isActive: srv.isActive,
    });
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error("Please enter a service title");
      return;
    }

    if (editingService) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === editingService.id ? { ...s, ...formData } : s
        )
      );
      toast.success("Service updated successfully!");
    } else {
      const newSrv: ServiceType = {
        id: `srv-${Date.now()}`,
        ...formData,
      };
      setServices((prev) => [newSrv, ...prev]);
      toast.success("New service offering added!");
    }

    setModalOpen(false);
  };

  const toggleStatus = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
    toast.info("Service active status toggled");
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Remove "${title}" from bookable offerings?`)) {
      setServices((prev) => prev.filter((s) => s.id !== id));
      toast.info("Service removed");
    }
  };

  return (
    <div className="max-w-5xl space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-sky-200 bg-sky-50 text-sky-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Practice Offerings Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#06395F]">
            Service Types & Pricing
          </h1>
          <p className="text-xs sm:text-sm text-[#0B4C7A]/75 mt-0.5 font-light">
            Define bookable medical consultations, grooming packages, duration, and Taka fees.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#2FB0FF] to-[#0D8BE0] hover:from-[#259DE6] hover:to-[#0A77C2] text-white text-xs font-semibold shadow-md shadow-[#0D8BE0]/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Service</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="rounded-[2rem] border border-white/75 bg-white/60 backdrop-blur-2xl p-5 shadow-[0_10px_35px_rgba(1,95,160,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] hover:shadow-[0_14px_40px_rgba(1,95,160,0.12)] transition-all flex flex-col justify-between"
          >
            <div className="space-y-3 mb-4">
              <div className="flex items-start justify-between gap-3">
                <span className="px-2.5 py-0.5 rounded-md bg-sky-50 text-[#0D8BE0] border border-sky-100 text-[10px] font-semibold">
                  {srv.category}
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold text-[#06395F]">
                    ৳ {srv.priceBDT}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleStatus(srv.id)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      srv.isActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-gray-100 text-gray-500 border-gray-200"
                    }`}
                  >
                    {srv.isActive ? "Active" : "Paused"}
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-sm text-[#06395F] leading-snug">
                {srv.title}
              </h3>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-[#0B4C7A]/75">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#0D8BE0]" />
                  <span>Duration: <strong>{srv.durationMinutes} min</strong></span>
                </div>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Buffer: <strong>{srv.bufferMinutes} min</strong></span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {srv.applicablePets.map((p) => (
                  <span
                    key={p}
                    className="px-2 py-0.5 rounded-md bg-white/80 border border-white text-[10px] text-[#06395F] font-medium"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#06395F]/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleOpenEdit(srv)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#0D8BE0] hover:underline"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Details</span>
              </button>

              <button
                type="button"
                onClick={() => handleDelete(srv.id, srv.title)}
                className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                title="Delete Service"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-[2.5rem] border border-white/80 bg-white/95 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#06395F]/10">
              <h3 className="text-base font-bold text-[#06395F]">
                {editingService ? "Edit Service Offering" : "Create New Service"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-full text-[#06395F] hover:bg-black/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#06395F] mb-1">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Core Annual Vaccine Booster"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-200 bg-white text-xs text-[#06395F] outline-none focus:ring-2 focus:ring-[#0D8BE0]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#06395F] mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-surface-200 bg-white text-xs text-[#06395F] outline-none focus:ring-2 focus:ring-[#0D8BE0]"
                  >
                    <option value="Veterinary Medicine">Veterinary Medicine</option>
                    <option value="Vaccination">Vaccination</option>
                    <option value="Surgery">Pet Surgery</option>
                    <option value="Grooming">Pet Grooming & Spa</option>
                    <option value="Dental Care">Dental Care</option>
                    <option value="Boarding">Boarding & Daycare</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#06395F] mb-1">
                    Price (BDT) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.priceBDT}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priceBDT: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="800"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-surface-200 bg-white text-xs text-[#06395F] outline-none focus:ring-2 focus:ring-[#0D8BE0]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#06395F] mb-1">
                    Duration (Minutes) *
                  </label>
                  <select
                    value={formData.durationMinutes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        durationMinutes: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-surface-200 bg-white text-xs text-[#06395F] outline-none focus:ring-2 focus:ring-[#0D8BE0]"
                  >
                    <option value={15}>15 Minutes</option>
                    <option value={20}>20 Minutes</option>
                    <option value={30}>30 Minutes</option>
                    <option value={45}>45 Minutes</option>
                    <option value={60}>60 Minutes (1 Hour)</option>
                    <option value={90}>90 Minutes (1.5 Hours)</option>
                    <option value={120}>120 Minutes (2 Hours)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#06395F] mb-1">
                    Buffer / Cleanup Time
                  </label>
                  <select
                    value={formData.bufferMinutes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bufferMinutes: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-surface-200 bg-white text-xs text-[#06395F] outline-none focus:ring-2 focus:ring-[#0D8BE0]"
                  >
                    <option value={0}>0 Minutes (Back-to-back)</option>
                    <option value={5}>5 Minutes</option>
                    <option value={10}>10 Minutes</option>
                    <option value={15}>15 Minutes</option>
                    <option value={30}>30 Minutes</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-[#0D8BE0] focus:ring-[#0D8BE0]"
                />
                <label
                  htmlFor="isActive"
                  className="font-semibold text-[#06395F] cursor-pointer"
                >
                  Enable this service for instant online patient booking
                </label>
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
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-[#2FB0FF] to-[#0D8BE0] text-white text-xs font-semibold shadow-xs"
                >
                  {editingService ? "Save Changes" : "Create Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
