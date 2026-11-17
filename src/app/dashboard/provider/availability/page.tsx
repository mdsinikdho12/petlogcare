"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Clock,
  Plus,
  Trash2,
  Copy,
  Calendar,
  Save,
  X,
  Sparkles,
  Loader2,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";

/* ---------- Liquid Glass Tokens (Design System v2) ---------- */
const glass =
  "rounded-[13px] border border-white/80 bg-white/55 backdrop-blur-xl backdrop-saturate-150 " +
  "shadow-[0_8px_30px_rgba(1,95,160,0.10),inset_0_1px_0_rgba(255,255,255,0.95)]";

const primaryBtn =
  "inline-flex h-10 items-center justify-center gap-2 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] " +
  "px-5 text-xs font-semibold text-white shadow-[0_4px_14px_rgba(13,150,230,0.30)] " +
  "transition duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-60";

const secondaryBtn =
  "inline-flex h-10 items-center justify-center gap-2 rounded-[11px] border border-[#06395F]/15 bg-white " +
  "px-4 text-xs font-semibold text-[#06395F] shadow-2xs transition hover:bg-slate-50";

interface TimeRange {
  id: string;
  startTime: string;
  endTime: string;
}

interface DayAvailability {
  dayOfWeek: number;
  dayName: string;
  isEnabled: boolean;
  timeRanges: TimeRange[];
}

interface DateOverride {
  id?: string;
  _id?: string;
  date: string;
  reason?: string;
  isAvailable: boolean;
  timeRanges?: { startTime: string; endTime: string }[];
}

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const DEFAULT_DAYS: DayAvailability[] = DAY_NAMES.map((name, i) => ({
  dayOfWeek: i,
  dayName: name,
  isEnabled: i !== 5, // Friday closed by default in BD
  timeRanges: [{ id: `${i}-1`, startTime: "09:00", endTime: "18:00" }],
}));

