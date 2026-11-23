"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Sparkles, Check } from "lucide-react";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { apiClient } from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/authStore";

/* ---------- Shared style tokens ---------- */
const panel =
  "w-full max-w-md rounded-[2.5rem] border border-white/70 bg-white/55 p-6 sm:p-10 " +
  "shadow-[0_20px_60px_rgba(1,95,160,0.18),inset_0_1px_0_rgba(255,255,255,0.9)] " +
  "backdrop-blur-2xl backdrop-saturate-150";

const inputCls =
  "h-12 w-full rounded-2xl border border-white/80 bg-white/75 pl-11 pr-4 text-base text-[#06395F] sm:text-sm " +
  "shadow-[inset_0_1px_2px_rgba(1,95,160,0.08)] outline-none transition placeholder:text-[#06395F]/40 " +
  "focus:bg-white focus:ring-2 focus:ring-[#0D96E6] aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-rose-400";

const primaryBtn =
  "flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] " +
  "text-sm font-semibold text-white shadow-[0_8px_24px_rgba(13,150,230,0.4),inset_0_1px_0_rgba(255,255,255,0.5)] " +
  "transition duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D8BE0]";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D96E6]";

/* ---------- Small field wrapper: label, icon, error ---------- */
function Field({
  id,
  label,
  icon: Icon,
  error,
  labelRight,
  children,
}: {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  error?: string;
  labelRight?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-[#06395F]">
          {label}
        </label>
        {labelRight}
      </div>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#06395F]/45" />
        {children}
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600">
          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");
  const isSessionExpired = searchParams.get("session_expired") === "true";

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user, isAuthenticated, setAuth } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user && !isSessionExpired) {
      const target =
        redirectPath ||
        (user.role === "ADMIN"
          ? "/admin"
          : user.role === "PROVIDER"
          ? "/dashboard/provider"
          : "/dashboard/owner");
      window.location.href = target;
    }
  }, [isAuthenticated, user, isSessionExpired, redirectPath]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const handleQuickFill = (email: string, pass: string) => {
    setValue("email", email, { shouldValidate: true });
    setValue("password", pass, { shouldValidate: true });
    toast.success("Demo credentials loaded into form");
  };

  const onSubmit = async (values: LoginFormData) => {
    try {
      setLoading(true);
      const res = await apiClient.post("/auth/login", values);
      const resData = res.data?.data || res.data || {};
      const accessToken = resData.accessToken || resData.token;

      let user = resData.user;
      if (!user && accessToken) {
        try {
          const meRes = await apiClient.get("/auth/me", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          user = meRes.data?.data || meRes.data?.user || meRes.data;
        } catch (_) {
          // fallback gracefully
        }
      }

      if (!user) {
        user = {
          id: "me",
          name: values.email.split("@")[0],
          email: values.email,
          role: "USER",
          status: "ACTIVE",
        };
      }

      // Set cookies immediately for Next.js middleware
      if (accessToken) {
        const maxAge = 7 * 24 * 60 * 60;
        document.cookie = `accessToken=${encodeURIComponent(accessToken)}; path=/; max-age=${maxAge}; SameSite=Lax`;
        document.cookie = `refreshToken=true; path=/; max-age=${maxAge}; SameSite=Lax`;
        document.cookie = `petcarelog_session=true; path=/; max-age=${maxAge}; SameSite=Lax`;
        if (user?.role) {
          document.cookie = `userRole=${encodeURIComponent(user.role)}; path=/; max-age=${maxAge}; SameSite=Lax`;
        }
      }

      setAuth(user, accessToken);
      toast.success("Welcome back!", {
        description: `Logged in as ${user.name || "PetCareLog User"}`,
      });

      const targetPath =
        redirectPath ||
        (user.role === "ADMIN"
          ? "/admin"
          : user.role === "PROVIDER"
          ? "/dashboard/provider"
          : "/dashboard/owner");

      // Full navigation ensures middleware receives the fresh cookies
      window.location.href = targetPath;
    } catch (err: any) {
      let message = err.response?.data?.message;
      if (!message) {
        if (!err.response) {
          message = "Cannot connect to server. Please check your internet or retry.";
        } else if (err.response.status === 401) {
          message = "Invalid email or password. Please check your credentials.";
        } else if (err.response.status === 403) {
          message = "Please verify your email address before logging in.";
        } else {
          message = "Sign in failed. Please try again later.";
        }
      }
      toast.error("Sign in failed", { description: message });
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const backendUrl = "https://petcarelog-api.lokmansarkar.com/api/v1";
    window.location.href = `${backendUrl}/auth/google`;
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {isSessionExpired && (
        <div
          role="alert"
          className="flex w-full max-w-md items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50/90 p-3.5 text-sm text-amber-800 backdrop-blur-xl"
        >
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-600" aria-hidden />
          Your session has expired. Please sign in again to continue.
        </div>
      )}

      <div className={panel}>
        <div className="mb-7 text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight text-[#06395F]">Welcome back</h1>
          <p className="mt-2 text-sm leading-relaxed text-[#0B4C7A]/75">
            Sign in to your pet health dashboard.
          </p>
        </div>

        {/* Demo Account Quick-Fill Helper */}
        <div className="mb-5 p-3 rounded-2xl border border-sky-200/80 bg-sky-50/70 text-left">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#06395F] mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#0D8BE0]" />
            <span>Quick Demo Login (Live Database):</span>
          </div>
          <button
            type="button"
            onClick={() => handleQuickFill("ilovems336@gmail.com", "Mishti@2026")}
            className="w-full text-left p-2 rounded-xl bg-white border border-sky-100 hover:border-sky-300 text-xs text-[#06395F] flex items-center justify-between group transition"
          >
            <div>
              <span className="font-semibold block text-[#0D8BE0]">Pet Owner Account</span>
              <span className="text-[11px] text-[#0B4C7A]/70">ilovems336@gmail.com</span>
            </div>
            <span className="text-[10px] font-bold text-[#0D8BE0] bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200 group-hover:bg-[#0D8BE0] group-hover:text-white transition">
              Click to Fill
            </span>
          </button>
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className={`flex h-12 w-full items-center justify-center gap-3 rounded-full border border-white/80 bg-white/85 text-sm font-semibold text-[#06395F] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_8px_rgba(1,95,160,0.08)] transition duration-200 hover:-translate-y-0.5 hover:bg-white active:translate-y-0 ${focusRing}`}
        >
          <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" aria-hidden>
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z" />
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
          </svg>
          Continue with Google
        </button>

        <div className="my-6 flex items-center gap-3 text-xs text-[#0B4C7A]/60">
          <span className="h-px flex-1 bg-[#06395F]/10" />
          or sign in with email
          <span className="h-px flex-1 bg-[#06395F]/10" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <Field id="email" label="Email address" icon={Mail} error={errors.email?.message}>
            <input
              id="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="name@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={inputCls}
              {...register("email")}
            />
          </Field>

          <Field
            id="password"
            label="Password"
            icon={Lock}
            error={errors.password?.message}
            labelRight={
              <Link
                href="/forgot-password"
                className={`rounded text-xs font-medium text-[#0D7FCB] hover:underline ${focusRing}`}
              >
                Forgot password?
              </Link>
            }
          >
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              className={`${inputCls} pr-12`}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className={`absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-[#06395F]/60 transition-colors hover:bg-white hover:text-[#06395F] ${focusRing}`}
            >
              {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
            </button>
          </Field>

          <label htmlFor="rememberMe" className="flex w-fit cursor-pointer select-none items-center gap-2.5 pt-1 text-sm text-[#0B4C7A]/80">
            <input
              id="rememberMe"
              type="checkbox"
              className="h-4 w-4 rounded accent-[#0D8BE0]"
              {...register("rememberMe")}
            />
            Remember me on this browser
          </label>

          <button type="submit" disabled={loading} aria-busy={loading} className={`${primaryBtn} mt-2`}>
            {loading ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden />
                Signing in…
              </>
            ) : (
              <>
                Sign in
                <ArrowRight className="h-4 w-4" aria-hidden />
              </>
            )}
          </button>
        </form>

        <p className="mt-7 border-t border-[#06395F]/10 pt-5 text-center text-sm text-[#0B4C7A]/75">
          Don&rsquo;t have an account?{" "}
          <Link href="/register" className={`rounded font-semibold text-[#0D7FCB] hover:underline ${focusRing}`}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className={`${panel} text-center text-sm text-[#0B4C7A]/75`} role="status">
          <span className="mx-auto mb-3 block h-8 w-8 animate-spin rounded-full border-2 border-[#0D8BE0] border-t-transparent" aria-hidden />
          Loading sign in…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
