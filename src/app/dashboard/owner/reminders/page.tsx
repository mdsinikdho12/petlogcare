// src/app/dashboard/owner/reminders/page.tsx
"use client";

import React, { useState } from "react";
import {
  Bell,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Dog,
  Cat,
  Trash2,
  X,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "@/components/dashboard/StatusBadge";

interface PetReminder {
  id: string;
  petName: string;
  petSpecies: "Dog" | "Cat";
  title: string;
  category: "Vaccination" | "Deworming" | "Medication" | "Grooming" | "Clinic visit";
  dueDate: string;
  daysRemaining: number;
  isCompleted: boolean;
  notes?: string;
  clinicRecommendation?: string;
}

const mockReminders: PetReminder[] = [
  {
    id: "rem-1",
    petName: "Milo",
    petSpecies: "Dog",
    title: "Rabies Multi-booster Vaccination",
    category: "Vaccination",
    dueDate: "04 Dec 2026",
    daysRemaining: 18,
    isCompleted: false,
    clinicRecommendation: "Recommended by Central Pet Hospital (Dr. Samira Khan)",
    notes: "Mandatory annual booster for travel and public park safety.",
  },
  {
    id: "rem-2",
    petName: "Luna",
    petSpecies: "Cat",
    title: "Tricat Core Feline Booster",
    category: "Vaccination",
    dueDate: "10 Nov 2026",
    daysRemaining: -6,
    isCompleted: true,
    clinicRecommendation: "Administered by Dr. Farhan Chowdhury",
  },
  {
    id: "rem-3",
    petName: "Milo",
    petSpecies: "Dog",
    title: "Broad-Spectrum Deworming Tablet",
    category: "Deworming",
    dueDate: "21 Nov 2026",
    daysRemaining: 5,
    isCompleted: false,
    notes: "Administer with morning meal (Drontal Plus 1 tab per 10kg).",
  },
  {
    id: "rem-4",
    petName: "Luna",
    petSpecies: "Cat",
    title: "Flea & Tick Spot-on Treatment",
    category: "Medication",
    dueDate: "28 Nov 2026",
    daysRemaining: 12,
    isCompleted: false,
    notes: "Apply 1 pipette directly onto the skin behind neck.",
  },
  {
    id: "rem-5",
    petName: "Milo",
    petSpecies: "Dog",
    title: "Routine Dental Scaling Checkup",
    category: "Clinic visit",
    dueDate: "15 Jan 2027",
    daysRemaining: 60,
    isCompleted: false,
  },
];

export default function OwnerRemindersPage() {
  const [reminders, setReminders] = useState<PetReminder[]>(mockReminders);
  const [petFilter, setPetFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Reminder Form
  const [petName, setPetName] = useState("Milo");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<PetReminder["category"]>("Vaccination");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

  const filtered = reminders.filter((r) => {
    const matchesPet = petFilter === "ALL" || r.petName === petFilter;
    const matchesCategory = categoryFilter === "ALL" || r.category === categoryFilter;
    return matchesPet && matchesCategory;
  });

  const handleToggleComplete = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextState = !r.isCompleted;
          if (nextState) {
            toast.success(`Marked "${r.title}" as completed!`);
          }
          return { ...r, isCompleted: nextState };
        }
        return r;
      })
    );
  };

  const handleSnooze = (id: string) => {
    setReminders((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, daysRemaining: r.daysRemaining + 7 } : r
      )
    );
    toast.success("Reminder snoozed for 7 days");
  };

  const handleDelete = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    toast.success("Reminder removed");
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) {
      toast.error("Please enter a reminder title and due date");
      return;
    }

    const newReminder: PetReminder = {
      id: `rem-${Date.now()}`,
      petName,
      petSpecies: petName === "Luna" ? "Cat" : "Dog",
      title,
      category,
      dueDate,
      daysRemaining: 14,
      isCompleted: false,
      notes: notes || undefined,
    };

    setReminders([newReminder, ...reminders]);
    toast.success(`Reminder set for ${petName}`);
    setIsModalOpen(false);
    setTitle("");
    setDueDate("");
    setNotes("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-[28px] font-bold tracking-tight text-[#06395F]">
            Care reminders & schedules
          </h1>
          <p className="text-[13px] text-[#06395F]/75 mt-0.5 font-normal">
            Keep track of upcoming rabies boosters, deworming cycles, and medication for your pets.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white text-[13px] font-semibold shadow-[0_4px_14px_rgba(13,150,230,0.30)] hover:-translate-y-0.5 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add reminder</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-[13px] bg-white/85 border border-[#06395F]/10 shadow-[0_1px_2px_rgba(6,57,95,0.06)]">
        {/* Pet Filter */}
        <div className="flex items-center gap-1 p-1 rounded-[11px] bg-slate-100 border border-slate-200 text-xs font-semibold text-[#06395F]">
          {["ALL", "Milo", "Luna"].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPetFilter(p)}
              className={`px-3 py-1 rounded-[9px] transition ${
                petFilter === p
                  ? "bg-white text-[#0D8BE0] shadow-xs"
                  : "text-[#06395F]/70 hover:text-[#06395F]"
              }`}
            >
              {p === "ALL" ? "All pets" : p}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1 p-1 rounded-[11px] bg-slate-100 border border-slate-200 text-xs font-semibold text-[#06395F]">
          {["ALL", "Vaccination", "Deworming", "Medication"].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategoryFilter(c)}
              className={`px-3 py-1 rounded-[9px] transition ${
                categoryFilter === c
                  ? "bg-white text-[#0D8BE0] shadow-xs"
                  : "text-[#06395F]/70 hover:text-[#06395F]"
              }`}
            >
              {c === "ALL" ? "All types" : c}
            </button>
          ))}
        </div>
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {filtered.map((r) => (
          <div
            key={r.id}
            className={`rounded-[13px] border p-4 sm:p-5 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              r.isCompleted
                ? "bg-slate-50/70 border-slate-200 opacity-65"
                : "bg-white/85 border-[#06395F]/10 shadow-[0_1px_2px_rgba(6,57,95,0.06)] hover:border-[#0D8BE0]/30"
            }`}
          >
            <div className="flex items-start gap-3.5">
              <button
                type="button"
                onClick={() => handleToggleComplete(r.id)}
                className={`w-7 h-7 rounded-[8px] border flex items-center justify-center shrink-0 mt-0.5 transition ${
                  r.isCompleted
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : "border-[#06395F]/20 bg-white hover:border-[#0D8BE0]"
                }`}
              >
                {r.isCompleted && <CheckCircle2 className="w-4 h-4" />}
              </button>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-[6px] bg-sky-50 text-[#0D8BE0] border border-sky-100 text-[10px] font-bold">
                    {r.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#06395F]">
                    {r.petSpecies === "Dog" ? (
                      <Dog className="w-3.5 h-3.5 text-amber-600" />
                    ) : (
                      <Cat className="w-3.5 h-3.5 text-indigo-600" />
                    )}
                    {r.petName}
                  </span>
                  <span className="text-[11px] text-[#06395F]/60">• Due {r.dueDate}</span>
                </div>

                <h3
                  className={`font-bold text-sm text-[#06395F] ${
                    r.isCompleted ? "line-through text-[#06395F]/50" : ""
                  }`}
                >
                  {r.title}
                </h3>

                {r.notes && (
                  <p className="text-xs text-[#06395F]/75 font-normal leading-relaxed">
                    {r.notes}
                  </p>
                )}

                {r.clinicRecommendation && (
                  <p className="text-[10px] text-emerald-700 bg-emerald-50/70 px-2 py-1 rounded-[6px] border border-emerald-200 inline-block">
                    {r.clinicRecommendation}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
              {!r.isCompleted ? (
                <>
                  <span
                    className={`px-2.5 py-1 rounded-[8px] text-[11px] font-semibold ${
                      r.daysRemaining <= 5
                        ? "bg-amber-100 text-amber-800"
                        : "bg-sky-50 text-sky-800"
                    }`}
                  >
                    Due in {r.daysRemaining} days
                  </span>

                  <button
                    type="button"
                    onClick={() => handleSnooze(r.id)}
                    className="px-2.5 py-1.5 rounded-[9px] border border-[#06395F]/15 bg-white text-xs font-semibold text-[#06395F] hover:bg-slate-50 transition"
                  >
                    Snooze 7d
                  </button>
                </>
              ) : (
                <StatusBadge variant="success" text="Completed" />
              )}

              <button
                type="button"
                onClick={() => handleDelete(r.id)}
                className="w-8 h-8 rounded-[9px] border border-[#06395F]/15 bg-white text-rose-500 hover:bg-rose-50 flex items-center justify-center transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Reminder Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[13px] border border-white/80 bg-white/95 p-6 shadow-2xl backdrop-blur-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#06395F]/10">
              <h2 className="font-bold text-base text-[#06395F]">Add pet reminder</h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs text-[#06395F]">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold">Select companion pet</label>
                  <select
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    className="w-full h-10 px-3 rounded-[11px] border border-[#06395F]/20 bg-white text-xs text-[#06395F]"
                  >
                    <option value="Milo">Milo (Golden Retriever)</option>
                    <option value="Luna">Luna (Persian Cat)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold">Reminder category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-[11px] border border-[#06395F]/20 bg-white text-xs text-[#06395F]"
                  >
                    <option value="Vaccination">Vaccination booster</option>
                    <option value="Deworming">Deworming tablet</option>
                    <option value="Medication">Medication / drops</option>
                    <option value="Grooming">Grooming & bath</option>
                    <option value="Clinic visit">Clinic checkup</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold">Reminder title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. DHPPi 7-in-1 Booster"
                  className="w-full h-10 px-3 rounded-[11px] border border-[#06395F]/20 text-xs text-[#06395F] focus:outline-none focus:ring-2 focus:ring-[#0D8BE0]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold">Due date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-[11px] border border-[#06395F]/20 text-xs text-[#06395F] focus:outline-none focus:ring-2 focus:ring-[#0D8BE0]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold">Notes / dosage instructions (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Give 1 tablet after food in the morning..."
                  rows={2}
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
                  className="px-4 py-2 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white text-xs font-semibold shadow-xs hover:-translate-y-0.5 transition"
                >
                  Set reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
