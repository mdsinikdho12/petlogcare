"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { apiClient } from "@/lib/api/client";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function processAuth() {
      try {
        const tokenFromQuery =
          searchParams.get("accessToken") ||
          searchParams.get("token");

        if (tokenFromQuery) {
          localStorage.setItem("accessToken", tokenFromQuery);
        }

        // Fetch current authenticated user
        const { data } = await apiClient.get("/auth/me");
        const user = data.data || data.user || data;
        const finalToken =
          tokenFromQuery ||
          localStorage.getItem("accessToken") ||
          "";

        setAuth(user, finalToken);

        if (user.role === "PROVIDER") {
          router.replace("/dashboard/provider");
        } else {
          router.replace("/dashboard/owner");
        }
      } catch (err: any) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Failed to complete Google authentication. Please try logging in again.";
        setError(message);
      }
    }

    processAuth();
  }, [router, searchParams, setAuth]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-[2.5rem] border border-white/70 bg-white/45 backdrop-blur-2xl backdrop-saturate-150 p-8 text-center shadow-[0_10px_40px_rgba(1,95,160,0.12),inset_0_1px_0_rgba(255,255,255,0.9)]">
        {error ? (
          <div className="space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/15 flex items-center justify-center text-rose-600 border border-white/80 shadow-sm">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold text-[#06395F]">
              Authentication Failed
            </h1>
            <p className="text-sm text-[#0B4C7A]/75 font-light">
              {error}
            </p>
            <div className="pt-2">
              <button
                onClick={() => router.push("/login")}
                className="inline-flex h-10 px-5 items-center justify-center rounded-full bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5"
              >
                Return to Login
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-sky-500/15 flex items-center justify-center text-[#0D8BE0] border border-white/80 shadow-sm">
              <Loader2 className="w-7 h-7 animate-spin" />
            </div>
            <h1 className="text-xl font-bold text-[#06395F]">
              Authenticating with Google...
            </h1>
            <p className="text-sm text-[#0B4C7A]/75 font-light">
              Setting up your secure session and redirecting to your dashboard.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md mx-auto p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#0D8BE0]" />
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}
