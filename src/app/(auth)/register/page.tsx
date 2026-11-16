"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  PawPrint,
  Stethoscope,
  AlertCircle,
  Check,
} from "lucide-react";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";
import { apiClient } from "@/lib/api/client";

/* ---------- Liquid Glass Style Tokens ---------- */
const panel =
  "w-full rounded-[2rem] border border-white/80 bg-white/55 p-5 sm:p-7 " +
  "shadow-[0_16px_50px_rgba(1,95,160,0.15),inset_0_1px_0_rgba(255,255,255,0.9)] " +
  "backdrop-blur-2xl backdrop-saturate-150";

const inputCls =
  "h-10.5 w-full rounded-xl border border-white/80 bg-white/75 pl-10 pr-3.5 text-sm text-[#06395F] " +
  "shadow-[inset_0_1px_2px_rgba(1,95,160,0.06)] outline-none transition placeholder:text-[#06395F]/35 " +
  "focus:bg-white focus:ring-2 focus:ring-[#0D96E6] aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-rose-400";

const primaryBtn =
  "flex h-11 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] " +
  "text-sm font-semibold text-white shadow-[0_6px_20px_rgba(13,150,230,0.35),inset_0_1px_0_rgba(255,255,255,0.5)] " +
  "transition duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D8BE0]";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D96E6]";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "USER",
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (values: RegisterFormData) => {
    try {
      setLoading(true);
      const { data } = await apiClient.post("/auth/register", values);
      toast.success("Account created successfully!", {
        description: data.message || "We sent a 6-digit verification code to your email.",
      });
      router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        "Registration failed. Please check your information and try again.";
      toast.error("Registration failed", { description: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={panel}>
      {/* Header */}
      <div className="mb-4 text-center">
        <h1 className="font-display text-2xl font-bold tracking-tight text-[#06395F] sm:text-[1.65rem]">
          Create your account
        </h1>
        <p className="mt-1 text-xs text-[#0B4C7A]/75">
          Join PetCareLog to protect and care for your beloved companion
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
        {/* Apple Segmented Pill Role Switcher */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-[#06395F]">
              Account Type
            </label>
            <span className="text-[11px] font-medium text-[#0D8BE0]">
              {selectedRole === "PROVIDER" ? "Service Provider Selected" : "Pet Owner Selected"}
            </span>
          </div>

          <div className="relative grid grid-cols-2 gap-1.5 p-1.5 rounded-2xl bg-sky-100/60 border border-white/80 shadow-[inset_0_1px_3px_rgba(6,57,95,0.08)]">
            {/* Pet Owner Tab */}
            <button
              type="button"
              onClick={() => setValue("role", "USER", { shouldValidate: true, shouldDirty: true })}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs transition-all duration-200 ${
                selectedRole === "USER"
                  ? "bg-gradient-to-r from-[#2FB0FF] to-[#0D8BE0] text-white font-bold shadow-md shadow-[#0D8BE0]/35 scale-[1.02]"
                  : "bg-white/60 text-[#06395F]/75 font-semibold hover:bg-white/90 hover:text-[#06395F] border border-white/60"
              } ${focusRing}`}
            >
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                  selectedRole === "USER"
                    ? "bg-white text-[#0D8BE0] shadow-xs"
                    : "bg-sky-500/15 text-[#0D8BE0]"
                }`}
              >
                <PawPrint className="w-3.5 h-3.5" />
              </div>
              <span>Pet Owner</span>
              {selectedRole === "USER" && (
                <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />
              )}
            </button>

            {/* Service Provider Tab */}
            <button
              type="button"
              onClick={() => setValue("role", "PROVIDER", { shouldValidate: true, shouldDirty: true })}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs transition-all duration-200 ${
                selectedRole === "PROVIDER"
                  ? "bg-gradient-to-r from-[#2FB0FF] to-[#0D8BE0] text-white font-bold shadow-md shadow-[#0D8BE0]/35 scale-[1.02]"
                  : "bg-white/60 text-[#06395F]/75 font-semibold hover:bg-white/90 hover:text-[#06395F] border border-white/60"
              } ${focusRing}`}
            >
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                  selectedRole === "PROVIDER"
                    ? "bg-white text-emerald-600 shadow-xs"
                    : "bg-emerald-500/15 text-emerald-600"
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
              </div>
              <span>Service Provider</span>
              {selectedRole === "PROVIDER" && (
                <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />
              )}
            </button>
          </div>

          {/* Context Guidance Banner */}
          <div className="mt-1.5 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/70 border border-white/80 text-[11px] text-[#06395F] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#0D8BE0] shrink-0 animate-pulse" />
            <span className="leading-tight">
              {selectedRole === "PROVIDER" ? (
                <>For <strong>veterinarians, clinics, pet groomers & boarding facilities</strong>.</>
              ) : (
                <>For <strong>pet parents</strong> to manage vaccinations, track health & book care.</>
              )}
            </span>
          </div>

          {errors.role && (
            <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-rose-600">
              <AlertCircle className="h-3 w-3 flex-shrink-0" />
              {errors.role.message}
            </p>
          )}
        </div>

        {/* 2-Column Name and Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-xs font-semibold text-[#06395F]"
            >
              Full Name
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#06395F]/40" />
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder={
                  selectedRole === "PROVIDER"
                    ? "Dr. Tanvir Ahmed"
                    : "Rafiqul Islam"
                }
                aria-invalid={!!errors.name}
                className={inputCls}
                {...register("name")}
              />
            </div>
            {errors.name && (
              <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-rose-600">
                <AlertCircle className="h-3 w-3 flex-shrink-0" />
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Phone Number (Optional) */}
          <div>
            <label
              htmlFor="phone"
              className="mb-1 block text-xs font-semibold text-[#06395F]"
            >
              Phone{" "}
              <span className="font-normal text-[#0B4C7A]/60">(optional)</span>
            </label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#06395F]/40" />
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder="+8801712345678"
                aria-invalid={!!errors.phone}
                className={inputCls}
                {...register("phone")}
              />
            </div>
            {errors.phone && (
              <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-rose-600">
                <AlertCircle className="h-3 w-3 flex-shrink-0" />
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-xs font-semibold text-[#06395F]"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#06395F]/40" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="name@example.com"
              aria-invalid={!!errors.email}
              className={inputCls}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-rose-600">
              <AlertCircle className="h-3 w-3 flex-shrink-0" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor="password"
              className="text-xs font-semibold text-[#06395F]"
            >
              Password
            </label>
            <span className="text-[11px] text-[#0B4C7A]/60">
              Min. 8 characters
            </span>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#06395F]/40" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              className={`${inputCls} pr-11`}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className={`absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#06395F]/50 transition-colors hover:bg-white/80 hover:text-[#06395F] ${focusRing}`}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-rose-600">
              <AlertCircle className="h-3 w-3 flex-shrink-0" />
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Legal Agreement */}
        <p className="text-[11px] leading-tight text-[#0B4C7A]/70 pt-0.5">
          By creating an account, you agree to PetCareLog&apos;s{" "}
          <Link
            href="/legal"
            className={`font-semibold text-[#0D8BE0] hover:underline ${focusRing}`}
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/legal"
            className={`font-semibold text-[#0D8BE0] hover:underline ${focusRing}`}
          >
            Privacy Policy
          </Link>
          .
        </p>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className={`${primaryBtn} mt-1`}
        >
          {loading ? (
            <>
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                aria-hidden
              />
              <span>Creating account…</span>
            </>
          ) : (
            <>
              <span>
                Create {selectedRole === "PROVIDER" ? "Provider" : "Pet Owner"} account
              </span>
              <ArrowRight className="h-4 w-4" aria-hidden />
            </>
          )}
        </button>
      </form>

      {/* Switch to Sign In */}
      <div className="mt-3.5 border-t border-[#06395F]/10 pt-3 text-center">
        <p className="text-xs text-[#0B4C7A]/75">
          Already have an account?{" "}
          <Link
            href="/login"
            className={`font-semibold text-[#0D8BE0] hover:underline ${focusRing}`}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
