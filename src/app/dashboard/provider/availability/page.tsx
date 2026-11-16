"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Clock,
  Plus,
  Trash2,
  Copy,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Save,
  AlertCircle,
  X,
} from "lucide-react";

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
  id: string;
  date: string;
  reason: string;
  isAvailable: boolean;
  timeRange?: string;
}

const DEFAULT_DAYS: DayAvailability[] = [
  {
    dayOfWeek: 0,
    dayName: "Sunday",
    isEnabled: true,
    timeRanges: [
      { id: "0-1", startTime: "09:00", endTime: "13:00" },
      { id: "0-2", startTime: "16:00", endTime: "20:00" },
    ],
  },
  {
    dayOfWeek: 1,
    dayName: "Monday",
    isEnabled: true,
    timeRanges: [{ id: "1-1", startTime: "09:00", endTime: "18:00" }],
  },
  {
    dayOfWeek: 2,
    dayName: "Tuesday",
    isEnabled: true,
    timeRanges: [{ id: "2-1", startTime: "09:00", endTime: "18:00" }],
  },
  {
    dayOfWeek: 3,
    dayName: "Wednesday",
    isEnabled: true,
    timeRanges: [{ id: "3-1", startTime: "09:00", endTime: "18:00" }],
  },
  {
    dayOfWeek: 4,
    dayName: "Thursday",
    isEnabled: true,
    timeRanges: [{ id: "4-1", startTime: "09:00", endTime: "18:00" }],
  },
  {
    dayOfWeek: 5,
    dayName: "Friday",
    isEnabled: false,
    timeRanges: [{ id: "5-1", startTime: "15:00", endTime: "20:00" }],
  },
  {
    dayOfWeek: 6,
    dayName: "Saturday",
    isEnabled: true,
    timeRanges: [{ id: "6-1", startTime: "10:00", endTime: "19:00" }],
  },
];