export default function ProviderAvailabilityPage() {
  const [activeTab, setActiveTab] = useState<"weekly" | "overrides">("weekly");
  const [schedule, setSchedule] = useState<DayAvailability[]>(DEFAULT_DAYS);
  const [overrides, setOverrides] = useState<DateOverride[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Overrides modal state
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [overrideDate, setOverrideDate] = useState("");
  const [overrideReason, setOverrideReason] = useState("");
  const [savingOverride, setSavingOverride] = useState(false);

  useEffect(() => {
    async function loadAvailability() {
      try {
        setLoading(true);
        const [wRes, oRes] = await Promise.allSettled([
          apiClient.get("/availability/me"),
          apiClient.get("/availability/me/overrides"),
        ]);

        if (wRes.status === "fulfilled" && wRes.value.data?.data) {
          const rawDays = Array.isArray(wRes.value.data.data)
            ? wRes.value.data.data
            : wRes.value.data.data.days || [];

          if (rawDays.length > 0) {
            const mapped: DayAvailability[] = DAY_NAMES.map((name, i) => {
              const found = rawDays.find((d: any) => d.dayOfWeek === i);
              if (found) {
                return {
                  dayOfWeek: i,
                  dayName: name,
                  isEnabled: Boolean(found.isEnabled),
                  timeRanges: Array.isArray(found.timeRanges) && found.timeRanges.length > 0
                    ? found.timeRanges.map((r: any, rIdx: number) => ({
                        id: `${i}-${rIdx}-${Date.now()}`,
                        startTime: r.startTime || "09:00",
                        endTime: r.endTime || "18:00",
                      }))
                    : [{ id: `${i}-1`, startTime: "09:00", endTime: "18:00" }],
                };
              }
              return {
                dayOfWeek: i,
                dayName: name,
                isEnabled: i !== 5,
                timeRanges: [{ id: `${i}-1`, startTime: "09:00", endTime: "18:00" }],
              };
            });
            setSchedule(mapped);
          }
        }

        if (oRes.status === "fulfilled" && oRes.value.data?.data) {
          const rawOverrides = Array.isArray(oRes.value.data.data)
            ? oRes.value.data.data
            : oRes.value.data.data.overrides || [];
          setOverrides(rawOverrides);
        }
      } catch {
        // Fallback initialized cleanly
      } finally {
        setLoading(false);
      }
    }

    loadAvailability();
  }, []);

  const toggleDay = (dayIndex: number) => {
    setSchedule((prev) =>
      prev.map((d) =>
        d.dayOfWeek === dayIndex ? { ...d, isEnabled: !d.isEnabled } : d
      )
    );
  };

  const addTimeRange = (dayIndex: number) => {
    setSchedule((prev) =>
      prev.map((d) => {
        if (d.dayOfWeek !== dayIndex) return d;
        const newRange: TimeRange = {
          id: `${dayIndex}-${Date.now()}`,
          startTime: "14:00",
          endTime: "18:00",
        };
        return { ...d, timeRanges: [...d.timeRanges, newRange] };
      })
    );
  };

  const removeTimeRange = (dayIndex: number, rangeId: string) => {
    setSchedule((prev) =>
      prev.map((d) => {
        if (d.dayOfWeek !== dayIndex) return d;
        return {
          ...d,
          timeRanges: d.timeRanges.filter((r) => r.id !== rangeId),
        };
      })
    );
  };

  const updateRange = (
    dayIndex: number,
    rangeId: string,
    field: "startTime" | "endTime",
    val: string
  ) => {
    setSchedule((prev) =>
      prev.map((d) => {
        if (d.dayOfWeek !== dayIndex) return d;
        return {
          ...d,
          timeRanges: d.timeRanges.map((r) =>
            r.id === rangeId ? { ...r, [field]: val } : r
          ),
        };
      })
    );
  };

  const copyToAllWeekdays = (sourceDayIndex: number) => {
    const source = schedule.find((d) => d.dayOfWeek === sourceDayIndex);
    if (!source) return;

    setSchedule((prev) =>
      prev.map((d) => {
        if (d.dayOfWeek === 5) return d; // Keep Friday distinct
        return {
          ...d,
          isEnabled: source.isEnabled,
          timeRanges: source.timeRanges.map((r, i) => ({
            ...r,
            id: `${d.dayOfWeek}-${i}-${Date.now()}`,
          })),
        };
      })
    );
    toast.success(`Copied ${source.dayName}'s schedule to all weekdays!`);
  };

  const handleSaveSchedule = async () => {
    try {
      setSaving(true);
      const payload = {
        days: schedule.map((d) => ({
          dayOfWeek: d.dayOfWeek,
          isEnabled: d.isEnabled,
          timeRanges: d.isEnabled
            ? d.timeRanges.map((r) => ({
                startTime: r.startTime,
                endTime: r.endTime,
              }))
            : [],
        })),
      };

      await apiClient.put("/availability/me", payload);
      toast.success("Weekly availability saved to database!", {
        description: "Patient booking slots are synchronized with your hours.",
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save weekly schedule");
    } finally {
      setSaving(false);
    }
  };

  const handleAddOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideDate) {
      toast.error("Please pick a date");
      return;
    }

    try {
      setSavingOverride(true);
      await apiClient.put(`/availability/me/overrides/${overrideDate}`, {
        isAvailable: false,
        reason: overrideReason || "Clinic Closed / Holiday",
      });

      toast.success("Date override saved!");
      setOverrideDate("");
      setOverrideReason("");
      setOverrideModalOpen(false);

      // Refresh overrides
      const res = await apiClient.get("/availability/me/overrides");
      if (res.data?.data) {
        setOverrides(
          Array.isArray(res.data.data) ? res.data.data : res.data.data.overrides || []
        );
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add date override");
    } finally {
      setSavingOverride(false);
    }
  };

  const removeOverride = async (dateStr: string) => {
    try {
      await apiClient.delete(`/availability/me/overrides/${dateStr}`);
      toast.info("Override removed");
      setOverrides((prev) => prev.filter((o) => o.date !== dateStr));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to remove date override");
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[8px] border border-sky-200 bg-sky-50 text-sky-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#0D8BE0]" />
            <span>Smart Availability Engine</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#06395F]">
            Operating Hours & Availability
          </h1>
          <p className="text-xs sm:text-sm text-[#0B4C7A]/75 mt-0.5">
            Configure weekly operational hours, split shifts, and block specific dates for holidays.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveSchedule}
          disabled={saving || loading}
          className={primaryBtn}
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Schedule</span>
            </>
          )}
        </button>
      </div>

      {/* Segmented Controller */}
      <div className="flex items-center gap-2 p-1.5 rounded-[13px] bg-sky-100/60 border border-white/80 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("weekly")}
          className={`px-4 py-2 rounded-[11px] text-xs font-semibold transition ${
            activeTab === "weekly"
              ? "bg-gradient-to-r from-[#2FB0FF] to-[#0D8BE0] text-white shadow-sm"
              : "bg-transparent text-[#06395F]/80 hover:bg-white/40"
          }`}
        >
          Weekly Recurring Schedule
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("overrides")}
          className={`px-4 py-2 rounded-[11px] text-xs font-semibold transition ${
            activeTab === "overrides"
              ? "bg-gradient-to-r from-[#2FB0FF] to-[#0D8BE0] text-white shadow-sm"
              : "bg-transparent text-[#06395F]/80 hover:bg-white/40"
          }`}
        >
          Date Overrides & Holidays ({overrides.length})
        </button>
      </div>

      {/* Tab 1: Weekly Schedule Builder */}
      {activeTab === "weekly" && (
        <div className={`${glass} p-6 sm:p-8 space-y-4`}>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-[#06395F]/60">
              <Loader2 className="w-6 h-6 animate-spin text-[#0D8BE0] mb-2" />
              <p className="text-xs">Loading availability settings...</p>
            </div>
          ) : (
            <div className="divide-y divide-[#06395F]/10 rounded-[13px] border border-white/80 bg-white/70 overflow-hidden shadow-2xs">
              {schedule.map((day) => (
                <div
                  key={day.dayOfWeek}
                  className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs"
                >
                  {/* Day Switcher */}
                  <div className="flex items-center gap-3 w-40 shrink-0">
                    <input
                      type="checkbox"
                      id={`day-${day.dayOfWeek}`}
                      checked={day.isEnabled}
                      onChange={() => toggleDay(day.dayOfWeek)}
                      className="w-4 h-4 rounded text-[#0D8BE0] focus:ring-[#0D8BE0]"
                    />
                    <label
                      htmlFor={`day-${day.dayOfWeek}`}
                      className="font-bold text-sm text-[#06395F] cursor-pointer"
                    >
                      {day.dayName}
                    </label>
                  </div>

                  {/* Shifts / Time Ranges */}
                  <div className="flex-1 min-w-0">
                    {day.isEnabled ? (
                      <div className="flex flex-wrap items-center gap-2">
                        {day.timeRanges.map((range) => (
                          <div
                            key={range.id}
                            className="flex items-center gap-1.5 p-1.5 rounded-[11px] bg-white border border-[#06395F]/15 shadow-2xs"
                          >
                            <input
                              type="time"
                              value={range.startTime}
                              onChange={(e) =>
                                updateRange(
                                  day.dayOfWeek,
                                  range.id,
                                  "startTime",
                                  e.target.value
                                )
                              }
                              className="px-2 py-1 rounded-[8px] border border-gray-200 text-xs text-[#06395F] outline-none"
                            />
                            <span className="text-gray-400 font-bold">-</span>
                            <input
                              type="time"
                              value={range.endTime}
                              onChange={(e) =>
                                updateRange(
                                  day.dayOfWeek,
                                  range.id,
                                  "endTime",
                                  e.target.value
                                )
                              }
                              className="px-2 py-1 rounded-[8px] border border-gray-200 text-xs text-[#06395F] outline-none"
                            />
                            {day.timeRanges.length > 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  removeTimeRange(day.dayOfWeek, range.id)
                                }
                                className="p-1 text-gray-400 hover:text-rose-500 rounded"
                                title="Delete shift"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => addTimeRange(day.dayOfWeek)}
                          className="p-1.5 rounded-[11px] border border-dashed border-[#0D8BE0]/50 text-[#0D8BE0] hover:bg-sky-50 text-[11px] font-semibold flex items-center gap-1"
                          title="Add split shift"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Shift</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-[#0B4C7A]/50 italic">
                        Unavailable / Clinic Closed
                      </span>
                    )}
                  </div>

                  {/* Quick Action: Copy to other days */}
                  {day.isEnabled && (
                    <button
                      type="button"
                      onClick={() => copyToAllWeekdays(day.dayOfWeek)}
                      className="p-1.5 rounded-[11px] text-[#0B4C7A]/70 hover:text-[#0D8BE0] hover:bg-sky-50 transition-colors flex items-center gap-1 text-[11px] shrink-0"
                      title="Copy this day's hours to all weekdays"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy to weekdays</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Overrides & Holiday Blocker */}
      {activeTab === "overrides" && (
        <div className={`${glass} p-6 sm:p-8 space-y-6`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-bold text-[#06395F]">
                Blocked Dates & Special Closures
              </h2>
              <p className="text-xs text-[#0B4C7A]/75">
                Add public holidays or personal days off when clients cannot book appointments.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setOverrideModalOpen(true)}
              className={primaryBtn}
            >
              <Plus className="w-4 h-4" />
              <span>Add Day Off</span>
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-[#06395F]/60">
              <Loader2 className="w-6 h-6 animate-spin text-[#0D8BE0] mb-2" />
              <p className="text-xs">Loading holiday overrides...</p>
            </div>
          ) : overrides.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-[13px] bg-sky-50 text-[#0D8BE0] flex items-center justify-center mb-3">
                <Calendar className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-[#06395F]">No date overrides set</p>
              <p className="text-xs text-[#0B4C7A]/70 mt-1 max-w-sm">
                Your practice follows the weekly recurring schedule above. Block holidays or vacation days as needed.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/70 rounded-[13px] border border-white/80 bg-white/70 overflow-hidden text-xs shadow-2xs">
              {overrides.map((ov) => {
                const dateKey = ov.date;
                return (
                  <div
                    key={dateKey}
                    className="p-4 flex items-center justify-between text-[#06395F]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-[8px] bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-sm">{dateKey}</div>
                        <div className="text-[11px] text-[#0B4C7A]/70">
                          {ov.reason || "Practice Closed"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-0.5 rounded-[8px] bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-semibold">
                        Full Day Off
                      </span>

                      <button
                        type="button"
                        onClick={() => removeOverride(dateKey)}
                        className="p-1.5 rounded-[8px] text-rose-500 hover:bg-rose-50 transition"
                        title="Remove override"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Add Date Override Modal */}
      {overrideModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-[13px] border border-white/80 bg-white/95 backdrop-blur-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#06395F]/10">
              <h3 className="font-display text-base font-bold text-[#06395F]">
                Add Holiday / Day Off
              </h3>
              <button
                onClick={() => setOverrideModalOpen(false)}
                className="p-1 rounded-[8px] text-[#06395F]/60 hover:text-[#06395F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddOverride} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#06395F] mb-1">
                  Select Date *
                </label>
                <input
                  type="date"
                  required
                  value={overrideDate}
                  onChange={(e) => setOverrideDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-[11px] border border-[#06395F]/20 bg-white text-xs text-[#06395F] outline-none focus:ring-2 focus:ring-[#0D8BE0]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#06395F] mb-1">
                  Reason (e.g. Eid-ul-Fitr, Clinic Renovation)
                </label>
                <input
                  type="text"
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="e.g. National Holiday, Staff Retreat"
                  className="w-full px-3 py-2 rounded-[11px] border border-[#06395F]/20 bg-white text-xs text-[#06395F] outline-none focus:ring-2 focus:ring-[#0D8BE0]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOverrideModalOpen(false)}
                  className={secondaryBtn}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingOverride}
                  className={primaryBtn}
                >
                  {savingOverride ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Block Date"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
