"use client";

import { useState } from "react";
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
} from "lucide-react";
import { toast } from "sonner";
import type { Pet } from "@/types";
import StatusBadge from "@/components/dashboard/StatusBadge";

export default function OwnerPetsPage() {
  const [pets, setPets] = useState<Pet[]>([
    {
      id: "pet-1",
      ownerId: "owner-1",
      name: "Miu Miu",
      species: "CAT",
      breed: "Persian Classic",
      gender: "FEMALE",
      dob: "2024-03-15",
      weightKg: 4.2,
      microchipNumber: "BD-9820019283",
      allergies: ["Chicken protein"],
      medicalNotes: "Sensitive stomach, loves catnip treats.",
    },
    {
      id: "pet-2",
      ownerId: "owner-1",
      name: "Rocky",
      species: "DOG",
      breed: "Golden Retriever",
      gender: "MALE",
      dob: "2023-08-20",
      weightKg: 28.5,
      microchipNumber: "BD-4819028371",
      allergies: [],
      medicalNotes: "Fully vaccinated, energetic and playful.",
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [newPet, setNewPet] = useState({
    name: "",
    species: "CAT" as Pet["species"],
    breed: "",
    gender: "MALE" as Pet["gender"],
    dob: "",
    weightKg: "",
    microchipNumber: "",
    allergies: "",
    medicalNotes: "",
  });

  const handleCreatePet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPet.name || !newPet.dob) {
      toast.error("Please provide pet name and date of birth");
      return;
    }

    const created: Pet = {
      id: `pet-${Date.now()}`,
      ownerId: "owner-1",
      name: newPet.name,
      species: newPet.species,
      breed: newPet.breed || undefined,
      gender: newPet.gender,
      dob: newPet.dob,
      weightKg: newPet.weightKg ? parseFloat(newPet.weightKg) : undefined,
      microchipNumber: newPet.microchipNumber || undefined,
      allergies: newPet.allergies
        ? newPet.allergies.split(",").map((a) => a.trim())
        : [],
      medicalNotes: newPet.medicalNotes || undefined,
    };

    setPets((prev) => [created, ...prev]);
    toast.success(`${created.name} added to your pet family!`);
    setModalOpen(false);
    setNewPet({
      name: "",
      species: "CAT",
      breed: "",
      gender: "MALE",
      dob: "",
      weightKg: "",
      microchipNumber: "",
      allergies: "",
      medicalNotes: "",
    });
  };

  const handleDeletePet = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}'s profile?`)) {
      setPets((prev) => prev.filter((p) => p.id !== id));
      toast.info(`${name}'s profile has been removed`);
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

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] px-4 py-2.5 text-[13px] font-semibold text-white shadow-[0_4px_14px_rgba(13,150,230,0.30)] hover:-translate-y-0.5 active:translate-y-0 transition shrink-0 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add new pet</span>
        </button>
      </div>

      {/* Pet Cards Grid (Solid Surfaces) */}
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
                    {pet.species === "CAT" ? (
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
                      <StatusBadge status="ACTIVE" label={pet.species === "CAT" ? "Feline" : pet.species === "DOG" ? "Canine" : pet.species} />
                    </div>
                    <div className="text-[12px] text-[#06395F]/75 font-medium truncate mt-0.5">
                      {pet.breed || "Mixed breed"} • {calculateAge(pet.dob)}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeletePet(pet.id, pet.name)}
                  className="p-1.5 rounded-[9px] text-[#06395F]/40 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
                  title="Remove pet"
                  aria-label="Remove pet"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 gap-2 text-[12px] mb-4">
                <div className="p-3 rounded-[11px] bg-[#F3F9FF] border border-[#06395F]/10 space-y-0.5">
                  <span className="text-[11px] font-medium text-[#06395F]/60 block capitalize">
                    Gender
                  </span>
                  <div className="font-semibold text-[#06395F]">
                    {pet.gender === "MALE" ? "Male (Neutered)" : "Female"}
                  </div>
                </div>

                <div className="p-3 rounded-[11px] bg-[#F3F9FF] border border-[#06395F]/10 space-y-0.5">
                  <span className="text-[11px] font-medium text-[#06395F]/60 block capitalize">
                    Recorded weight
                  </span>
                  <div className="font-semibold text-[#06395F] tabular-nums">
                    {pet.weightKg ? `${pet.weightKg} kg` : "Not logged"}
                  </div>
                </div>
              </div>

              {/* Allergies / Medical Notice */}
              {pet.allergies && pet.allergies.length > 0 && (
                <div className="mb-4 p-2.5 rounded-[9px] bg-rose-50 border border-rose-200/80 flex items-center gap-2 text-[12px] text-rose-800">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>
                    Allergies: <strong>{pet.allergies.join(", ")}</strong>
                  </span>
                </div>
              )}
            </div>

            {/* Action to Health Records Hub */}
            <Link
              href={`/dashboard/owner/pets/${pet.id}`}
              className="w-full py-2.5 px-4 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] hover:-translate-y-0.5 text-white text-[13px] font-semibold tracking-wide shadow-[0_4px_14px_rgba(13,150,230,0.25)] transition flex items-center justify-center gap-1.5"
            >
              <Activity className="w-4 h-4" />
              <span>Open health hub &amp; vaccinations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>

      {/* Add Pet Modal (Liquid Glass) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-[#06395F]/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-[13px] border border-white/80 bg-white/95 backdrop-blur-2xl p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#06395F]/10">
              <h3 className="font-display text-base sm:text-lg font-bold text-[#06395F]">
                Add pet companion
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-[9px] text-[#06395F]/60 hover:text-[#06395F] hover:bg-slate-100 transition"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePet} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-[#06395F] mb-1">
                    Pet name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPet.name}
                    onChange={(e) =>
                      setNewPet({ ...newPet, name: e.target.value })
                    }
                    placeholder="Miu / Simba"
                    className="w-full px-3.5 py-2.5 rounded-[11px] border border-[#06395F]/15 bg-white text-[13px] text-[#06395F] outline-none focus:border-[#0D8BE0] focus:ring-2 focus:ring-[#0D8BE0]/20 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-[#06395F] mb-1">
                    Species *
                  </label>
                  <select
                    value={newPet.species}
                    onChange={(e) =>
                      setNewPet({
                        ...newPet,
                        species: e.target.value as Pet["species"],
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-[11px] border border-[#06395F]/15 bg-white text-[13px] text-[#06395F] outline-none focus:border-[#0D8BE0] focus:ring-2 focus:ring-[#0D8BE0]/20 shadow-xs"
                  >
                    <option value="CAT">Cat</option>
                    <option value="DOG">Dog</option>
                    <option value="BIRD">Bird</option>
                    <option value="RABBIT">Rabbit</option>
                    <option value="OTHER">Other pet</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-[#06395F] mb-1">
                    Breed
                  </label>
                  <input
                    type="text"
                    value={newPet.breed}
                    onChange={(e) =>
                      setNewPet({ ...newPet, breed: e.target.value })
                    }
                    placeholder="Persian / Golden Retriever"
                    className="w-full px-3.5 py-2.5 rounded-[11px] border border-[#06395F]/15 bg-white text-[13px] text-[#06395F] outline-none focus:border-[#0D8BE0] focus:ring-2 focus:ring-[#0D8BE0]/20 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-[#06395F] mb-1">
                    Gender *
                  </label>
                  <select
                    value={newPet.gender}
                    onChange={(e) =>
                      setNewPet({
                        ...newPet,
                        gender: e.target.value as Pet["gender"],
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-[11px] border border-[#06395F]/15 bg-white text-[13px] text-[#06395F] outline-none focus:border-[#0D8BE0] focus:ring-2 focus:ring-[#0D8BE0]/20 shadow-xs"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="UNKNOWN">Unknown</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-[#06395F] mb-1">
                    Date of birth *
                  </label>
                  <input
                    type="date"
                    required
                    value={newPet.dob}
                    onChange={(e) =>
                      setNewPet({ ...newPet, dob: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-[11px] border border-[#06395F]/15 bg-white text-[13px] text-[#06395F] outline-none focus:border-[#0D8BE0] focus:ring-2 focus:ring-[#0D8BE0]/20 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-[#06395F] mb-1">
                    Current weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newPet.weightKg}
                    onChange={(e) =>
                      setNewPet({ ...newPet, weightKg: e.target.value })
                    }
                    placeholder="4.5"
                    className="w-full px-3.5 py-2.5 rounded-[11px] border border-[#06395F]/15 bg-white text-[13px] text-[#06395F] outline-none focus:border-[#0D8BE0] focus:ring-2 focus:ring-[#0D8BE0]/20 shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#06395F] mb-1">
                  Allergies (comma separated)
                </label>
                <input
                  type="text"
                  value={newPet.allergies}
                  onChange={(e) =>
                    setNewPet({ ...newPet, allergies: e.target.value })
                  }
                  placeholder="Chicken protein, Dust mites"
                  className="w-full px-3.5 py-2.5 rounded-[11px] border border-[#06395F]/15 bg-white text-[13px] text-[#06395F] outline-none focus:border-[#0D8BE0] focus:ring-2 focus:ring-[#0D8BE0]/20 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#06395F] mb-1">
                  Medical notes
                </label>
                <textarea
                  rows={2}
                  value={newPet.medicalNotes}
                  onChange={(e) =>
                    setNewPet({ ...newPet, medicalNotes: e.target.value })
                  }
                  placeholder="Any behavioral traits or ongoing medical conditions..."
                  className="w-full px-3.5 py-2.5 rounded-[11px] border border-[#06395F]/15 bg-white text-[13px] text-[#06395F] outline-none focus:border-[#0D8BE0] focus:ring-2 focus:ring-[#0D8BE0]/20 shadow-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-[11px] border border-[#06395F]/15 text-[13px] font-semibold text-[#06395F] hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white text-[13px] font-semibold shadow-xs hover:-translate-y-0.5 transition"
                >
                  Create pet profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
