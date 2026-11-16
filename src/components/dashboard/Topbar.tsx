// src/components/dashboard/Topbar.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  ChevronRight,
  User,
  LogOut,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/authStore";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface TopbarProps {
  title?: string;
  breadcrumbs?: BreadcrumbItem[];
  role: "OWNER" | "PROVIDER" | "ADMIN";
  onOpenMobileMenu?: () => void;
  actions?: React.ReactNode;
}

export default function Topbar({
  title,
  breadcrumbs,
  role,
  onOpenMobileMenu,
  actions,
}: TopbarProps) {
  const { user, clearAuth } = useAuthStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    if (!userMenuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [userMenuOpen]);

  const handleLogout = () => {
    clearAuth();
    window.location.href = "/";
  };

  const avatarSrc =
    user?.profileImage?.url ||
    (user as any)?.avatar ||
    (user as any)?.image;

  return (
    <header className="sticky top-0 z-20 w-full border-b border-white/80 bg-white/55 backdrop-blur-xl backdrop-saturate-150 shadow-[0_8px_30px_rgba(1,95,160,0.08),inset_0_1px_0_rgba(255,255,255,0.95)]">
      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Mobile menu toggle & Breadcrumbs / Title */}
        <div className="flex items-center gap-3 min-w-0">
          {onOpenMobileMenu && (
            <button
              type="button"
              onClick={onOpenMobileMenu}
              aria-label="Open navigation menu"
              className="flex h-9 w-9 md:hidden items-center justify-center rounded-[11px] border border-white/80 bg-white/70 text-[#06395F] shadow-xs hover:bg-white"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <div className="flex flex-col min-w-0">
            {breadcrumbs && breadcrumbs.length > 0 ? (
              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13px] text-[#06395F]/70">
                {breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#06395F]/40" />}
                    {crumb.href ? (
                      <Link
                        href={crumb.href}
                        className="hover:text-[#06395F] transition truncate"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="font-semibold text-[#06395F] truncate">
                        {crumb.label}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            ) : (
              <h1 className="font-display text-lg sm:text-xl font-bold tracking-tight text-[#06395F] truncate">
                {title || "Dashboard"}
              </h1>
            )}
          </div>
        </div>

        {/* Right: Actions, Role Badge, Notifications Bell & Profile Menu */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {actions && <div className="hidden sm:block">{actions}</div>}

          {/* Role Status Badge (rounded-[8px]) */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] border border-white/80 bg-white/70 text-[12px] font-medium text-[#06395F] shadow-xs">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                role === "OWNER"
                  ? "bg-[#0D8BE0]"
                  : role === "PROVIDER"
                  ? "bg-emerald-500 animate-pulse"
                  : "bg-indigo-600"
              )}
            />
            <span>
              {role === "OWNER"
                ? "Pet parent"
                : role === "PROVIDER"
                ? "Verified clinic"
                : "Admin council"}
            </span>
          </div>

          {/* Notifications Bell (rounded-[11px], dot rounded-full) */}
          <Link
            href={
              role === "PROVIDER"
                ? "/dashboard/provider/messages"
                : "/dashboard/owner/messages"
            }
            title="Notifications & Messages"
            aria-label="View messages and notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-[11px] border border-white/80 bg-white/70 text-[#06395F] hover:bg-white shadow-xs transition"
          >
            <Bell className="h-4 w-4 text-[#06395F]" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#0D8BE0] ring-2 ring-white" />
          </Link>

          {/* User Profile Dropdown Button */}
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              aria-haspopup="true"
              aria-expanded={userMenuOpen}
              aria-label="User menu"
              className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-[11px] border border-white/80 bg-white/70 hover:bg-white transition shadow-xs"
            >
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={user?.name || "Profile"}
                  className="h-7 w-7 rounded-full object-cover border border-white/80 shrink-0"
                />
              ) : (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#2FB0FF] to-[#0D8BE0] text-white text-[11px] font-bold shadow-xs">
                  {user?.name ? user.name[0].toUpperCase() : "U"}
                </div>
              )}

              <span className="hidden md:inline text-[13px] font-semibold text-[#06395F] max-w-[120px] truncate">
                {user?.name || "My Account"}
              </span>
            </button>

            {/* Pure Glass Dropdown Menu */}
            {userMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-56 rounded-[13px] border border-white/80 bg-white/85 p-1.5 shadow-[0_12px_40px_rgba(1,95,160,0.14)] backdrop-blur-xl backdrop-saturate-150 animate-in fade-in zoom-in-95 duration-150 z-50"
              >
                <div className="px-3 py-2 border-b border-[#06395F]/10 mb-1">
                  <p className="text-[13px] font-bold text-[#06395F] truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-[12px] text-[#06395F]/60 truncate">
                    {user?.email || "Account"}
                  </p>
                </div>

                <Link
                  href={
                    role === "PROVIDER"
                      ? "/dashboard/provider/profile"
                      : "/dashboard/owner/profile"
                  }
                  role="menuitem"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-[#06395F] rounded-[9px] hover:bg-sky-50 transition"
                >
                  <User className="h-4 w-4 text-[#0D8BE0]" />
                  <span>Profile settings</span>
                </Link>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setUserMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-rose-600 rounded-[9px] hover:bg-rose-50 transition mt-1"
                >
                  <LogOut className="h-4 w-4 text-rose-500" />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
