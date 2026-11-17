import Link from "next/link";
import { Home, Search, Sparkles } from "lucide-react";
import InteractiveCat from "@/components/sections/InteractiveCat";

export default function NotFound() {
  return (
    <div className="relative min-h-[calc(100vh-140px)] flex items-center justify-center px-4 pt-28 sm:pt-32 pb-16 text-[#06395F] overflow-hidden">
      {/* Ambient background blurred blobs */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none overflow-hidden -z-10"
      >
        <div className="absolute top-1/4 -left-20 h-[500px] w-[500px] rounded-full bg-[#9EE7FF]/60 blur-3xl" />
        <div className="absolute top-1/3 -right-20 h-[480px] w-[480px] rounded-full bg-[#FFD6E8]/70 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-[460px] w-[460px] rounded-full bg-[#FFF1C9]/60 blur-3xl" />
      </div>

      {/* Main Glass 404 Panel */}
      <div className="relative z-10 w-full max-w-lg rounded-[13px] border border-white/80 bg-white/70 p-8 sm:p-10 text-center shadow-[0_12px_40px_rgba(1,95,160,0.12),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-2xl backdrop-saturate-150 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Animated Interactive Cat with sound and mouse tracking */}
        <div className="relative mx-auto h-56 w-56 flex items-center justify-center">
          <InteractiveCat />
        </div>

        {/* 404 Status Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[8px] bg-sky-500/15 text-[#0D8BE0] text-[12px] font-semibold border border-white/80 shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Error 404 • Page lost its trail</span>
        </div>

        {/* Title and Explanation */}
        <div className="space-y-2">
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#06395F]">
            Looks like our kitty floated away
          </h1>
          <p className="text-[13px] sm:text-sm text-[#06395F]/80 max-w-md mx-auto leading-relaxed font-normal">
            The page, clinic profile, or medical passport you were looking for doesn&apos;t exist or has moved to a new home. Click the cat to cheer it up!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white text-[13px] font-semibold shadow-[0_4px_14px_rgba(13,150,230,0.30)] hover:-translate-y-0.5 active:translate-y-0 transition"
          >
            <Home className="w-4 h-4" />
            <span>Back to home</span>
          </Link>

          <Link
            href="/providers"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[11px] border border-[#06395F]/15 bg-white text-[#06395F] text-[13px] font-semibold hover:bg-slate-50 transition shadow-2xs"
          >
            <Search className="w-4 h-4 text-[#0D8BE0]" />
            <span>Find verified clinics</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
