"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarCheck2,
  Clock,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  Play,
  Check,
  X,
  Sparkles,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

interface ProviderAppointment {
  id: string;
  clientName: string;
  clientPhone: string;
  petName: string;
  petSpecies: string;
  serviceTitle: string;
  date: string;
  timeSlot: string;
  status: "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  paymentPlan: "PAID_ONLINE" | "COLLECT_CASH_AT_CLINIC";
  collectAmountBDT: number;
}

export default function ProviderBookingsPage() {
  const [appointments, setAppointments] = useState<ProviderAppointment[]>([
    {
      id: "app-1",
      clientName: "Rafiqul Islam",
      clientPhone: "+8801712345678",
      petName: "Miu Miu",
      petSpecies: "Persian Cat",
      serviceTitle: "Comprehensive Veterinary Consultation",
      date: "2026-11-20",
      timeSlot: "10:30 AM",
      status: "CONFIRMED",
      paymentPlan: "PAID_ONLINE",
      collectAmountBDT: 0,
    },
    {
      id: "app-2",
      clientName: "Nusrat Jahan",
      clientPhone: "+8801812345678",
      petName: "Rocky",
      petSpecies: "Golden Retriever",
      serviceTitle: "Full Medicated Grooming & De-Shedding",
      date: "2026-11-24",
      timeSlot: "04:00 PM",
      status: "CONFIRMED",
      paymentPlan: "COLLECT_CASH_AT_CLINIC",
      collectAmountBDT: 1440,
    },
  ]);

  const updateStatus = (
    id: string,
    newStatus: ProviderAppointment["status"]
  ) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    toast.success(`Appointment status updated to ${newStatus}`);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-sky-200 bg-sky-50 text-sky-800 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Patient Flow Console</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#06395F]">
          Patient Appointments
        </h1>
        <p className="text-xs sm:text-sm text-[#0B4C7A]/75 mt-0.5 font-light">
          Manage daily checkups, patient intake, in-clinic consultations, and cash settlements.
        </p>
      </div>

      {/* Appointment Cards */}
      <div className="space-y-4">
        {appointments.map((app) => (
          <div
            key={app.id}
            className="rounded-[2.5rem] border border-white/75 bg-white/60 backdrop-blur-2xl p-6 shadow-[0_10px_35px_rgba(1,95,160,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-[#06395F]">
                    {app.serviceTitle}
                  </h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      app.status === "CONFIRMED"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : app.status === "IN_PROGRESS"
                        ? "bg-sky-50 text-sky-700 border-sky-200"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>

                <div className="text-xs text-[#0B4C7A]/80 font-medium">
                  Patient: <strong>{app.petName}</strong> ({app.petSpecies}) • Owner: {app.clientName} ({app.clientPhone})
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/80 border border-white text-right sm:text-left space-y-0.5 shadow-xs shrink-0">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#06395F]">
                  <CalendarCheck2 className="w-4 h-4 text-[#0D8BE0]" />
                  <span>{app.date}</span>
                </div>
                <div className="text-xs text-[#0B4C7A]/80 font-semibold pl-5">
                  {app.timeSlot}
                </div>
              </div>
            </div>

            {/* Billing Notice */}
            <div className="p-3 rounded-2xl bg-white/70 border border-white text-xs flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[#0B4C7A]/70">Billing Status: </span>
                {app.paymentPlan === "PAID_ONLINE" ? (
                  <span className="font-bold text-emerald-700">
                    Paid Online via UddoktaPay (Settled)
                  </span>
                ) : (
                  <span className="font-bold text-amber-800">
                    Collect ৳ {app.collectAmountBDT} at Clinic Counter
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {app.status === "CONFIRMED" && (
                  <button
                    type="button"
                    onClick={() => updateStatus(app.id, "IN_PROGRESS")}
                    className="px-3.5 py-1.5 rounded-full bg-[#0D8BE0] hover:bg-[#0A77C2] text-white text-xs font-semibold shadow-xs flex items-center gap-1"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>Start Consultation</span>
                  </button>
                )}

                {app.status === "IN_PROGRESS" && (
                  <button
                    type="button"
                    onClick={() => updateStatus(app.id, "COMPLETED")}
                    className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Complete Visit</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
