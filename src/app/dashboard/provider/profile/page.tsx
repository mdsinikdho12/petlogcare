// src/app/dashboard/provider/profile/page.tsx
"use client";

import React, { useState } from "react";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Stethoscope,
  Clock,
  Sparkles,
  Camera,
  Plus,
  Save,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "@/components/dashboard/StatusBadge";

interface Doctor {
  id: string;
  name: string;
  credentials: string;
  specialty: string;
}

export default function ProviderProfilePage() {
  const [clinicName, setClinicName] = useState("CareVet Animal Hospital & Surgery");
  const [licenseNumber, setLicenseNumber] = useState("TR-DHAKA-2024-1102");
  const [phone, setPhone] = useState("+880 1700-123456");
  const [email, setEmail] = useState("contact@carevet.bd");
  const [district, setDistrict] = useState("Dhanmondi, Dhaka");
  const [address, setAddress] = useState("House 42, Road 9/A, Dhanmondi");
  const [emergencyHotline, setEmergencyHotline] = useState("+880 1700-000000");
  const [aboutClinic, setAboutClinic] = useState(
    "State-of-the-art veterinary clinic specialized in companion animal diagnostics, orthopedic surgery, preventive medicine, and 24/7 trauma triage in Dhanmondi."
  );

  const [facilities, setFacilities] = useState([
    { id: "f-1", name: "24/7 Emergency Trauma", enabled: true },
    { id: "f-2", name: "Digital X-Ray Suite", enabled: true },
    { id: "f-3", name: "In-House Blood Diagnostics", enabled: true },
    { id: "f-4", name: "Sterile Surgical Theater", enabled: true },
    { id: "f-5", name: "Oxygen Therapy & ICU Incubators", enabled: true },
    { id: "f-6", name: "Medicated Pet Grooming & Spa", enabled: false },
  ]);

  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: "doc-1",
      name: "Dr. Samira Khan",
      credentials: "DVM (BAU), MS (Small Animal Surgery)",
      specialty: "Chief Veterinary Surgeon",
    },
    {
      id: "doc-2",
      name: "Dr. Tanvir Ahmed",
      credentials: "DVM, PGD (Feline Medicine)",
      specialty: "Companion Animal Practitioner",
    },
  ]);

  const [newDocName, setNewDocName] = useState("");
  const [newDocCredentials, setNewDocCredentials] = useState("");
  const [newDocSpecialty, setNewDocSpecialty] = useState("");
  const [showAddDoc, setShowAddDoc] = useState(false);

  const handleToggleFacility = (id: string) => {
    setFacilities((prev) =>
      prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f))
    );
  };

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim() || !newDocCredentials.trim()) {
      toast.error("Please enter doctor's name and credentials");
      return;
    }
    const newDoc: Doctor = {
      id: `doc-${Date.now()}`,
      name: newDocName,
      credentials: newDocCredentials,
      specialty: newDocSpecialty || "Attending Veterinarian",
    };
    setDoctors([...doctors, newDoc]);
    setNewDocName("");
    setNewDocCredentials("");
    setNewDocSpecialty("");
    setShowAddDoc(false);
    toast.success("Veterinarian added to practice profile");
  };

  const handleRemoveDoctor = (id: string) => {
    setDoctors((prev) => prev.filter((d) => d.id !== id));
    toast.success("Doctor removed from directory");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Practice profile updated successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-[28px] font-bold tracking-tight text-[#06395F]">
            Practice & clinic profile
          </h1>
          <p className="text-[13px] text-[#06395F]/75 mt-0.5 font-normal">
            Manage your public veterinary practice listing, licensed doctors, and clinic amenities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge variant="success" text="Verified Practice" />
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Basic Information Card */}
        <div className="rounded-[13px] bg-white/85 border border-[#06395F]/10 p-5 sm:p-6 shadow-[0_1px_2px_rgba(6,57,95,0.06)] space-y-4">
          <h2 className="text-base font-bold text-[#06395F] flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#0D8BE0]" />
            <span>Practice Identity & Government Registration</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#06395F]">
                Clinic / Hospital Name
              </label>
              <input
                type="text"
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                className="w-full h-10 px-3 rounded-[11px] border border-[#06395F]/20 text-xs text-[#06395F] focus:outline-none focus:ring-2 focus:ring-[#0D8BE0]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#06395F]">
                Government Trade License No.
              </label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full h-10 px-3 rounded-[11px] border border-[#06395F]/20 text-xs text-[#06395F] font-mono focus:outline-none focus:ring-2 focus:ring-[#0D8BE0]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#06395F]">
                Primary Appointment Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-10 px-3 rounded-[11px] border border-[#06395F]/20 text-xs text-[#06395F] focus:outline-none focus:ring-2 focus:ring-[#0D8BE0]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#06395F]">
                24/7 Emergency Dispatch Helpline
              </label>
              <input
                type="text"
                value={emergencyHotline}
                onChange={(e) => setEmergencyHotline(e.target.value)}
                className="w-full h-10 px-3 rounded-[11px] border border-[#06395F]/20 text-xs text-[#06395F] focus:outline-none focus:ring-2 focus:ring-[#0D8BE0]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#06395F]">
                District / Area
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full h-10 px-3 rounded-[11px] border border-[#06395F]/20 text-xs text-[#06395F] focus:outline-none focus:ring-2 focus:ring-[#0D8BE0]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#06395F]">
                Street Address (for client GPS navigation)
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full h-10 px-3 rounded-[11px] border border-[#06395F]/20 text-xs text-[#06395F] focus:outline-none focus:ring-2 focus:ring-[#0D8BE0]"
              />
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-[#06395F]">
              About Clinic & Philosophy of Care
            </label>
            <textarea
              value={aboutClinic}
              onChange={(e) => setAboutClinic(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-[11px] border border-[#06395F]/20 text-xs text-[#06395F] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0D8BE0]"
            />
          </div>
        </div>

        {/* Facilities & Amenities */}
        <div className="rounded-[13px] bg-white/85 border border-[#06395F]/10 p-5 sm:p-6 shadow-[0_1px_2px_rgba(6,57,95,0.06)] space-y-4">
          <h2 className="text-base font-bold text-[#06395F] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0D8BE0]" />
            <span>Clinic Facilities & Diagnostic Infrastructure</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {facilities.map((f) => (
              <label
                key={f.id}
                className={`p-3 rounded-[11px] border flex items-center justify-between cursor-pointer transition ${
                  f.enabled
                    ? "bg-sky-50/70 border-sky-200 text-[#06395F]"
                    : "bg-slate-50 border-slate-200 text-slate-500"
                }`}
              >
                <span className="text-xs font-semibold">{f.name}</span>
                <input
                  type="checkbox"
                  checked={f.enabled}
                  onChange={() => handleToggleFacility(f.id)}
                  className="rounded text-[#0D8BE0] focus:ring-[#0D8BE0]"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Attending Veterinarians */}
        <div className="rounded-[13px] bg-white/85 border border-[#06395F]/10 p-5 sm:p-6 shadow-[0_1px_2px_rgba(6,57,95,0.06)] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#06395F] flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-[#0D8BE0]" />
              <span>Attending Veterinarians ({doctors.length})</span>
            </h2>

            <button
              type="button"
              onClick={() => setShowAddDoc(!showAddDoc)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#0D8BE0] hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add doctor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {doctors.map((doc) => (
              <div
                key={doc.id}
                className="p-3.5 rounded-[11px] border border-[#06395F]/15 bg-white flex items-start justify-between gap-3"
              >
                <div>
                  <h3 className="font-bold text-xs text-[#06395F]">{doc.name}</h3>
                  <p className="text-[11px] text-[#0D8BE0] font-medium">{doc.specialty}</p>
                  <p className="text-[10px] text-[#06395F]/60 mt-0.5">{doc.credentials}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveDoctor(doc.id)}
                  className="text-rose-500 hover:text-rose-700 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {showAddDoc && (
            <div className="p-4 rounded-[11px] bg-sky-50/60 border border-sky-200 space-y-3 animate-in fade-in">
              <h3 className="font-bold text-xs text-[#06395F]">Add New Attending Doctor</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input
                  type="text"
                  placeholder="Doctor Name (e.g. Dr. Kazi Arif)"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="h-9 px-3 rounded-[9px] border border-[#06395F]/20 text-xs bg-white"
                />
                <input
                  type="text"
                  placeholder="Degrees (e.g. DVM, MS BAU)"
                  value={newDocCredentials}
                  onChange={(e) => setNewDocCredentials(e.target.value)}
                  className="h-9 px-3 rounded-[9px] border border-[#06395F]/20 text-xs bg-white"
                />
                <input
                  type="text"
                  placeholder="Specialty (e.g. Feline Care)"
                  value={newDocSpecialty}
                  onChange={(e) => setNewDocSpecialty(e.target.value)}
                  className="h-9 px-3 rounded-[9px] border border-[#06395F]/20 text-xs bg-white"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddDoc(false)}
                  className="px-3 py-1.5 rounded-[9px] border border-slate-300 text-xs text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddDoctor}
                  className="px-3 py-1.5 rounded-[9px] bg-[#0D8BE0] text-white text-xs font-semibold"
                >
                  Save doctor
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white text-xs font-semibold shadow-[0_4px_14px_rgba(13,150,230,0.30)] hover:-translate-y-0.5 transition"
          >
            <Save className="w-4 h-4" />
            <span>Save practice profile</span>
          </button>
        </div>
      </form>
    </div>
  );
}
