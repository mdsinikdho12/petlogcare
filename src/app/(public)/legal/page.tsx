// src/app/(public)/legal/page.tsx
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  FileText,
  AlertTriangle,
  Cookie,
  Lock,
  Phone,
  Heart,
  Clock,
} from "lucide-react";

function LegalContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "privacy";
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  return (
    <div className="relative min-h-screen text-[#06395F] pt-24 sm:pt-28 lg:pt-32 pb-20">
      {/* Background ambient blooms */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none overflow-hidden -z-10"
      >
        <div className="absolute top-1/4 -left-20 h-[520px] w-[520px] rounded-full bg-[#9EE7FF]/60 blur-3xl" />
        <div className="absolute top-1/3 -right-20 h-[500px] w-[500px] rounded-full bg-[#FFD6E8]/70 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-[480px] w-[480px] rounded-full bg-[#FFF1C9]/60 blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Hero */}
        <div className="rounded-[13px] border border-white/80 bg-white/55 backdrop-blur-xl backdrop-saturate-150 p-6 sm:p-10 shadow-[0_8px_30px_rgba(1,95,160,0.10),inset_0_1px_0_rgba(255,255,255,0.95)] space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[8px] bg-sky-500/15 text-[#0D8BE0] text-xs font-semibold border border-white/80">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Compliance & Patient Rights in Bangladesh</span>
          </div>

          <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-[#06395F]">
            Legal, privacy & emergency protocols
          </h1>

          <p className="text-xs sm:text-sm text-[#06395F]/80 max-w-2xl font-normal leading-relaxed">
            Transparent operational standards for veterinary appointments, pet biological data security, and emergency care responsibilities.
          </p>

          {/* Tab Navigation Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#06395F]/10">
            {[
              { id: "privacy", label: "Privacy policy", icon: Lock },
              { id: "terms", label: "Terms of care", icon: FileText },
              { id: "emergency", label: "Emergency protocol", icon: AlertTriangle },
              { id: "cookies", label: "Cookie settings", icon: Cookie },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[11px] text-xs font-semibold transition ${
                    activeTab === tab.id
                      ? "bg-[#06395F] text-white shadow-xs"
                      : "bg-white/80 border border-[#06395F]/15 text-[#06395F] hover:bg-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Panels */}
        <div className="rounded-[13px] bg-white/85 border border-[#06395F]/10 p-6 sm:p-10 shadow-[0_1px_2px_rgba(6,57,95,0.06)] space-y-6 text-xs sm:text-sm text-[#06395F] leading-relaxed">
          {activeTab === "privacy" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#06395F]">
                Pet Medical Data Privacy Policy
              </h2>
              <p className="font-normal text-[#06395F]/85">
                Effective date: 01 November 2026. PetCareLog (&ldquo;we&rdquo;, &ldquo;our&rdquo;) is committed to protecting the privacy and confidentiality of companion animal parents and licensed veterinary practitioners across Bangladesh.
              </p>

              <div className="space-y-3">
                <h3 className="font-bold text-sm text-[#06395F]">1. Information We Collect</h3>
                <p className="font-normal text-[#06395F]/80">
                  We collect account registration data (name, email, phone number), companion pet biological records (species, breed, age, weight, microchip ID, vaccination passports), and appointment reservation logs.
                </p>

                <h3 className="font-bold text-sm text-[#06395F]">2. Secure Document Vault Storage</h3>
                <p className="font-normal text-[#06395F]/80">
                  Uploaded clinical diagnostic files (blood reports, radiographs, ultrasound scans, surgery slips) are encrypted and stored in secure cloud vaults. Access links are dynamically signed and expire after 5 minutes to prevent unauthorized indexing.
                </p>

                <h3 className="font-bold text-sm text-[#06395F]">3. Financial & Payment Data</h3>
                <p className="font-normal text-[#06395F]/80">
                  Online reservation deposits are processed via UddoktaPay MFS gateways (bKash, Nagad, Visa/Mastercard). We never store raw payment passwords, PINs, or card CVVs on our servers.
                </p>
              </div>
            </div>
          )}

          {activeTab === "terms" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#06395F]">
                Terms of Veterinary Care & Booking
              </h2>
              <p className="font-normal text-[#06395F]/85">
                Please review our terms governing clinic bookings, 10% reservation deposits, and provider responsibilities.
              </p>

              <div className="space-y-3">
                <h3 className="font-bold text-sm text-[#06395F]">1. Appointment Scheduling & 10% Online Deposit</h3>
                <p className="font-normal text-[#06395F]/80">
                  To eliminate clinic no-shows and guarantee dedicated doctor time, a 10% online reservation deposit is required when booking. The remaining 90% balance must be settled directly at the clinic counter upon arrival.
                </p>

                <h3 className="font-bold text-sm text-[#06395F]">2. Cancellation & Refund Policy</h3>
                <p className="font-normal text-[#06395F]/80">
                  Cancellations made at least <strong>3 hours</strong> prior to the scheduled appointment slot receive a 100% refund of the online reservation deposit. No-shows or cancellations within 3 hours forfeit the 10% reservation fee to cover clinic readiness costs.
                </p>

                <h3 className="font-bold text-sm text-[#06395F]">3. Professional Medical Disclaimers</h3>
                <p className="font-normal text-[#06395F]/80">
                  PetCareLog provides a digital coordination platform connecting pet parents with verified clinics. Medical treatments, diagnoses, and surgical procedures are performed exclusively under the independent professional judgment of licensed veterinary surgeons (BVCA registered).
                </p>
              </div>
            </div>
          )}

          {activeTab === "emergency" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="p-4 rounded-[11px] bg-rose-50 border border-rose-200 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm text-rose-900">
                    24/7 Emergency Veterinary Dispatch: +880 1700-000000
                  </h3>
                  <p className="text-xs text-rose-950/80 mt-0.5">
                    For road traffic accidents, acute poisoning, bloat, or severe breathing distress, do not wait for a chat reply. Call our dispatch hotline immediately.
                  </p>
                </div>
              </div>

              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#06395F]">
                Critical Emergency Protocols
              </h2>

              <div className="space-y-3">
                <h3 className="font-bold text-sm text-[#06395F]">When to Trigger Immediate Emergency Transit:</h3>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-[#06395F]/80 font-normal">
                  <li>Sudden collapse, loss of consciousness, or seizure episodes lasting over 2 minutes.</li>
                  <li>Inability to urinate or extreme straining in male cats (potential urethral crystal blockage).</li>
                  <li>Ingestion of toxic substances (rat poison, human paracetamol/NSAIDs, lilies, dark chocolate).</li>
                  <li>Severe bleeding or deep animal bite wounds requiring sterile trauma suture.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "cookies" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#06395F]">
                Cookie & Storage Policy
              </h2>
              <p className="font-normal text-[#06395F]/85">
                PetCareLog uses minimal, strictly functional session tokens and performance telemetry to ensure your pet records remain secure.
              </p>

              <div className="space-y-3">
                <h3 className="font-bold text-sm text-[#06395F]">Strictly Necessary Cookies</h3>
                <p className="font-normal text-[#06395F]/80">
                  Required for user authentication, role-based access control, and remembering active clinic sessions. These cookies cannot be turned off.
                </p>

                <h3 className="font-bold text-sm text-[#06395F]">Analytics & Performance</h3>
                <p className="font-normal text-[#06395F]/80">
                  Anonymous diagnostics to ensure fast loading times across mobile networks in Bangladesh. No personal identifying information or medical records are shared with third-party advertisers.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LegalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 text-center text-sm">Loading legal documents...</div>}>
      <LegalContent />
    </Suspense>
  );
}
