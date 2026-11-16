"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  MailCheck,
  RotateCw,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/authStore";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    const cleanVal = value.replace(/\D/g, "");
    if (!cleanVal && value !== "") return;

    const newOtp = [...otp];

    if (cleanVal.length > 1) {
      const digits = cleanVal.slice(0, 6).split("");
      digits.forEach((d, i) => {
        if (i < 6) newOtp[i] = d;
      });
      setOtp(newOtp);
      const nextIdx = Math.min(digits.length, 5);
      inputRefs.current[nextIdx]?.focus();
      return;
    }

    newOtp[index] = cleanVal;
    setOtp(newOtp);

    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, idx) => {
      if (idx < 6) newOtp[idx] = char;
    });
    setOtp(newOtp);
    const targetIdx = Math.min(pastedData.length, 5);
    inputRefs.current[targetIdx]?.focus();
  };

  const fullCode = otp.join("");
  const isComplete = fullCode.length === 6;

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isComplete) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    try {
      setLoading(true);
      const { data } = await apiClient.post("/auth/verify-email", {
        email: emailParam,
        otp: fullCode,
      });

      const resData = data.data || data;
      const accessToken = resData.accessToken || resData.token;
      let user = resData.user;

      if (!user && accessToken) {
        try {
          const meRes = await apiClient.get("/auth/me", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          user = meRes.data?.data || meRes.data?.user || meRes.data;
        } catch (_) {}
      }

      if (accessToken) {
        const maxAge = 7 * 24 * 60 * 60;
        document.cookie = `accessToken=${encodeURIComponent(accessToken)}; path=/; max-age=${maxAge}; SameSite=Lax`;
        document.cookie = `refreshToken=true; path=/; max-age=${maxAge}; SameSite=Lax`;
        document.cookie = `petcarelog_session=true; path=/; max-age=${maxAge}; SameSite=Lax`;
      }

      if (user && accessToken) {
        setAuth(user, accessToken);
      }

      toast.success("Email verified successfully!", {
        description: "Your account is now fully active.",
      });

      const role = user?.role || resData.role;
      const targetPath = role === "PROVIDER" ? "/dashboard/provider" : "/dashboard/owner";
      window.location.href = targetPath;
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Invalid or expired verification code.";
      toast.error("Verification failed", { description: message });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || resending) return;
    try {
      setResending(true);
      await apiClient.post("/auth/resend-otp", { email: emailParam });
      toast.success("New code sent!", {
        description: "Please check your email inbox and spam folder.",
      });
      setCountdown(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        "Failed to resend code. Please try again.";
      toast.error("Resend failed", { description: message });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-[2.5rem] border border-white/70 bg-white/45 backdrop-blur-2xl backdrop-saturate-150 p-6 sm:p-10 shadow-[0_10px_40px_rgba(1,95,160,0.12),inset_0_1px_0_rgba(255,255,255,0.9)]">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-sky-500/15 flex items-center justify-center text-brand-600 mb-4 border border-white/80 shadow-sm">
            <MailCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
            Check your email
          </h1>
          <p className="text-sm text-text-secondary mt-2 font-light">
            We sent a 6-digit confirmation code to:
          </p>
          <div className="mt-1 inline-block px-3 py-1 rounded-full bg-white/70 border border-brand-200/50 text-xs font-semibold text-brand-700">
            {emailParam || "your email address"}
          </div>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-between gap-2 sm:gap-2.5">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                className="w-11 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white focus:border-brand-500 shadow-inner transition-all duration-200"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={!isComplete || loading}
            className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#2FB0FF] to-[#0D8BE0] hover:from-[#259DE6] hover:to-[#0A77C2] text-white font-semibold text-sm tracking-wide shadow-[0_8px_20px_rgba(13,139,224,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] hover:shadow-[0_10px_25px_rgba(13,139,224,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Verify code</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6 pt-5 border-t border-brand-100/60">
          <p className="text-xs text-text-secondary mb-2">
            Didn&apos;t receive any code?
          </p>
          {countdown > 0 ? (
            <p className="text-xs text-brand-600 font-medium">
              Resend available in <span className="font-bold">{countdown}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline focus:outline-none disabled:opacity-50"
            >
              <RotateCw
                className={`w-3.5 h-3.5 ${resending ? "animate-spin" : ""}`}
              />
              <span>Resend 6-digit code</span>
            </button>
          )}

          <div className="mt-4">
            <Link
              href="/register"
              className="text-xs text-text-secondary hover:text-text-primary hover:underline"
            >
              Change email address
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md mx-auto p-12 text-center text-sm text-text-secondary">
          <div className="w-8 h-8 mx-auto border-2 border-brand-500 border-t-transparent rounded-full animate-spin mb-3" />
          <span>Loading verification...</span>
        </div>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}
