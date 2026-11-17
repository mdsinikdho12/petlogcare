"use client";

import { useState, useEffect } from "react";
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
  RotateCw,
  PlusCircle,
} from "lucide-react";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { apiClient } from "@/lib/api/client";

interface ServiceItem {
  id: string;
  title: string;
  category: string;
  categoryId?: string;
  durationMinutes: number;
  priceBDT: number;
  bufferMinutes: number;
  petTypesApplicable: string[];
  isActive: boolean;
  description?: string;
}

interface CategoryOption {
  _id: string;
  name: string;
  slug: string;
}

function formatBDT(amount: number): string {
  return `৳${new Intl.NumberFormat("en-BD").format(amount)}`;
}

export default function ProviderServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [petTypes, setPetTypes] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    durationMinutes: 30,
    priceBDT: 800,
    bufferMinutes: 10,
    description: "",
    selectedPetTypes: [] as string[],
    isActive: true,
  });

  const fetchServicesAndMeta = async () => {
    try {
      setLoading(true);
      const [srvRes, catRes, petTypeRes] = await Promise.allSettled([
        apiClient.get("/service-types/me"),
        apiClient.get("/categories?type=SERVICE_CATEGORY"),
        apiClient.get("/categories?type=PET_TYPE"),
      ]);

      if (catRes.status === "fulfilled" && catRes.value.data?.data) {
        const cList = catRes.value.data.data;
        setCategories(cList);
        if (cList.length > 0 && !formData.categoryId) {
          setFormData((prev) => ({ ...prev, categoryId: cList[0]._id }));
        }
      }

      if (petTypeRes.status === "fulfilled" && petTypeRes.value.data?.data) {
        const ptList = petTypeRes.value.data.data;
        setPetTypes(ptList);
        if (formData.selectedPetTypes.length === 0 && ptList.length > 0) {
          setFormData((prev) => ({
            ...prev,
            selectedPetTypes: ptList.slice(0, 2).map((p: any) => p._id),
          }));
        }
      }

      if (srvRes.status === "fulfilled" && srvRes.value.data?.data) {
        const raw = srvRes.value.data.data;
        if (Array.isArray(raw)) {
          const mapped: ServiceItem[] = raw.map((s: any) => ({
            id: s._id || s.id,
            title: s.title || s.name,
            category: s.category?.name || s.categoryName || "Veterinary Care",
            categoryId: s.categoryId || s.category?._id,
            durationMinutes: s.durationMinutes || 30,
            priceBDT: s.price || s.priceBDT || 800,
            bufferMinutes: s.bufferMinutes || 10,
            petTypesApplicable: Array.isArray(s.petTypesApplicable)
              ? s.petTypesApplicable.map((p: any) => p.name || p)
              : ["Dogs", "Cats"],
            isActive: s.isActive ?? true,
            description: s.description,
          }));
          setServices(mapped);
        }
      }
    } catch (err) {
      console.error("Failed to fetch service types:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicesAndMeta();
  }, []);

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData({
      title: "",
      categoryId: categories[0]?._id || "",
      durationMinutes: 30,
      priceBDT: 800,
      bufferMinutes: 10,
      description: "Comprehensive veterinary examination and clinical diagnosis.",
      selectedPetTypes: petTypes.slice(0, 2).map((p) => p._id),
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (srv: ServiceItem) => {
    setEditingService(srv);
    setFormData({
      title: srv.title,
      categoryId: srv.categoryId || categories[0]?._id || "",
      durationMinutes: srv.durationMinutes,
      priceBDT: srv.priceBDT,
      bufferMinutes: srv.bufferMinutes,
      description: srv.description || "",
      selectedPetTypes: petTypes.slice(0, 2).map((p) => p._id),
      isActive: srv.isActive,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please enter service title");
      return;
    }

    try {
      setSaving(true);
      const categoryId =
        formData.categoryId || categories[0]?._id || "6ace9a59ccf33da0bd92552b";
      const applicable =
        formData.selectedPetTypes.length > 0
          ? formData.selectedPetTypes
          : petTypes.map((p) => p._id);

      const payload = {
        categoryId,
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        durationMinutes: Number(formData.durationMinutes) || 30,
        bufferMinutes: Number(formData.bufferMinutes) || 10,
        price: Number(formData.priceBDT) || 800,
        petTypesApplicable: applicable,
        isActive: formData.isActive,
      };

      if (editingService) {
        await apiClient.patch(`/service-types/${editingService.id}`, payload);
        toast.success("Service updated successfully!");
      } else {
        await apiClient.post("/service-types", payload);
        toast.success("Service created and published!");
      }

      setModalOpen(false);
      fetchServicesAndMeta();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save service");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Remove "${title}" from your offered services?`)) {
      try {
        await apiClient.delete(`/service-types/${id}`);
        toast.info("Service removed");
        fetchServicesAndMeta();
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to delete service");
      }
    }
  };

  const handleToggleActive = async (srv: ServiceItem) => {
    try {
      await apiClient.patch(`/service-types/${srv.id}`, {
        isActive: !srv.isActive,
      });
      toast.info(`Service ${!srv.isActive ? "activated" : "deactivated"}`);
      fetchServicesAndMeta();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update service status");
    }
  };

  // Seed sample clinical services into database
  const handleSeedServices = async () => {
    try {
      setSeeding(true);
      const catVet = categories.find((c) => c.slug.includes("vet") || c.name.toLowerCase().includes("vet"))?._id || categories[0]?._id;
      const catVac = categories.find((c) => c.slug.includes("vaccin") || c.name.toLowerCase().includes("vaccin"))?._id || catVet;
      const applicable = petTypes.map((p) => p._id);

      await apiClient.post("/service-types", {
        categoryId: catVet,
        title: "Comprehensive Veterinary Consultation",
        description: "Complete physical exam, vitals evaluation, and digital prescription.",
        durationMinutes: 30,
        bufferMinutes: 10,
        price: 800,
        petTypesApplicable: applicable,
        isActive: true,
      });

      await apiClient.post("/service-types", {
        categoryId: catVac,
        title: "Rabies Core Annual Booster Vaccination",
        description: "Administration of Nobivac core vaccine with PetCareLog digital passport synchronization.",
        durationMinutes: 20,
        bufferMinutes: 10,
        price: 1200,
        petTypesApplicable: applicable,
        isActive: true,
      });

      toast.success("Sample services saved into database!");
      fetchServicesAndMeta();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to seed services");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Top Banner (Liquid Glass) */}
      <div className="rounded-[13px] border border-white/80 bg-white/55 p-6 sm:p-7 backdrop-blur-xl backdrop-saturate-150 shadow-[0_8px_30px_rgba(1,95,160,0.10),inset_0_1px_0_rgba(255,255,255,0.95)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-sky-500/15 text-[#0D8BE0] text-[12px] font-semibold mb-2.5 border border-white/80 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Service catalog</span>
          </div>
          <h1 className="font-display text-2xl sm:text-[28px] font-bold tracking-tight text-[#06395F]">
            Services &amp; Pricing
          </h1>
          <p className="text-[13px] sm:text-sm text-[#06395F]/80 mt-1 max-w-xl font-normal leading-relaxed">
            Configure clinical procedures, consultation durations, BDT pricing, and applicable companion pet types.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchServicesAndMeta}
            disabled={loading}
            className="p-2.5 rounded-[11px] bg-white border border-[#06395F]/15 text-[#06395F] hover:bg-slate-50 transition shadow-2xs"
            title="Refresh service list"
          >
            <RotateCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] px-4 py-2.5 text-[13px] font-semibold text-white shadow-[0_4px_14px_rgba(13,150,230,0.30)] hover:-translate-y-0.5 active:translate-y-0 transition shrink-0 whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add service</span>
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && services.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-[13px] bg-white/85 border border-[#06395F]/10 p-6 space-y-3 animate-pulse shadow-xs"
            >
              <div className="h-5 bg-slate-200 rounded w-2/3" />
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-8 bg-slate-100 rounded-[8px]" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State with Seeding Option */}
      {!loading && services.length === 0 && (
        <div className="rounded-[13px] bg-white/85 border border-[#06395F]/10 p-10 sm:p-14 text-center space-y-4 shadow-[0_1px_2px_rgba(6,57,95,0.06)]">
          <div className="w-14 h-14 mx-auto rounded-[13px] bg-sky-50 text-[#0D8BE0] flex items-center justify-center border border-sky-100 shadow-xs">
            <Stethoscope className="w-7 h-7" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="font-display text-lg font-bold text-[#06395F]">
              No services added to catalog yet
            </h3>
            <p className="text-[13px] text-[#06395F]/75 leading-relaxed font-normal">
              Publish consultation offerings, vaccine administration, and grooming packages so pet parents can schedule appointments.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] px-5 py-2.5 text-[13px] font-semibold text-white shadow-xs hover:-translate-y-0.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create service</span>
            </button>

            <button
              type="button"
              onClick={handleSeedServices}
              disabled={seeding}
              className="inline-flex items-center gap-2 rounded-[11px] bg-sky-50 text-[#0D8BE0] border border-sky-200 px-4 py-2.5 text-[13px] font-semibold hover:bg-sky-100 transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{seeding ? "Saving services..." : "Seed sample clinic services"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Services Grid (Solid Surfaces) */}
      {!loading && services.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {services.map((srv) => (
            <div
              key={srv.id}
              className={`rounded-[13px] bg-white/85 border border-[#06395F]/10 p-5 sm:p-6 shadow-[0_1px_2px_rgba(6,57,95,0.06)] hover:border-[#0D8BE0]/30 hover:-translate-y-0.5 transition-all flex flex-col justify-between group ${
                !srv.isActive ? "opacity-60 bg-white/60" : ""
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="space-y-1 min-w-0">
                    <span className="inline-block px-2.5 py-0.5 rounded-[6px] bg-sky-50 text-[#0D8BE0] text-[11px] font-semibold border border-sky-100">
                      {srv.category}
                    </span>
                    <h3 className="font-display text-base font-bold text-[#06395F] line-clamp-1">
                      {srv.title}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleActive(srv)}
                    className={`px-2.5 py-1 rounded-[8px] text-[11px] font-semibold transition ${
                      srv.isActive
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                        : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                    }`}
                  >
                    {srv.isActive ? "Active" : "Paused"}
                  </button>
                </div>

                {srv.description && (
                  <p className="text-[12px] text-[#06395F]/75 line-clamp-2 mt-1 mb-3">
                    {srv.description}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2 p-3 rounded-[11px] bg-[#F3F9FF] border border-[#06395F]/10 text-[12px] my-3">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#0D8BE0]" />
                    <span className="text-[#06395F]">
                      Duration: <strong>{srv.durationMinutes} mins</strong>
                    </span>
                  </div>
                  <div>
                    <span className="text-[#06395F]/70 text-[11px] block">Buffer</span>
                    <strong className="text-[#06395F]">{srv.bufferMinutes} mins</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[13px] pt-1">
                  <span className="text-[#06395F]/70 text-[12px]">Service fee</span>
                  <strong className="text-lg font-bold text-[#06395F] tabular-nums">
                    {formatBDT(srv.priceBDT)}
                  </strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#06395F]/10 flex items-center justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(srv)}
                  className="p-2 rounded-[9px] border border-[#06395F]/15 text-[#06395F] hover:bg-slate-50 transition shadow-2xs flex items-center gap-1 text-[12px] font-semibold"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(srv.id, srv.title)}
                  className="p-2 rounded-[9px] border border-rose-200 text-rose-600 hover:bg-rose-50 transition shadow-2xs flex items-center gap-1 text-[12px] font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-[13px] border border-white/80 bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#06395F]/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[8px] bg-sky-500/15 text-[#0D8BE0] flex items-center justify-center">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <h3 className="font-display text-base font-bold text-[#06395F]">
                  {editingService ? "Edit service" : "Add new clinic service"}
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

            <form onSubmit={handleSubmit} className="space-y-3.5 text-[13px]">
              <div>
                <label className="block font-semibold text-[#06395F] mb-1">
                  Service title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Comprehensive Vet Consultation, Nobivac Rabies Booster"
                  className="w-full px-3.5 py-2 rounded-[11px] border border-[#06395F]/15 focus:outline-none focus:border-[#0D8BE0] text-[#06395F]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#06395F] mb-1">
                  Category *
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-3 py-2 rounded-[11px] border border-[#06395F]/15 bg-white text-[#06395F]"
                >
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#06395F] mb-1">
                    Price (BDT) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.priceBDT}
                    onChange={(e) => setFormData({ ...formData, priceBDT: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-[11px] border border-[#06395F]/15 text-[#06395F]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#06395F] mb-1">
                    Duration (mins)
                  </label>
                  <input
                    type="number"
                    min={5}
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-[11px] border border-[#06395F]/15 text-[#06395F]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#06395F] mb-1">
                    Buffer (mins)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.bufferMinutes}
                    onChange={(e) => setFormData({ ...formData, bufferMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-[11px] border border-[#06395F]/15 text-[#06395F]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#06395F] mb-1">
                  Service description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Clinical scope, examination protocol, what the pet owner should bring..."
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
                  {saving ? "Saving to database..." : editingService ? "Update service" : "Save service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
