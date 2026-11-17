"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Dog,
  Cat,
  Plus,
  ArrowRight,
  X,
  Trash2,
  AlertTriangle,
  Sparkles,
  Activity,
  Heart,
  RotateCw,
  PlusCircle,
} from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api/client";
import StatusBadge from "@/components/dashboard/StatusBadge";

interface PetData {
  id: string;
  _id?: string;
  name: string;
  species: string | any;
  breed?: string;
  customBreed?: string;
  gender?: "MALE" | "FEMALE" | "UNKNOWN";
  dob?: string;
  weightKg?: number;
  microchipId?: string;
  microchipNumber?: string;
  allergies?: string[];
  medicalNotes?: string;
  conditionNotes?: string;
}

interface PetCategory {
  _id: string;
  name: string;
  slug: string;
}

export default function OwnerPetsPage() {
  const [pets, setPets] = useState<PetData[]>([]);
  const [categories, setCategories] = useState<PetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const [newPet, setNewPet] = useState({
    name: "",
    speciesId: "",
    customBreed: "",
    gender: "MALE" as "MALE" | "FEMALE",
    dob: "2024-01-15",
    weightKg: "4.5",
    microchipId: "",
    allergies: "",
    conditionNotes: "",
  });

  // 1. Load categories and pets from live backend
  const fetchPets = async () => {
    try {
      setLoading(true);
      const [petsRes, catsRes] = await Promise.allSettled([
        apiClient.get("/pets"),
        apiClient.get("/categories?type=PET_TYPE"),
      ]);

      if (catsRes.status === "fulfilled" && catsRes.value.data?.data) {
        const catList = catsRes.value.data.data;
        setCategories(catList);
        if (catList.length > 0 && !newPet.speciesId) {
          setNewPet((prev) => ({ ...prev, speciesId: catList[0]._id }));
        }
      }

      if (petsRes.status === "fulfilled" && petsRes.value.data?.data) {
        const raw = petsRes.value.data.data;
        const normalized: PetData[] = raw.map((p: any) => ({
          id: p._id || p.id,
          name: p.name,
          species: p.species?.name || p.species || "Cat",
          breed: p.customBreed || p.breed || "Companion",
          gender: p.gender || "MALE",
          dob: p.dob || "2024-01-01",
          weightKg: p.weightKg || p.weight || 4.2,
          microchipId: p.microchipId || p.microchipNumber || "BD-PET-VERIFIED",
          allergies: Array.isArray(p.allergies) ? p.allergies : [],
          medicalNotes: p.conditionNotes || p.medicalNotes,
        }));
        setPets(normalized);
      }
    } catch (err) {
      console.error("Failed to load pets from API:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleCreatePet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPet.name.trim() || !newPet.dob) {
      toast.error("Please provide pet name and date of birth");
      return;
    }

    try {
      setCreating(true);
      const speciesId =
        newPet.speciesId ||
        categories.find((c) => c.name.toLowerCase().includes("cat"))?._id ||
        categories[0]?._id;

      const payload = {
        name: newPet.name.trim(),
        species: speciesId,
        customBreed: newPet.customBreed.trim() || "Domestic",
        gender: newPet.gender,
        dob: newPet.dob,
        weightKg: newPet.weightKg ? parseFloat(newPet.weightKg) : 4.0,
        microchipId: newPet.microchipId.trim() || undefined,
        allergies: newPet.allergies
          ? newPet.allergies.split(",").map((a) => a.trim()).filter(Boolean)
          : [],
        conditionNotes: newPet.conditionNotes.trim() || undefined,
      };

      const res = await apiClient.post("/pets", payload);
      const created = res.data?.data;
      toast.success(`${created?.name || newPet.name} added to your pet family!`);
      setModalOpen(false);
      setNewPet({
        name: "",
        speciesId: categories[0]?._id || "",
        customBreed: "",
        gender: "MALE",
        dob: "2024-01-15",
        weightKg: "4.5",
        microchipId: "",
        allergies: "",
        conditionNotes: "",
      });
      fetchPets();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create pet in database");
    } finally {
      setCreating(false);
    }
  };

  const handleDeletePet = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}'s medical profile?`)) {
      try {
        await apiClient.delete(`/pets/${id}`);
        toast.info(`${name}'s profile has been removed`);
        fetchPets();
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to delete pet");
      }
    }
  };

  // Seeder helper to add real companion pet into the live database
  const handleSeedPet = async () => {
    try {
      setSeeding(true);
      const catCat = categories.find((c) => c.slug === "cat" || c.name.toLowerCase().includes("cat"))?._id || categories[0]?._id;
      const dogCat = categories.find((c) => c.slug === "dog" || c.name.toLowerCase().includes("dog"))?._id || categories[1]?._id || catCat;

      await apiClient.post("/pets", {
        name: "Milo",
        species: dogCat,
        customBreed: "Golden Retriever",
        gender: "MALE",
        dob: "2024-02-10",
        weightKg: 26.5,
        microchipId: "BD-9820019283",
        allergies: ["Chicken"],
        conditionNotes: "Fully vaccinated, energetic and healthy.",
      });

      await apiClient.post("/pets", {
        name: "Luna",
        species: catCat,
        customBreed: "Persian Cat",
        gender: "FEMALE",
        dob: "2024-05-18",
        weightKg: 4.1,
        microchipId: "BD-4819028371",
        allergies: [],
        conditionNotes: "Sensitive stomach, loves catnip treats.",
      });

      toast.success("Seeded Milo & Luna into your real database!");
      fetchPets();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Could not seed pets");
    } finally {
      setSeeding(false);
    }
  };

  const calculateAge = (dobString?: string) => {
    if (!dobString) return "";
    const [y, m] = dobString.split("-").map(Number);
    if (!y || !m) return "";
    const currentYear = 2026;
    const currentMonth = 11;
    const months = (currentYear - y) * 12 + (currentMonth - m);
    if (months < 12) {
      return `${Math.max(1, months)} months old`;
    }
    const years = Math.floor(months / 12);
    return `${years} year${years > 1 ? "s" : ""} old`;
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Top Banner (Liquid Glass) */}
      <div className="rounded-[13px] border border-white/80 bg-white/55 p-6 sm:p-7 backdrop-blur-xl backdrop-saturate-150 shadow-[0_8px_30px_rgba(1,95,160,0.10),inset_0_1px_0_rgba(255,255,255,0.95)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-sky-500/15 text-[#0D8BE0] text-[12px] font-semibold mb-2.5 border border-white/80 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital health passports</span>
          </div>
          <h1 className="font-display text-2xl sm:text-[28px] font-bold tracking-tight text-[#06395F]">
            My companion pets
          </h1>
          <p className="text-[13px] sm:text-sm text-[#06395F]/80 mt-1 max-w-xl font-normal leading-relaxed">
            Manage your companion pets, biological health records, weight tracking and immunization passports in Bangladesh.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchPets}
            disabled={loading}
            className="p-2.5 rounded-[11px] bg-white border border-[#06395F]/15 text-[#06395F] hover:bg-slate-50 transition shadow-2xs"
            title="Refresh pets list"
          >
            <RotateCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] px-4 py-2.5 text-[13px] font-semibold text-white shadow-[0_4px_14px_rgba(13,150,230,0.30)] hover:-translate-y-0.5 active:translate-y-0 transition shrink-0 whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add new pet</span>
          </button>
        </div>
      </div>

      {/* Loading Skeletons */}
      {loading && pets.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-[13px] bg-white/85 border border-[#06395F]/10 p-6 space-y-4 animate-pulse shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-[11px] bg-slate-200" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-5 bg-slate-200 rounded w-1/3" />
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
              <div className="h-16 bg-slate-100 rounded-[11px]" />
              <div className="h-10 bg-slate-200 rounded-[11px]" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State with Seeding Option */}
      {!loading && pets.length === 0 && (
        <div className="rounded-[13px] bg-white/85 border border-[#06395F]/10 p-10 sm:p-14 text-center space-y-4 shadow-[0_1px_2px_rgba(6,57,95,0.06)]">
          <div className="w-14 h-14 mx-auto rounded-[13px] bg-sky-50 text-[#0D8BE0] flex items-center justify-center border border-sky-100">
            <Dog className="w-7 h-7" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="font-display text-lg font-bold text-[#06395F]">
              No companion pets registered yet
            </h3>
            <p className="text-[13px] text-[#06395F]/75 leading-relaxed font-normal">
              Register your dog, cat or companion animal to unlock digital vaccination passports, booster alerts and health vaults.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] px-5 py-2.5 text-[13px] font-semibold text-white shadow-xs hover:-translate-y-0.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Register a pet</span>
            </button>

            <button
              type="button"
              onClick={handleSeedPet}
              disabled={seeding}
              className="inline-flex items-center gap-2 rounded-[11px] bg-sky-50 text-[#0D8BE0] border border-sky-200 px-4 py-2.5 text-[13px] font-semibold hover:bg-sky-100 transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{seeding ? "Adding sample pets..." : "Seed sample companion pets"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Pet Cards Grid (Solid Surfaces) */}
      {!loading && pets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="rounded-[13px] bg-white/85 border border-[#06395F]/10 p-5 sm:p-6 shadow-[0_1px_2px_rgba(6,57,95,0.06)] hover:border-[#0D8BE0]/30 hover:-translate-y-0.5 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Pet Card Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-[11px] bg-sky-500/15 text-[#0D8BE0] border border-sky-300/40 flex items-center justify-center shrink-0 shadow-xs">
                      {String(pet.species).toLowerCase().includes("cat") ? (
                        <Cat className="w-6 h-6" />
                      ) : (
                        <Dog className="w-6 h-6" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-base sm:text-lg font-bold text-[#06395F] truncate">
                          {pet.name}
                        </h3>
                        <StatusBadge status="ACTIVE" label={pet.gender === "FEMALE" ? "Female" : "Male"} />
                      </div>
                      <div className="text-[12px] text-[#06395F]/75 font-medium truncate mt-0.5">
                        {pet.breed || "Companion"} • {calculateAge(pet.dob)}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeletePet(pet.id, pet.name)}
                    className="p-1.5 rounded-[8px] text-[#06395F]/40 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete pet profile"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Vitals Grid */}
                <div className="grid grid-cols-2 gap-2.5 p-3 rounded-[11px] bg-[#F3F9FF] border border-[#06395F]/10 text-[12px] mb-4">
                  <div>
                    <span className="text-[#06395F]/60 block font-medium">Weight</span>
                    <strong className="text-[#06395F] font-bold tabular-nums">
                      {pet.weightKg ? `${pet.weightKg} kg` : "Not logged"}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#06395F]/60 block font-medium">Microchip</span>
                    <span className="text-[#06395F] font-semibold truncate block">
                      {pet.microchipId || "None"}
                    </span>
                  </div>
                </div>

                {/* Allergies & Notes */}
                {pet.allergies && pet.allergies.length > 0 && (
                  <div className="mb-3">
                    <span className="text-[11px] font-semibold text-amber-800 flex items-center gap-1 mb-1">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      <span>Known allergies:</span>
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {pet.allergies.map((a, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-[6px] bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-medium"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Links */}
              <div className="pt-3 border-t border-[#06395F]/10 flex items-center justify-between gap-3">
                <Link
                  href={`/dashboard/owner/pets/${pet.id}`}
                  className="flex-1 py-2 px-3 rounded-[11px] bg-white text-[#0D8BE0] border border-[#06395F]/15 hover:bg-sky-50 text-[12px] font-semibold transition text-center shadow-2xs flex items-center justify-center gap-1.5"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Vaccines &amp; vault</span>
                </Link>

                <Link
                  href="/providers"
                  className="flex-1 py-2 px-3 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white text-[12px] font-semibold transition text-center shadow-xs flex items-center justify-center gap-1.5 hover:-translate-y-0.5"
                >
                  <span>Book clinic</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Pet Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-[13px] border border-white/80 bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#06395F]/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[8px] bg-sky-500/15 text-[#0D8BE0] flex items-center justify-center">
                  <Dog className="w-4 h-4" />
                </div>
                <h3 className="font-display text-base font-bold text-[#06395F]">
                  Register companion pet
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

            <form onSubmit={handleCreatePet} className="space-y-3.5 text-[13px]">
              <div>
                <label className="block font-semibold text-[#06395F] mb-1">
                  Pet name *
                </label>
                <input
                  type="text"
                  required
                  value={newPet.name}
                  onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
                  placeholder="e.g. Milo, Luna, Bagha"
                  className="w-full px-3.5 py-2 rounded-[11px] border border-[#06395F]/15 focus:outline-none focus:border-[#0D8BE0] text-[#06395F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#06395F] mb-1">
                    Species *
                  </label>
                  <select
                    value={newPet.speciesId}
                    onChange={(e) => setNewPet({ ...newPet, speciesId: e.target.value })}
                    className="w-full px-3 py-2 rounded-[11px] border border-[#06395F]/15 bg-white text-[#06395F]"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#06395F] mb-1">
                    Gender *
                  </label>
                  <select
                    value={newPet.gender}
                    onChange={(e) => setNewPet({ ...newPet, gender: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-[11px] border border-[#06395F]/15 bg-white text-[#06395F]"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#06395F] mb-1">
                    Breed
                  </label>
                  <input
                    type="text"
                    value={newPet.customBreed}
                    onChange={(e) => setNewPet({ ...newPet, customBreed: e.target.value })}
                    placeholder="e.g. Golden Retriever, Persian"
                    className="w-full px-3.5 py-2 rounded-[11px] border border-[#06395F]/15 focus:outline-none focus:border-[#0D8BE0] text-[#06395F]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#06395F] mb-1">
                    Date of birth *
                  </label>
                  <input
                    type="date"
                    required
                    value={newPet.dob}
                    onChange={(e) => setNewPet({ ...newPet, dob: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-[11px] border border-[#06395F]/15 focus:outline-none focus:border-[#0D8BE0] text-[#06395F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#06395F] mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newPet.weightKg}
                    onChange={(e) => setNewPet({ ...newPet, weightKg: e.target.value })}
                    placeholder="e.g. 4.5"
                    className="w-full px-3.5 py-2 rounded-[11px] border border-[#06395F]/15 focus:outline-none focus:border-[#0D8BE0] text-[#06395F]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#06395F] mb-1">
                    Microchip ID
                  </label>
                  <input
                    type="text"
                    value={newPet.microchipId}
                    onChange={(e) => setNewPet({ ...newPet, microchipId: e.target.value })}
                    placeholder="Optional chip serial"
                    className="w-full px-3.5 py-2 rounded-[11px] border border-[#06395F]/15 focus:outline-none focus:border-[#0D8BE0] text-[#06395F]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#06395F] mb-1">
                  Allergies (comma-separated)
                </label>
                <input
                  type="text"
                  value={newPet.allergies}
                  onChange={(e) => setNewPet({ ...newPet, allergies: e.target.value })}
                  placeholder="e.g. Chicken protein, Penicillin"
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
                  disabled={creating}
                  className="px-5 py-2 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white font-semibold shadow-xs"
                >
                  {creating ? "Saving to database..." : "Create pet profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
