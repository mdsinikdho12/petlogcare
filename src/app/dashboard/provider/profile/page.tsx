"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  Loader2,
  Users,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api/client";
import StatusBadge from "@/components/dashboard/StatusBadge";

/* ---------- Liquid Glass Tokens (Design System v2) ---------- */
const glass =
  "rounded-[13px] border border-white/80 bg-white/55 backdrop-blur-xl backdrop-saturate-150 " +
  "shadow-[0_8px_30px_rgba(1,95,160,0.10),inset_0_1px_0_rgba(255,255,255,0.95)]";

const primaryBtn =
  "inline-flex h-10 items-center justify-center gap-2 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] " +
  "px-5 text-xs font-semibold text-white shadow-[0_4px_14px_rgba(13,150,230,0.30)] " +
  "transition duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-60";

const inputCls =
  "h-10 w-full rounded-[11px] border border-[#06395F]/20 bg-white px-3.5 text-xs text-[#06395F] " +
  "shadow-2xs outline-none transition placeholder:text-[#06395F]/35 " +
  "focus:bg-white focus:ring-2 focus:ring-[#0D8BE0]";

interface StaffMember {
  id?: string;
  _id?: string;
  name: string;
  role: string;
  phone?: string;
  title?: string;
  bio?: string;
}

export default function ProviderProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  // Business profile state
  const [businessName, setBusinessName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [description, setDescription] = useState("");
  const [line1, setLine1] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("Dhaka");
  const [district, setDistrict] = useState("Dhaka");
  const [inClinic, setInClinic] = useState(true);
  const [homeVisit, setHomeVisit] = useState(false);
  const [autoAcceptBookings, setAutoAcceptBookings] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string>("APPROVED");
  const [providerTypes, setProviderTypes] = useState<string[]>(["VET_CLINIC"]);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  // Staff members from real API
  const [staff, setStaff] = useState<StaffMember[]>([]);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const [pRes, sRes] = await Promise.allSettled([
          apiClient.get("/providers/me"),
          apiClient.get("/providers/me/staff"),
        ]);

        if (pRes.status === "fulfilled" && pRes.value.data?.data) {
          const p = pRes.value.data.data;
          setBusinessName(p.businessName || "");
          setContactPhone(p.contactPhone || p.phone || "");
          setContactEmail(p.contactEmail || p.email || "");
          setDescription(p.description || p.bio || "");
          if (p.address) {
            setLine1(p.address.line1 || p.address.street || "");
            setArea(p.address.area || "");
            setCity(p.address.city || "Dhaka");
            setDistrict(p.address.district || "Dhaka");
          }
          if (p.serviceModes) {
            setInClinic(p.serviceModes.inClinic ?? true);
            setHomeVisit(p.serviceModes.homeVisit ?? false);
          }
          setAutoAcceptBookings(Boolean(p.autoAcceptBookings));
          setVerificationStatus(p.verificationStatus || p.status || "APPROVED");
          if (Array.isArray(p.providerTypes) && p.providerTypes.length > 0) {
            setProviderTypes(p.providerTypes);
          }
          if (p.logoUrl || p.logo) setLogoUrl(p.logoUrl || p.logo);
          if (p.coverUrl || p.cover) setCoverUrl(p.coverUrl || p.cover);
        }

        if (sRes.status === "fulfilled" && sRes.value.data?.data) {
          const items = Array.isArray(sRes.value.data.data)
            ? sRes.value.data.data
            : sRes.value.data.data.staff || [];
          setStaff(items);
        }
      } catch {
        // Fallback gracefully
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName) {
      toast.error("Business name is required");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        businessName,
        contactPhone,
        contactEmail,
        description,
        address: {
          line1,
          area,
          city,
          district,
        },
        serviceModes: {
          inClinic,
          homeVisit,
        },
        autoAcceptBookings,
        providerTypes,
      };

      await apiClient.patch("/providers/me", payload);
      toast.success("Practice profile updated in live database!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingLogo(true);
      const formData = new FormData();
      formData.append("logo", file);

      const res = await apiClient.patch("/providers/me/logo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedUrl = res.data?.data?.logoUrl || res.data?.data?.logo || URL.createObjectURL(file);
      setLogoUrl(updatedUrl);
      toast.success("Clinic logo updated!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to upload logo");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingCover(true);
      const formData = new FormData();
      formData.append("cover", file);

      const res = await apiClient.patch("/providers/me/cover", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedUrl = res.data?.data?.coverUrl || res.data?.data?.cover || URL.createObjectURL(file);
      setCoverUrl(updatedUrl);
      toast.success("Cover photo updated!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to upload cover photo");
    } finally {
      setUploadingCover(false);
    }
  };

  const toggleType = (t: string) => {
    setProviderTypes((prev) =>
      prev.includes(t)
        ? prev.length > 1
          ? prev.filter((item) => item !== t)
          : prev
        : [...prev, t]
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#06395F]/60">
        <Loader2 className="w-8 h-8 animate-spin text-[#0D8BE0] mb-3" />
        <p className="text-xs font-semibold">Loading practice profile from database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-[28px] font-bold tracking-tight text-[#06395F]">
            Practice & Clinic Profile
          </h1>
          <p className="text-[13px] text-[#06395F]/75 mt-0.5">
            Manage your public veterinary practice listing, contact details, and location.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge
            status={verificationStatus as any}
            label={verificationStatus === "APPROVED" ? "Verified Practice" : verificationStatus}
          />
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Cover & Logo Section */}
        <div className={`${glass} overflow-hidden p-0 relative`}>
          {/* Cover Banner */}
          <div className="h-36 sm:h-44 w-full bg-gradient-to-r from-sky-400/30 via-blue-500/20 to-sky-600/30 relative flex items-center justify-center overflow-hidden">
            {coverUrl ? (
              <img
                src={coverUrl}
                alt="Clinic Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-xs text-[#06395F]/50 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0D8BE0]" />
                <span>Upload a banner to showcase your clinic exterior</span>
              </div>
            )}

            <label className="absolute right-4 bottom-4 px-3 py-1.5 rounded-[11px] bg-white/90 hover:bg-white text-xs font-semibold text-[#06395F] shadow-sm flex items-center gap-1.5 cursor-pointer transition">
              <Camera className="w-3.5 h-3.5 text-[#0D8BE0]" />
              <span>{uploadingCover ? "Uploading..." : "Change Cover"}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingCover}
                onChange={handleCoverUpload}
              />
            </label>
          </div>

          {/* Logo & Meta info */}
          <div className="p-6 pt-0 flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10 sm:-mt-12 relative z-10">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white bg-white shadow-md relative overflow-hidden flex items-center justify-center text-center">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={businessName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 className="w-8 h-8 text-[#0D8BE0]" />
                )}

                <label className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition cursor-pointer">
                  <Camera className="w-4 h-4 mb-0.5" />
                  <span className="text-[9px] font-bold">Edit</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingLogo}
                    onChange={handleLogoUpload}
                  />
                </label>
              </div>

              <div className="mb-1">
                <h2 className="font-display text-lg sm:text-xl font-bold text-[#06395F]">
                  {businessName || "Your Veterinary Practice"}
                </h2>
                <p className="text-xs text-[#0B4C7A]/70 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0D8BE0]" />
                  <span>{[area, city].filter(Boolean).join(", ") || "Location unconfigured"}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Business Information Card */}
        <div className={`${glass} p-5 sm:p-6 space-y-4`}>
          <h2 className="text-base font-bold text-[#06395F] flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#0D8BE0]" />
            <span>Practice Identity & Registration</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#06395F]">
                Clinic / Hospital Name *
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. CareVet Animal Hospital"
                className={inputCls}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#06395F]">
                Contact Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="info@clinic.com"
                className={inputCls}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#06395F]">
                Primary Appointment Phone
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+880 1700-123456"
                className={inputCls}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#06395F]">
                District
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="Dhaka"
                className={inputCls}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#06395F]">
                Neighborhood / Area
              </label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Dhanmondi, Gulshan 2, Uttara"
                className={inputCls}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#06395F]">
                Street Address (for client GPS navigation)
              </label>
              <input
                type="text"
                value={line1}
                onChange={(e) => setLine1(e.target.value)}
                placeholder="e.g. House 42, Road 9/A"
                className={inputCls}
              />
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-[#06395F]">
              About Practice & Philosophy of Care
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Provide a concise description of your surgical facilities, modern diagnostic equipment, and veterinary team."
              className="w-full p-3 rounded-[11px] border border-[#06395F]/20 text-xs text-[#06395F] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0D8BE0] shadow-2xs"
            />
          </div>
        </div>

        {/* Practice Capabilities & Service Modes */}
        <div className={`${glass} p-5 sm:p-6 space-y-4`}>
          <h2 className="text-base font-bold text-[#06395F] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0D8BE0]" />
            <span>Service Modes & Booking Preferences</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Service Modes */}
            <div className="p-4 rounded-[11px] border border-[#06395F]/15 bg-white space-y-3">
              <span className="text-xs font-bold text-[#06395F] block">
                Appointment Locations Offered
              </span>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs text-[#06395F] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inClinic}
                    onChange={(e) => setInClinic(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0D8BE0] focus:ring-[#0D8BE0]"
                  />
                  <span>In-Clinic Visits (Clients visit your practice)</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-[#06395F] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={homeVisit}
                    onChange={(e) => setHomeVisit(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0D8BE0] focus:ring-[#0D8BE0]"
                  />
                  <span>Home Visits (Veterinarians travel to pet home)</span>
                </label>
              </div>
            </div>

            {/* Auto Accept */}
            <div className="p-4 rounded-[11px] border border-[#06395F]/15 bg-white space-y-3">
              <span className="text-xs font-bold text-[#06395F] block">
                Booking Confirmation Automation
              </span>
              <label className="flex items-start gap-2 text-xs text-[#06395F] cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoAcceptBookings}
                  onChange={(e) => setAutoAcceptBookings(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0D8BE0] focus:ring-[#0D8BE0] mt-0.5"
                />
                <div>
                  <span className="font-semibold block">Instant Booking Confirmation</span>
                  <span className="text-[11px] text-[#0B4C7A]/70 leading-normal block mt-0.5">
                    Automatically confirm bookings when payment is escrowed without requiring manual review.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Real Team & Attending Veterinarians (Synced from /staff) */}
        <div className={`${glass} p-5 sm:p-6 space-y-4`}>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#06395F] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#0D8BE0]" />
              <span>Practice Staff & Attending Doctors ({staff.length})</span>
            </h2>

            <Link
              href="/dashboard/provider/staff"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#0D8BE0] hover:underline"
            >
              <span>Manage Staff</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {staff.length === 0 ? (
            <div className="p-6 rounded-[11px] border border-dashed border-sky-200 bg-sky-50/50 text-center">
              <p className="text-xs text-[#06395F]/75">
                No staff members listed yet. Add doctors, surgeons, and nurses in the{" "}
                <Link href="/dashboard/provider/staff" className="font-bold text-[#0D8BE0] underline">
                  Staff Directory
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {staff.map((m, idx) => (
                <div
                  key={m.id || m._id || idx}
                  className="p-3.5 rounded-[11px] border border-[#06395F]/15 bg-white shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xs text-[#06395F]">{m.name}</h3>
                    <span className="text-[10px] font-semibold text-[#0D8BE0] bg-sky-50 px-2 py-0.5 rounded-[8px] border border-sky-200">
                      {m.role}
                    </span>
                  </div>
                  {m.title && (
                    <p className="text-[11px] text-[#0B4C7A]/70 mt-1">{m.title}</p>
                  )}
                  {m.phone && (
                    <p className="text-[10px] text-[#0B4C7A]/50 mt-0.5">{m.phone}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className={primaryBtn}
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Practice Profile</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