export default function ProviderAvailabilityPage() {
  const [activeTab, setActiveTab] = useState<"weekly" | "overrides">("weekly");
  const [schedule, setSchedule] = useState<DayAvailability[]>(DEFAULT_DAYS);
  const [saving, setSaving] = useState(false);

  // Overrides state
  const [overrides, setOverrides] = useState<DateOverride[]>([
    {
      id: "ov-1",
      date: "2026-12-16",
      reason: "Victory Day Bangladesh",
      isAvailable: false,
    },
    {
      id: "ov-2",
      date: "2026-12-25",
      reason: "Christmas Holiday",
      isAvailable: false,
    },
  ]);

  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [overrideDate, setOverrideDate] = useState("");
  const [overrideReason, setOverrideReason] = useState("");

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
        // Only apply to weekdays (Sunday to Thursday in BD, or Monday to Thursday)
        if (d.dayOfWeek === 5) return d; // keep Friday as is
        return {
          ...d,
          isEnabled: source.isEnabled,
          timeRanges: source.timeRanges.map((r, i) => ({
            ...r,
            id: `${d.dayOfWeek}-${i}`,
          })),
        };
      })
    );
    toast.success(`Copied ${source.dayName}'s schedule to all weekdays!`);
  };

  const handleSaveSchedule = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Weekly availability saved!", {
        description: "Patient booking slots are now synchronized with your hours.",
      });
    }, 800);
  };

  const handleAddOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideDate) return;

    const newOv: DateOverride = {
      id: Math.random().toString(),
      date: overrideDate,
      reason: overrideReason || "Practice Closed",
      isAvailable: false,
    };

    setOverrides((prev) => [newOv, ...prev]);
    toast.success("Date override added!");
    setOverrideDate("");
    setOverrideReason("");
    setOverrideModalOpen(false);
  };

  const removeOverride = (id: string) => {
    setOverrides((prev) => prev.filter((o) => o.id !== id));
    toast.info("Override removed");
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-sky-200 bg-sky-50 text-sky-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cal.com Scheduling Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#06395F]">
            Operating Hours & Availability
          </h1>
          <p className="text-xs sm:text-sm text-[#0B4C7A]/75 mt-0.5 font-light">
            Set your weekly working shifts, split shifts, and block holidays when the clinic is closed.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveSchedule}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#2FB0FF] to-[#0D8BE0] hover:from-[#259DE6] hover:to-[#0A77C2] text-white text-xs font-semibold shadow-md shadow-[#0D8BE0]/30 transition-all shrink-0"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Schedule</span>
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("weekly")}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            activeTab === "weekly"
              ? "bg-[#0D8BE0] text-white shadow-sm"
              : "bg-white/60 text-[#06395F]/80 border border-white/80 hover:bg-white"
          }`}
        >
          Weekly Recurring Schedule
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("overrides")}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            activeTab === "overrides"
              ? "bg-[#0D8BE0] text-white shadow-sm"
              : "bg-white/60 text-[#06395F]/80 border border-white/80 hover:bg-white"
          }`}
        >
          Date Overrides & Holidays ({overrides.length})
        </button>
      </div>

      {/* Tab 1: Weekly Schedule Builder */}
      {activeTab === "weekly" && (
        <div className="rounded-[2.5rem] border border-white/70 bg-white/55 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_10px_40px_rgba(1,95,160,0.1),inset_0_1px_0_rgba(255,255,255,0.9)] space-y-4">
          <div className="divide-y divide-[#06395F]/10 rounded-2xl border border-white/80 bg-white/60 overflow-hidden">
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
                          className="flex items-center gap-1.5 p-1.5 rounded-xl bg-white border border-white/80 shadow-xs"
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
                            className="px-1.5 py-1 rounded border border-gray-200 text-xs text-[#06395F] outline-none"
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
                            className="px-1.5 py-1 rounded border border-gray-200 text-xs text-[#06395F] outline-none"
                          />
                          {day.timeRanges.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                removeTimeRange(day.dayOfWeek, range.id)
                              }
                              className="p-1 text-gray-400 hover:text-rose-500"
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
                        className="p-1.5 rounded-xl border border-dashed border-[#0D8BE0]/50 text-[#0D8BE0] hover:bg-sky-50 text-[11px] font-semibold flex items-center gap-1"
                        title="Add split shift"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Shift</span>
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-text-secondary italic">
                      Unavailable / Practice Closed
                    </span>
                  )}
                </div>

                {/* Quick Action: Copy to other days */}
                {day.isEnabled && (
                  <button
                    type="button"
                    onClick={() => copyToAllWeekdays(day.dayOfWeek)}
                    className="p-1.5 rounded-xl text-[#0B4C7A]/70 hover:text-[#0D8BE0] hover:bg-sky-50 transition-colors flex items-center gap-1 text-[11px] shrink-0"
                    title="Copy this day's hours to all weekdays"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy to weekdays</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Overrides & Holiday Blocker */}
      {activeTab === "overrides" && (
        <div className="rounded-[2.5rem] border border-white/70 bg-white/55 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_10px_40px_rgba(1,95,160,0.1),inset_0_1px_0_rgba(255,255,255,0.9)] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#06395F]">
                Blocked Dates & Special Closures
              </h2>
              <p className="text-xs text-[#0B4C7A]/75 font-light">
                Add public holidays or personal days off when clients cannot book appointments.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setOverrideModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0D8BE0] text-white text-xs font-semibold shadow-xs hover:bg-[#0A77C2]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Day Off</span>
            </button>
          </div>

          <div className="divide-y divide-white/70 rounded-2xl border border-white/80 bg-white/60 overflow-hidden text-xs">
            {overrides.map((ov) => (
              <div
                key={ov.id}
                className="p-4 flex items-center justify-between text-[#06395F]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">{ov.date}</div>
                    <div className="text-[11px] text-[#0B4C7A]/70">
                      {ov.reason}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-semibold">
                    Full Day Off
                  </span>

                  <button
                    type="button"
                    onClick={() => removeOverride(ov.id)}
                    className="p-1 rounded-lg text-rose-500 hover:bg-rose-50"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Date Override Modal */}
      {overrideModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-[2.5rem] border border-white/80 bg-white/95 backdrop-blur-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-[#06395F]/10">
              <h3 className="text-base font-bold text-[#06395F]">
                Add Holiday / Day Off
              </h3>
              <button
                onClick={() => setOverrideModalOpen(false)}
                className="p-1 rounded-full text-[#06395F] hover:bg-black/5"
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
                  className="w-full px-3 py-2 rounded-xl border border-surface-200 bg-white text-xs text-[#06395F] outline-none focus:ring-2 focus:ring-[#0D8BE0]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#06395F] mb-1">
                  Reason (e.g. Eid Holiday, Clinic Renovation)
                </label>
                <input
                  type="text"
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="Clinic maintenance day"
                  className="w-full px-3 py-2 rounded-xl border border-surface-200 bg-white text-xs text-[#06395F] outline-none focus:ring-2 focus:ring-[#0D8BE0]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOverrideModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#0D8BE0] text-white text-xs font-semibold shadow-xs"
                >
                  Block Date
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
