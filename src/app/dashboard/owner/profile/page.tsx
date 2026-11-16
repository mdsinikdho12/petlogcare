"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  User,
  Phone,
  Mail,
  Camera,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/authStore";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  phone: z
    .string()
    .regex(/^\+8801[3-9]\d{8}$/, "Must be a valid Bangladeshi number (+8801XXXXXXXXX)")
    .optional()
    .or(z.literal("")),
  language: z.enum(["en", "bn"]),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function OwnerProfilePage() {
  const { user, setAuth, accessToken } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      language: "en",
    },
  });

  const selectedLanguage = watch("language");

  // Fetch current user details
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await apiClient.get("/users/me");
        if (data.data) {
          const profile = data.data;
          reset({
            name: profile.name || "",
            phone: profile.phone || "",
            language: profile.language || "en",
          });
          if (profile.profileImage?.url) {
            setAvatarPreview(profile.profileImage.url);
          }
        }
      } catch (err) {
        // Fallback to local store user
        if (user) {
          reset({
            name: user.name || "",
            phone: user.phone || "",
            language: "en",
          });
          if (user.profileImage?.url) {
            setAvatarPreview(user.profileImage.url);
          }
        }
      }
    };

    fetchProfile();
  }, [reset, user]);

  const onSubmit = async (values: ProfileFormData) => {
    try {
      setLoading(true);
      const { data } = await apiClient.patch("/users/me", values);
      toast.success("Profile updated successfully!");
      if (user && accessToken && data.data) {
        setAuth({ ...user, ...data.data }, accessToken);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to update profile";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      return;
    }

    // Local preview
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);

    // Upload
    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      setUploadingImage(true);
      const { data } = await apiClient.patch("/users/me/profile-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Profile photo updated!");
      if (user && accessToken && data.data?.profileImage) {
        setAuth({ ...user, profileImage: data.data.profileImage }, accessToken);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to upload photo";
      toast.error(msg);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setUploadingImage(true);
      await apiClient.delete("/users/me/profile-image");
      setAvatarPreview(null);
      toast.success("Profile photo removed");
      if (user && accessToken) {
        setAuth({ ...user, profileImage: undefined }, accessToken);
      }
    } catch (err: any) {
      toast.error("Failed to remove photo");
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6 max-w-4xl">
      {/* Top Banner (Liquid Glass) */}
      <div className="rounded-[13px] border border-white/80 bg-white/55 p-6 sm:p-7 backdrop-blur-xl backdrop-saturate-150 shadow-[0_8px_30px_rgba(1,95,160,0.10),inset_0_1px_0_rgba(255,255,255,0.95)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-sky-500/15 text-[#0D8BE0] text-[12px] font-semibold mb-2.5 border border-white/80 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Account settings</span>
          </div>
          <h1 className="font-display text-2xl sm:text-[28px] font-bold tracking-tight text-[#06395F]">
            Pet parent profile
          </h1>
          <p className="text-[13px] sm:text-sm text-[#06395F]/80 mt-1 max-w-xl font-normal leading-relaxed">
            Manage your personal profile, verified contact details, and notification preferences.
          </p>
        </div>
      </div>

      {/* Main Form Panel (Solid Surface) */}
      <div className="rounded-[13px] bg-white/85 border border-[#06395F]/10 p-6 sm:p-8 shadow-[0_1px_2px_rgba(6,57,95,0.06)] space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[#06395F]/10">
          <div className="relative group">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-white shadow-md overflow-hidden bg-gradient-to-tr from-[#2FB0FF] to-[#0D8BE0] flex items-center justify-center text-white text-2xl font-bold">
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarPreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{user?.name ? user.name.charAt(0).toUpperCase() : "U"}</span>
              )}
            </div>

            {/* Camera Upload Trigger */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImage}
              className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#0D8BE0] text-white shadow-sm hover:bg-[#0A77C2] transition"
              title="Upload new photo"
              aria-label="Upload new photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleAvatarSelect}
              className="hidden"
            />
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1.5">
            <h3 className="font-display text-sm sm:text-base font-bold text-[#06395F]">
              Profile photo
            </h3>
            <p className="text-[12px] text-[#06395F]/75 max-w-sm">
              PNG, JPG or WebP up to 5MB. Visible to booked veterinary surgeons and clinics.
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="px-3 py-1.5 rounded-[9px] border border-[#06395F]/15 bg-white text-[12px] font-semibold text-[#06395F] hover:bg-slate-50 transition shadow-2xs"
              >
                {uploadingImage ? "Uploading..." : "Change photo"}
              </button>
              {avatarPreview && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  disabled={uploadingImage}
                  className="px-3 py-1.5 rounded-[9px] border border-rose-200 bg-rose-50 text-[12px] font-semibold text-rose-700 hover:bg-rose-100 transition inline-flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
          {/* Email Address (Read-only) */}
          <div>
            <label className="block text-[12px] font-medium text-[#06395F] mb-1">
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#06395F]/40">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full pl-10 pr-24 py-2.5 rounded-[11px] border border-[#06395F]/15 bg-[#F8FBFE] text-[13px] text-[#06395F]/70 cursor-not-allowed shadow-2xs"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-[8px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified</span>
                </span>
              </div>
            </div>
            <p className="text-[11px] text-[#06395F]/60 mt-1 pl-0.5">
              Registered email is permanently linked to your pet passports for medical verification.
            </p>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-[12px] font-medium text-[#06395F] mb-1">
              Full name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#06395F]/40">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                {...register("name")}
                placeholder="MD Ferdous Mahmud"
                className="w-full pl-10 pr-4 py-2.5 rounded-[11px] border border-[#06395F]/15 bg-white text-[13px] text-[#06395F] focus:outline-none focus:border-[#0D8BE0] focus:ring-2 focus:ring-[#0D8BE0]/20 transition shadow-2xs"
              />
            </div>
            {errors.name && (
              <p className="text-[12px] text-rose-600 mt-1 pl-0.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.name.message}</span>
              </p>
            )}
          </div>

          {/* Phone Number (Bangladesh) */}
          <div>
            <label className="block text-[12px] font-medium text-[#06395F] mb-1">
              Phone number (Bangladesh)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#06395F]/40">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                {...register("phone")}
                placeholder="+8801712345678"
                className="w-full pl-10 pr-4 py-2.5 rounded-[11px] border border-[#06395F]/15 bg-white text-[13px] text-[#06395F] focus:outline-none focus:border-[#0D8BE0] focus:ring-2 focus:ring-[#0D8BE0]/20 transition shadow-2xs"
              />
            </div>
            {errors.phone ? (
              <p className="text-[12px] text-rose-600 mt-1 pl-0.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.phone.message}</span>
              </p>
            ) : (
              <p className="text-[11px] text-[#06395F]/60 mt-1 pl-0.5">
                Required for SMS booking updates, payment OTPs, and clinic triage calls.
              </p>
            )}
          </div>

          {/* Preferred Language */}
          <div>
            <label className="block text-[12px] font-medium text-[#06395F] mb-1">
              Preferred language
            </label>
            <div className="grid grid-cols-2 gap-3 max-w-sm">
              <button
                type="button"
                onClick={() => setValue("language", "en", { shouldDirty: true })}
                className={`py-2 px-3 rounded-[11px] border text-[12px] font-semibold flex items-center justify-center gap-2 transition-all ${
                  selectedLanguage === "en"
                    ? "bg-white text-[#06395F] border-[#0D8BE0] ring-2 ring-[#0D8BE0]/20 shadow-xs"
                    : "bg-[#F8FBFE] border-[#06395F]/10 text-[#06395F]/70 hover:bg-white"
                }`}
              >
                <span>English (US)</span>
                {selectedLanguage === "en" && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0D8BE0]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setValue("language", "bn", { shouldDirty: true })}
                className={`py-2 px-3 rounded-[11px] border text-[12px] font-semibold flex items-center justify-center gap-2 transition-all ${
                  selectedLanguage === "bn"
                    ? "bg-white text-[#06395F] border-[#0D8BE0] ring-2 ring-[#0D8BE0]/20 shadow-xs"
                    : "bg-[#F8FBFE] border-[#06395F]/10 text-[#06395F]/70 hover:bg-white"
                }`}
              >
                <span>বাংলা (Bangla)</span>
                {selectedLanguage === "bn" && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0D8BE0]" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-3 flex items-center justify-end">
            <button
              type="submit"
              disabled={loading || !isDirty}
              className="py-2.5 px-6 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white font-semibold text-[13px] tracking-wide shadow-[0_4px_14px_rgba(13,150,230,0.30)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
