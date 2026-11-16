"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail, ArrowRight, KeyRound, ArrowLeft } from "lucide-react";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/lib/validations/auth";
import { apiClient } from "@/lib/api/client";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormData) => {
    try {
      setLoading(true);
      await apiClient.post("/auth/forgot-password", values);
      toast.success("Reset code sent!", {
        description: "Check your email for the 6-digit password reset code.",
      });
      router.push(`/reset-password?email=${encodeURIComponent(values.email)}`);
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to send reset code. Please try again.";
      toast.error("Request failed", { description: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-[2.5rem] border border-white/70 bg-white/45 backdrop-blur-2xl backdrop-saturate-150 p-6 sm:p-10 shadow-[0_10px_40px_rgba(1,95,160,0.12),inset_0_1px_0_rgba(255,255,255,0.9)]">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/15 flex items-center justify-center text-amber-600 mb-4 border border-white/80 shadow-sm">
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
            Reset password
          </h1>
          <p className="text-sm text-text-secondary mt-1.5 font-light">
            Enter your registered email and we&apos;ll send you a 6-digit recovery code.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <div className="w-6 h-6 rounded-lg bg-sky-500/15 flex items-center justify-center text-brand-600">
                  <Mail className="w-3.5 h-3.5" />
                </div>
              </div>
              <input
                type="email"
                {...register("email")}
                placeholder="name@example.com"
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white shadow-inner transition-all duration-200"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-500 mt-1 pl-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-6 rounded-full bg-gradient-to-r from-[#2FB0FF] to-[#0D8BE0] hover:from-[#259DE6] hover:to-[#0A77C2] text-white font-semibold text-sm tracking-wide shadow-[0_8px_20px_rgba(13,139,224,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] hover:shadow-[0_10px_25px_rgba(13,139,224,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Send recovery code</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6 pt-5 border-t border-brand-100/60">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to sign in</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
