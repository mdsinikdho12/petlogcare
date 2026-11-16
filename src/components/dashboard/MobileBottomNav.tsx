// src/components/dashboard/MobileBottomNav.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoreHorizontal, X, LogOut, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/authStore";
import { NavItem, NavGroup } from "./Sidebar";

interface MobileBottomNavProps {
  navGroups: NavGroup[];
  role: "OWNER" | "PROVIDER" | "ADMIN";
}

export default function MobileBottomNav({
  navGroups,
  role,
}: MobileBottomNavProps) {
  const pathname = usePathname();
  const { user, clearAuth } = useAuthStore();
  const [moreOpen, setMoreOpen] = useState(false);

  // Flatten items
  const allItems: NavItem[] = navGroups.flatMap((g) => g.items);
  // Show up to 4 direct items, 5th is "More" if count > 4
  const directItems = allItems.slice(0, 4);
  const overflowItems = allItems.slice(4);

  const roleAccent = {
    OWNER: "text-[#0D8BE0]",
    PROVIDER: "text-emerald-600",
    ADMIN: "text-indigo-600",
  }[role];

  const handleLogout = () => {
    clearAuth();
    window.location.href = "/";
  };

  return (
    <>
      {/* Mobile Bottom Tab Bar (Pure Liquid Glass) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="fixed bottom-0 inset-x-0 z-40 md:hidden border-t border-white/80 bg-white/65 backdrop-blur-xl backdrop-saturate-150 shadow-[0_-8px_30px_rgba(1,95,160,0.10)] px-2 py-1.5 pb-safe"
      >
        <div className="flex items-center justify-around">
          {directItems.map((item) => {
            const isActive =
              item.href === "/dashboard/owner" ||
              item.href === "/dashboard/provider" ||
              item.href === "/admin"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex min-h-[44px] min-w-[48px] flex-col items-center justify-center gap-1 rounded-[11px] py-1 text-[11px] font-semibold transition-colors",
                  isActive
                    ? cn("font-bold", roleAccent)
                    : "text-[#06395F]/70 hover:text-[#06395F]"
                )}
              >
                <div
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-[8px] transition-transform",
                    isActive && "scale-110"
                  )}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <span className="truncate max-w-[64px]">{item.name}</span>
              </Link>
            );
          })}

          {/* More Sheet Trigger */}
          {overflowItems.length > 0 && (
            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              aria-label="More navigation options"
              className={cn(
                "flex min-h-[44px] min-w-[48px] flex-col items-center justify-center gap-1 rounded-[11px] py-1 text-[11px] font-semibold text-[#06395F]/70 hover:text-[#06395F]",
                moreOpen && roleAccent
              )}
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-[8px]">
                <MoreHorizontal className="h-5 w-5" />
              </div>
              <span>More</span>
            </button>
          )}
        </div>
      </nav>

      {/* "More" Bottom Sheet Modal (Liquid Glass) */}
      {moreOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#06395F]/30 backdrop-blur-sm transition-opacity"
            onClick={() => setMoreOpen(false)}
            aria-hidden="true"
          />

          {/* Sheet Panel */}
          <div className="relative z-10 w-full rounded-t-[13px] border-t border-white/80 bg-white/90 p-5 shadow-2xl backdrop-blur-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#06395F]/10">
              <span className="text-sm font-bold text-[#06395F]">
                More options
              </span>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                aria-label="Close menu"
                className="p-1 rounded-[11px] text-[#06395F]/70 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="py-3 space-y-1">
              {overflowItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-[11px] text-xs font-semibold transition",
                      isActive
                        ? "bg-[#0D8BE0]/15 text-[#0D8BE0]"
                        : "text-[#06395F] hover:bg-white"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-[11px] bg-sky-500/10 text-[#0D8BE0]">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span>{item.name}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-[#06395F]/40" />
                  </Link>
                );
              })}
            </div>

            {/* Logout row */}
            <div className="pt-3 border-t border-[#06395F]/10">
              <button
                type="button"
                onClick={() => {
                  setMoreOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[11px] text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-[11px] bg-rose-50 text-rose-600">
                  <LogOut className="h-4 w-4" />
                </div>
                <span>Sign out ({user?.name || "Account"})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
