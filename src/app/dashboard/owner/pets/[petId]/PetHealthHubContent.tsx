"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Dog,
  Cat,
  ArrowLeft,
  Calendar,
  Syringe,
  Pill,
  Weight,
  Scissors,
  Utensils,
  Plus,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Trash2,
  CheckCircle2,
  FileText,
  Lock,
  Eye,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { toast } from "sonner";
import { ExpiryPill } from "@/components/modules/vault/ExpiryPill";
import { UploadDocumentModal } from "@/components/modules/vault/UploadDocumentModal";
import { DocumentViewerModal } from "@/components/modules/vault/DocumentViewerModal";
import type { PetDocument } from "@/types";
import { apiClient } from "@/lib/api/client";

export default function PetHealthHubContent({ petId }: { petId: string }) {
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "vaccinations"
    | "deworming"
    | "medications"
    | "weights"
    | "grooming"
    | "diet"
    | "documents"
  >("overview");

  // Vault state
  const [documents, setDocuments] = useState<PetDocument[]>([
    {
      id: "doc-1",
      petId,
      title: "Rabies Core Annual Vaccine Certificate",
      docType: "VACCINATION_CERTIFICATE",
      issuedOn: "2026-04-01",
      expiryDate: "2027-04-01",
      expiryStatus: "VALID",
      visibleToProviders: true,
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      id: "doc-2",
      petId,
      title: "Abdominal Ultrasound & Organ Scan",
      docType: "IMAGING",
      issuedOn: "2026-06-15",
      expiryStatus: "VALID",
      visibleToProviders: true,
    },
    {
      id: "doc-3",
      petId,
      title: "Deworming Prescription Course",
      docType: "PRESCRIPTION",
      issuedOn: "2026-09-01",
      expiryDate: "2026-10-01",
      expiryStatus: "EXPIRED",
      visibleToProviders: false,
    },
  ]);

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<PetDocument | null>(null);

  const handleDeleteDocument = (id: string, title: string) => {
    if (confirm(`Remove "${title}" from the document vault?`)) {
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      toast.info("Document removed from vault");
    }
  };

  // Pet details
  const [pet, setPet] = useState({
    id: petId,
    name: "Miu Miu",
    species: "Persian Cat",
    breed: "Persian Classic",
    gender: "Female (Spayed)",
    dob: "2024-03-15",
    microchip: "BD-9820019283",
    currentWeight: 4.5,
    allergies: ["Chicken Protein", "Grain filler"],
  });

  useEffect(() => {
    let isMounted = true;
    if (petId) {
      apiClient
        .get(`/pets/${petId}`)
        .then((res) => {
          const p = res.data?.data;
          if (p && isMounted) {
            setPet({
              id: p._id || p.id,
              name: p.name,
              species: p.species?.name || p.species || "Companion Pet",
              breed: p.customBreed || p.breed || "Domestic breed",
              gender: p.gender || "Female",
              dob: p.dob || "2024-03-15",
              microchip: p.microchipId || "BD-PET-VERIFIED",
              currentWeight: p.weightKg || 4.5,
              allergies: Array.isArray(p.allergies) ? p.allergies : [],
            });
          }
        })
        .catch(() => {});

      apiClient
        .get(`/pets/${petId}/documents`)
        .then((res) => {
          const docs = res.data?.data;
          if (Array.isArray(docs) && docs.length > 0 && isMounted) {
            setDocuments(docs);
          }
        })
        .catch(() => {});

      apiClient
        .get(`/pets/${petId}/vaccinations`)
        .then((res) => {
          const vacs = res.data?.data;
          if (Array.isArray(vacs) && vacs.length > 0 && isMounted) {
            setVaccinations(vacs);
          }
        })
        .catch(() => {});
    }
    return () => {
      isMounted = false;
    };
  }, [petId]);

  // Mock Vaccinations
  const [vaccinations, setVaccinations] = useState([
    {
      id: "v-1",
      name: "Nobivac Tricat Trio (FPV, FHV, FCV)",
      dateAdministered: "2026-03-10",
      nextDueDate: "2027-03-10",
      batch: "NV-884920",
      clinic: "CareVet Animal Hospital (Dr. Rahman)",
      verifiedProvider: true,
    },
    {
      id: "v-2",
      name: "Rabies Core Booster (Rabisin)",
      dateAdministered: "2026-04-01",
      nextDueDate: "2026-11-20", // due soon!
      batch: "RB-102948",
      clinic: "Paws & Claws Veterinary Care",
      verifiedProvider: true,
    },
  ]);

  // Mock Deworming
  const [dewormings, setDewormings] = useState([
    {
      id: "dw-1",
      product: "Drontal Plus for Cats",
      dateGiven: "2026-09-01",
      dosage: "1 tablet with food",
      nextDueDate: "2026-12-01",
    },
  ]);

  // Mock Medications
  const [medications, setMedications] = useState([
    {
      id: "med-1",
      name: "Omega-3 Salmon Oil Supplement",
      dosage: "2ml",
      frequency: "Once daily with breakfast",
      start: "2026-08-01",
      end: "Ongoing",
    },
  ]);

  // Mock Weight Chart History
  const [weightLogs, setWeightLogs] = useState([
    { date: "May 2026", weight: 3.8 },
    { date: "Jul 2026", weight: 4.1 },
    { date: "Sep 2026", weight: 4.3 },
    { date: "Nov 2026", weight: 4.5 },
  ]);

  const [newWeight, setNewWeight] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const handleAddWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight) return;
    const added = {
      date: "Nov 2026",
      weight: parseFloat(newWeight),
    };
    setWeightLogs([...weightLogs, added]);
    toast.success("New weight recorded!");
    setNewWeight("");
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Back Link & Pet Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/owner/pets"
            className="p-2 rounded-xl border border-white/80 bg-white/70 hover:bg-white text-[#06395F] shadow-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-[#06395F]">
                {pet.name}&apos;s Health Hub
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-sky-50 text-[#0D8BE0] border border-sky-100 text-[10px] font-semibold">
                {pet.species}
              </span>
            </div>
            <p className="text-xs text-[#0B4C7A]/75 mt-0.5">
              Microchip ID: <span className="font-mono">{pet.microchip}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: "overview", label: "Overview", icon: FileText },
          { id: "vaccinations", label: "Vaccinations", icon: Syringe },
          { id: "deworming", label: "Deworming", icon: Pill },
          { id: "weights", label: "Weight Tracker", icon: Weight },
          { id: "medications", label: "Medications", icon: Pill },
          { id: "grooming", label: "Grooming", icon: Scissors },
          { id: "diet", label: "Diet Plan", icon: Utensils },
          { id: "documents", label: "Document Vault", icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-[#0D8BE0] text-white shadow-sm"
                  : "bg-white/60 text-[#06395F]/80 border border-white/80 hover:bg-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-[2rem] border border-white/70 bg-white/55 backdrop-blur-2xl p-5 shadow-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#0B4C7A]/60">
                Current Weight
              </span>
              <div className="text-2xl font-bold text-[#06395F]">
                {pet.currentWeight} kg
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold">
                Healthy growth range
              </span>
            </div>

            <div className="rounded-[2rem] border border-white/70 bg-white/55 backdrop-blur-2xl p-5 shadow-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#0B4C7A]/60">
                Core Vaccines
              </span>
              <div className="text-2xl font-bold text-[#06395F]">2 Active</div>
              <span className="text-[11px] text-amber-600 font-semibold">
                1 Booster due this month
              </span>
            </div>

            <div className="rounded-[2rem] border border-white/70 bg-white/55 backdrop-blur-2xl p-5 shadow-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#0B4C7A]/60">
                Deworming Status
              </span>
              <div className="text-2xl font-bold text-[#06395F]">Up to date</div>
              <span className="text-[11px] text-[#0B4C7A]/60">
                Next cycle: Dec 1, 2026
              </span>
            </div>
          </div>

          {/* Allergies & Diet Notice */}
          <div className="rounded-[2rem] border border-rose-200/80 bg-rose-50/70 p-5 text-xs text-rose-800 space-y-1">
            <div className="flex items-center gap-2 font-bold text-rose-900">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Known Medical Sensitivities & Allergies</span>
            </div>
            <p className="text-[11px] text-rose-700 leading-relaxed">
              Patient exhibits acute dermatitis when exposed to{" "}
              <strong>{pet.allergies.join(", ")}</strong>. Please alert attending veterinarians before administering injectable carriers or medications.
            </p>
          </div>
        </div>
      )}

      {/* Tab: Vaccinations */}
      {activeTab === "vaccinations" && (
        <div className="rounded-[2.5rem] border border-white/70 bg-white/55 backdrop-blur-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#06395F]/10">
            <div>
              <h2 className="text-base font-bold text-[#06395F]">
                Vaccination Passport & History
              </h2>
              <p className="text-xs text-[#0B4C7A]/75 font-light">
                Digital vaccine certificates signed by certified veterinary clinics in Bangladesh.
              </p>
            </div>
          </div>

          <div className="divide-y divide-white/70 rounded-2xl border border-white/80 bg-white/60 overflow-hidden">
            {vaccinations.map((vac) => (
              <div
                key={vac.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#06395F]">
                      {vac.name}
                    </span>
                    {vac.verifiedProvider && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>Verified Provider Entry</span>
                      </span>
                    )}
                  </div>
                  <div className="text-[#0B4C7A]/70">
                    Clinic: {vac.clinic} • Batch: {vac.batch}
                  </div>
                  <div className="text-[11px] text-[#06395F]">
                    Administered on: <strong>{vac.dateAdministered}</strong>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-right sm:text-left space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-amber-700 block">
                    Next Booster Due
                  </span>
                  <div className="font-bold">{vac.nextDueDate}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Weight Tracker with Recharts */}
      {activeTab === "weights" && (
        <div className="rounded-[2.5rem] border border-white/70 bg-white/55 backdrop-blur-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#06395F]">
                Weight Progression Chart
              </h2>
              <p className="text-xs text-[#0B4C7A]/75 font-light">
                Monitor growth velocity and prevent obesity in feline & canine companions.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#0D8BE0] text-white text-xs font-semibold shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Weight</span>
            </button>
          </div>

          {/* Interactive Chart Container */}
          <div className="h-64 w-full bg-white/70 p-4 rounded-2xl border border-white/80 shadow-inner">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightLogs}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
                <XAxis dataKey="date" stroke="#06395F" fontSize={11} />
                <YAxis
                  stroke="#06395F"
                  fontSize={11}
                  domain={[3, 5.5]}
                  unit="kg"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "1rem",
                    border: "1px solid #e0f2fe",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#0D8BE0"
                  strokeWidth={3}
                  dot={{ fill: "#0D8BE0", r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Table of logs */}
          <div className="divide-y divide-white/70 rounded-xl border border-white/80 bg-white/60 overflow-hidden text-xs">
            {weightLogs.map((log, idx) => (
              <div
                key={idx}
                className="p-3 flex items-center justify-between text-[#06395F]"
              >
                <span>{log.date}</span>
                <span className="font-bold">{log.weight} kg</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Deworming */}
      {activeTab === "deworming" && (
        <div className="rounded-[2.5rem] border border-white/70 bg-white/55 backdrop-blur-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-[#06395F]">
            Deworming Logs
          </h2>
          <div className="divide-y divide-white/70 rounded-2xl border border-white/80 bg-white/60 overflow-hidden text-xs">
            {dewormings.map((dw) => (
              <div key={dw.id} className="p-4 space-y-1">
                <div className="font-bold text-sm text-[#06395F]">
                  {dw.product}
                </div>
                <div className="text-[#0B4C7A]/75">
                  Dosage: {dw.dosage} • Administered on: {dw.dateGiven}
                </div>
                <div className="text-xs text-emerald-700 font-semibold">
                  Next Due: {dw.nextDueDate}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Medications */}
      {activeTab === "medications" && (
        <div className="rounded-[2.5rem] border border-white/70 bg-white/55 backdrop-blur-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-[#06395F]">
            Prescriptions & Daily Supplements
          </h2>
          <div className="divide-y divide-white/70 rounded-2xl border border-white/80 bg-white/60 overflow-hidden text-xs">
            {medications.map((med) => (
              <div key={med.id} className="p-4 space-y-1">
                <div className="font-bold text-sm text-[#06395F]">
                  {med.name}
                </div>
                <div className="text-[#0B4C7A]/75">
                  Dosage: {med.dosage} ({med.frequency})
                </div>
                <div className="text-xs text-sky-700 font-semibold">
                  Course: {med.start} to {med.end}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Grooming */}
      {activeTab === "grooming" && (
        <div className="rounded-[2.5rem] border border-white/70 bg-white/55 backdrop-blur-2xl p-6 sm:p-8 shadow-sm space-y-3">
          <h2 className="text-base font-bold text-[#06395F]">
            Grooming & Hygiene Records
          </h2>
          <p className="text-xs text-[#0B4C7A]/75">
            Full medicated bath, ear cleaning, and nail clipping performed on{" "}
            <strong>October 12, 2026</strong> at Fluffy Tails Resort.
          </p>
        </div>
      )}

      {/* Tab: Diet */}
      {activeTab === "diet" && (
        <div className="rounded-[2.5rem] border border-white/70 bg-white/55 backdrop-blur-2xl p-6 sm:p-8 shadow-sm space-y-3">
          <h2 className="text-base font-bold text-[#06395F]">
            Nutrition & Feeding Plan
          </h2>
          <div className="p-4 rounded-2xl bg-white/70 border border-white/80 space-y-1 text-xs">
            <div className="inline-block px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold mb-1">
              Currently Active Diet
            </div>
            <div className="font-bold text-sm text-[#06395F]">
              Royal Canin Persian Adult + Sheba Salmon Wet Pouch
            </div>
            <div className="text-[#0B4C7A]/80">
              Portion: 60g dry kibble divided in 2 meals + 1 wet pouch in evening.
            </div>
          </div>
        </div>
      )}

      {/* Tab: Document Vault */}
      {activeTab === "documents" && (
        <div className="rounded-[2.5rem] border border-white/70 bg-white/55 backdrop-blur-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#06395F]">
                  Encrypted Medical Document Vault
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Cloudinary Private Vault</span>
                </span>
              </div>
              <p className="text-xs text-[#0B4C7A]/75 font-light mt-0.5">
                Safe cloud storage for vaccination certificates, diagnostic ultrasound scans, and prescriptions.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setUploadModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#2FB0FF] to-[#0D8BE0] text-white text-xs font-semibold shadow-xs hover:shadow transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
          </div>

          {documents.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <Lock className="w-10 h-10 mx-auto text-[#0D8BE0]/40" />
              <h3 className="text-sm font-bold text-[#06395F]">
                No files in vault yet
              </h3>
              <p className="text-xs text-[#0B4C7A]/70 max-w-xs mx-auto">
                Upload your pet&apos;s vaccination passports, blood work PDFs, or imaging scans to keep them securely backed up.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-2xl border border-white/80 bg-white/70 p-4 shadow-xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-sky-50 text-[#0D8BE0] border border-sky-100 text-[10px] font-semibold">
                        {doc.docType.replace(/_/g, " ")}
                      </span>
                      <ExpiryPill status={doc.expiryStatus} days={14} />
                    </div>

                    <h4 className="font-bold text-sm text-[#06395F] leading-snug">
                      {doc.title}
                    </h4>

                    <div className="flex items-center gap-2 text-[11px] text-[#0B4C7A]/70">
                      <span>Issued: {doc.issuedOn}</span>
                      {doc.expiryDate && <span>• Exp: {doc.expiryDate}</span>}
                    </div>

                    <div className="text-[11px] text-[#06395F]/70 flex items-center gap-1 pt-1">
                      {doc.visibleToProviders ? (
                        <span className="text-emerald-700 font-medium">✓ Attending vets can view</span>
                      ) : (
                        <span className="text-gray-500">🔒 Private to owner</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setViewingDoc(doc)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#0D8BE0] hover:underline"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Document</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteDocument(doc.id, doc.title)}
                      className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                      title="Delete document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Upload Document Modal */}
      {uploadModalOpen && (
        <UploadDocumentModal
          petId={pet.id}
          onSuccess={(doc) => setDocuments((prev) => [doc, ...prev])}
          onClose={() => setUploadModalOpen(false)}
        />
      )}

      {/* Document Viewer Modal */}
      {viewingDoc && (
        <DocumentViewerModal
          document={viewingDoc}
          onClose={() => setViewingDoc(null)}
        />
      )}

      {/* Add Weight Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-[2.5rem] border border-white/80 bg-white/95 backdrop-blur-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-[#06395F]">
              Log Patient Weight
            </h3>
            <form onSubmit={handleAddWeight} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#06395F] mb-1">
                  Weight (kg) *
                </label>
                <input
                  type="number"
                  step="0.05"
                  required
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  placeholder="4.65"
                  className="w-full px-3 py-2 rounded-xl border border-surface-200 bg-white text-sm text-[#06395F] outline-none focus:ring-2 focus:ring-[#0D8BE0]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-gray-200 text-xs font-semibold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#0D8BE0] text-white text-xs font-semibold shadow-xs"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
