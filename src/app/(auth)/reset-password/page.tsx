"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  Hash,
} from "lucide-react";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/lib/validations/auth";
import { apiClient } from "@/lib/api/client";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordFormData) => {
    try {
      setLoading(true);

      // Step 1: Exchange OTP code for resetToken
      const verifyRes = await apiClient.post("/auth/verify-reset-otp", {
        email: emailParam,
        otp: values.otp,
      });

      const resetToken =
        verifyRes.data?.data?.resetToken ||
        verifyRes.data?.resetToken ||
        verifyRes.data?.token;

      if (!resetToken) {
        throw new Error("Could not retrieve reset token. Please request a new code.");
      }

      // Step 2: Set new password using resetToken
      await apiClient.post("/auth/reset-password", {
        resetToken,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });

      toast.success("Password reset successful!", {
        description: "You can now sign in with your new password.",
      });

      router.push("/login");
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to reset password. Please verify your OTP code and try again.";
      toast.error("Reset failed", { description: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-[2.5rem] border border-white/70 bg-white/45 backdrop-blur-2xl backdrop-saturate-150 p-6 sm:p-10 shadow-[0_10px_40px_rgba(1,95,160,0.12),inset_0_1px_0_rgba(255,255,255,0.9)]">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/15 flex items-center justify-center text-indigo-600 mb-4 border border-white/80 shadow-sm">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
            Create new password
          </h1>
          <p className="text-sm text-text-secondary mt-1.5 font-light">
            Enter the 6-digit code sent to{" "}
            <span className="font-semibold text-text-primary">
              {emailParam || "your email"}
            </span>{" "}
            and set a new password.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* OTP Code */}
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5">
              6-Digit Recovery Code
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <div className="w-6 h-6 rounded-lg bg-sky-500/15 flex items-center justify-center text-brand-600">
                  <Hash className="w-3.5 h-3.5" />
                </div>
              </div>
              <input
                type="text"
                maxLength={6}
                {...register("otp")}
                placeholder="123456"
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md text-sm text-text-primary tracking-widest placeholder:tracking-normal placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white shadow-inner transition-all duration-200"
              />
            </div>
            {errors.otp && (
              <p className="text-xs text-rose-500 mt-1 pl-1">
                {errors.otp.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <div className="w-6 h-6 rounded-lg bg-indigo-500/15 flex items-center justify-center text-indigo-600">
                  <KeyRound className="w-3.5 h-3.5" />
                </div>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                {...register("newPassword")}
                placeholder="At least 8 characters"
                className="w-full pl-12 pr-12 py-3 rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white shadow-inner transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-secondary/70 hover:text-text-primary focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-xs text-rose-500 mt-1 pl-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <div className="w-6 h-6 rounded-lg bg-indigo-500/15 flex items-center justify-center text-indigo-600">
                  <KeyRound className="w-3.5 h-3.5" />
                </div>
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder="Re-enter new password"
                className="w-full pl-12 pr-12 py-3 rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white shadow-inner transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-secondary/70 hover:text-text-primary focus:outline-none"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-rose-500 mt-1 pl-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-6 rounded-full bg-gradient-to-r from-[#2FB0FF] to-[#0D8BE0] hover:from-[#259DE6] hover:to-[#0A77C2] text-white font-semibold text-sm tracking-wide shadow-[0_8px_20px_rgba(13,139,224,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] hover:shadow-[0_10px_25px_rgba(13,139,224,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Update password</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6 pt-5 border-t border-brand-100/60">
          <Link
            href="/login"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline"
          >
            Remembered your password? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md mx-auto p-12 text-center text-sm text-text-secondary">
          <div className="w-8 h-8 mx-auto border-2 border-brand-500 border-t-transparent rounded-full animate-spin mb-3" />
          <span>Loading reset page...</span>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
