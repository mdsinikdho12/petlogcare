"use client";

import React, { useState, useEffect } from "react";
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
  RotateCw,
  PlusCircle,
} from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { apiClient } from "@/lib/api/client";

interface PetReminder {
  id: string;
  petName: string;
  title: string;
  dueDate: string;
  dueTime?: string;
  isCompleted: boolean;
  notes?: string;
}

export default function OwnerRemindersPage() {
  const [reminders, setReminders] = useState<PetReminder[]>([]);
  const [pets, setPets] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [selectedPetId, setSelectedPetId] = useState("");
  const [dueDate, setDueDate] = useState("2026-12-05");
  const [dueTime, setDueTime] = useState("10:00");
  const [notes, setNotes] = useState("");

  const fetchRemindersAndPets = async () => {
    try {
      setLoading(true);
      const [remRes, petsRes] = await Promise.allSettled([
        apiClient.get("/reminders/me"),
        apiClient.get("/pets"),
      ]);

      if (petsRes.status === "fulfilled" && petsRes.value.data?.data) {
        const rawPets = petsRes.value.data.data;
        const normalizedPets = rawPets.map((p: any) => ({
          id: p._id || p.id,
          name: p.name,
        }));
        setPets(normalizedPets);
        if (normalizedPets.length > 0 && !selectedPetId) {
          setSelectedPetId(normalizedPets[0].id);
        }
      }

      if (remRes.status === "fulfilled" && remRes.value.data?.data) {
        const raw = remRes.value.data.data;
        if (Array.isArray(raw)) {
          const mapped: PetReminder[] = raw.map((r: any) => ({
            id: r._id || r.id,
            petName: r.pet?.name || "Companion Pet",
            title: r.title,
            dueDate: r.dueDate || "2026-12-01",
            dueTime: r.dueTime || "09:00",
            isCompleted: r.status === "DONE" || r.isCompleted || false,
            notes: r.notes,
          }));
          setReminders(mapped);
        }
      }
    } catch (err) {
      console.error("Failed to load reminders from API:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRemindersAndPets();
  }, []);

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) {
      toast.error("Please provide title and due date");
      return;
    }

    try {
      setSaving(true);
      const payload: Record<string, any> = {
        title: title.trim(),
        dueDate,
        dueTime: dueTime || "09:00",
        notes: notes.trim() || undefined,
      };
      if (selectedPetId) {
        payload.petId = selectedPetId;
      }

      await apiClient.post("/reminders", payload);
      toast.success("Reminder added to schedule!");
      setIsModalOpen(false);
      setTitle("");
      setNotes("");
      fetchRemindersAndPets();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create reminder");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleDone = async (id: string, currentlyDone: boolean) => {
    try {
      if (!currentlyDone) {
        await apiClient.patch(`/reminders/${id}/done`, {});
        toast.success("Reminder marked as completed!");
      } else {
        await apiClient.patch(`/reminders/${id}/reopen`, {});
        toast.info("Reminder reopened.");
      }
      fetchRemindersAndPets();
    } catch (err: any) {
      // optimistic toggle
      setReminders((prev) =>
        prev.map((r) => (r.id === id ? { ...r, isCompleted: !currentlyDone } : r))
      );
      toast.info("Reminder updated.");
    }
  };

  const handleDeleteReminder = async (id: string) => {
    if (confirm("Delete this reminder?")) {
      try {
        await apiClient.delete(`/reminders/${id}`);
        toast.info("Reminder removed");
        fetchRemindersAndPets();
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to delete");
      }
    }
  };

  const handleSeedReminders = async () => {
    try {
      setSeeding(true);
      const petId = pets[0]?.id;
      await apiClient.post("/reminders", {
        title: "Rabies Multi-booster Vaccination",
        dueDate: "2026-12-15",
        dueTime: "10:30",
        notes: "Mandatory annual booster at Central Pet Hospital.",
        petId: petId || undefined,
      });

      await apiClient.post("/reminders", {
        title: "Broad-spectrum deworming tablet",
        dueDate: "2026-12-22",
        dueTime: "09:00",
        notes: "Administer 1 tablet with morning meal.",
        petId: petId || undefined,
      });

      toast.success("Seeded reminders into your database!");
      fetchRemindersAndPets();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to seed reminders");
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
            <span>Preventative care calendar</span>
          </div>
          <h1 className="font-display text-2xl sm:text-[28px] font-bold tracking-tight text-[#06395F]">
            Booster &amp; health reminders
          </h1>
          <p className="text-[13px] sm:text-sm text-[#06395F]/80 mt-1 max-w-xl font-normal leading-relaxed">
            Automated notifications for vaccines, flea &amp; tick doses, deworming cycles and upcoming checkups.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchRemindersAndPets}
            disabled={loading}
            className="p-2.5 rounded-[11px] bg-white border border-[#06395F]/15 text-[#06395F] hover:bg-slate-50 transition shadow-2xs"
            title="Refresh reminders"
          >
            <RotateCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] px-4 py-2.5 text-[13px] font-semibold text-white shadow-[0_4px_14px_rgba(13,150,230,0.30)] hover:-translate-y-0.5 active:translate-y-0 transition shrink-0 whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create reminder</span>
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && reminders.length === 0 && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-[13px] bg-white/85 border border-[#06395F]/10 p-5 space-y-3 animate-pulse shadow-xs"
            >
              <div className="h-5 bg-slate-200 rounded w-1/3" />
              <div className="h-4 bg-slate-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && reminders.length === 0 && (
        <div className="rounded-[13px] bg-white/85 border border-[#06395F]/10 p-10 sm:p-14 text-center space-y-4 shadow-[0_1px_2px_rgba(6,57,95,0.06)]">
          <div className="w-14 h-14 mx-auto rounded-[13px] bg-sky-50 text-[#0D8BE0] flex items-center justify-center border border-sky-100">
            <Bell className="w-7 h-7" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="font-display text-lg font-bold text-[#06395F]">
              All pet booster schedules up to date
            </h3>
            <p className="text-[13px] text-[#06395F]/75 leading-relaxed font-normal">
              You have no pending medication or vaccination reminders right now. Add a custom reminder or seed a sample schedule.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] px-5 py-2.5 text-[13px] font-semibold text-white shadow-xs hover:-translate-y-0.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add reminder</span>
            </button>

            <button
              type="button"
              onClick={handleSeedReminders}
              disabled={seeding}
              className="inline-flex items-center gap-2 rounded-[11px] bg-sky-50 text-[#0D8BE0] border border-sky-200 px-4 py-2.5 text-[13px] font-semibold hover:bg-sky-100 transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{seeding ? "Saving to database..." : "Seed sample reminders"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Reminders List */}
      {!loading && reminders.length > 0 && (
        <div className="space-y-3">
          {reminders.map((r) => (
            <div
              key={r.id}
              className={`rounded-[13px] bg-white/85 border border-[#06395F]/10 p-4 sm:p-5 shadow-[0_1px_2px_rgba(6,57,95,0.06)] hover:border-[#0D8BE0]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                r.isCompleted ? "opacity-60 bg-white/50" : ""
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <button
                  type="button"
                  onClick={() => handleToggleDone(r.id, r.isCompleted)}
                  className={`w-7 h-7 rounded-[8px] border flex items-center justify-center shrink-0 mt-0.5 transition ${
                    r.isCompleted
                      ? "bg-emerald-500 border-emerald-600 text-white"
                      : "border-[#06395F]/20 hover:border-[#0D8BE0]"
                  }`}
                  title={r.isCompleted ? "Reopen reminder" : "Mark as done"}
                >
                  {r.isCompleted && <CheckCircle2 className="w-4 h-4" />}
                </button>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3
                      className={`font-display text-[15px] font-bold text-[#06395F] truncate ${
                        r.isCompleted ? "line-through text-[#06395F]/50" : ""
                      }`}
                    >
                      {r.title}
                    </h3>
                    <StatusBadge
                      status={r.isCompleted ? "COMPLETED" : "PENDING"}
                      label={r.isCompleted ? "Done" : "Due"}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[12px] text-[#06395F]/75 mt-0.5">
                    <span className="font-medium text-[#0D8BE0]">For {r.petName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#06395F]/50" />
                      <span>{r.dueDate}</span>
                    </span>
                    {r.dueTime && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#06395F]/50" />
                          <span>{r.dueTime}</span>
                        </span>
                      </>
                    )}
                  </div>

                  {r.notes && (
                    <p className="text-[12px] text-[#06395F]/70 mt-1 line-clamp-1">
                      {r.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleDeleteReminder(r.id)}
                  className="p-1.5 rounded-[8px] text-[#06395F]/40 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Delete reminder"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Reminder Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-[13px] border border-white/80 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#06395F]/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[8px] bg-sky-500/15 text-[#0D8BE0] flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <h3 className="font-display text-base font-bold text-[#06395F]">
                  Add pet health reminder
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-[8px] hover:bg-slate-100 text-[#06395F]/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateReminder} className="space-y-3.5 text-[13px]">
              <div>
                <label className="block font-semibold text-[#06395F] mb-1">
                  Reminder title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Annual Rabies Booster, Heartworm pill"
                  className="w-full px-3.5 py-2 rounded-[11px] border border-[#06395F]/15 focus:outline-none focus:border-[#0D8BE0] text-[#06395F]"
                />
              </div>

              {pets.length > 0 && (
                <div>
                  <label className="block font-semibold text-[#06395F] mb-1">
                    Select companion pet
                  </label>
                  <select
                    value={selectedPetId}
                    onChange={(e) => setSelectedPetId(e.target.value)}
                    className="w-full px-3 py-2 rounded-[11px] border border-[#06395F]/15 bg-white text-[#06395F]"
                  >
                    {pets.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#06395F] mb-1">
                    Due date *
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-[11px] border border-[#06395F]/15 focus:outline-none focus:border-[#0D8BE0] text-[#06395F]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#06395F] mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-[11px] border border-[#06395F]/15 focus:outline-none focus:border-[#0D8BE0] text-[#06395F]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#06395F] mb-1">
                  Doctor notes / instructions
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Give 1 tablet with meal; monitor for fever."
                  className="w-full px-3.5 py-2 rounded-[11px] border border-[#06395F]/15 focus:outline-none focus:border-[#0D8BE0] text-[#06395F]"
                />
              </div>

              <div className="pt-3 border-t border-[#06395F]/10 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-[11px] border border-[#06395F]/15 text-[#06395F] font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white font-semibold shadow-xs"
                >
                  {saving ? "Saving..." : "Save reminder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
