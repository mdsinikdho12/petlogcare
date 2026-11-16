// src/components/dashboard/Sidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PawPrint,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/authStore";

export interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
}

export interface NavGroup {
  group?: string;
  items: NavItem[];
}

interface SidebarProps {
  navGroups: NavGroup[];
  role: "OWNER" | "PROVIDER" | "ADMIN";
  collapsed: boolean;
  onToggleCollapse: () => void;
  brandTitle?: string;
  brandSubtitle?: string;
}

export default function Sidebar({
  navGroups,
  role,
  collapsed,
  onToggleCollapse,
  brandTitle = "PetCareLog",
  brandSubtitle = "Dashboard",
}: SidebarProps) {
  const pathname = usePathname();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    window.location.href = "/";
  };

  // Role accents for active border indicator and subtle tint
  const roleAccent = {
    OWNER: {
      activeBorder: "border-l-[#0D8BE0]",
      activeBg: "bg-[#0D8BE0]/12",
      activeText: "text-[#06395F]",
      iconActive: "text-[#0D8BE0] bg-[#0D8BE0]/15",
      badge: "bg-sky-100 text-sky-800",
      logoBg: "bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0]",
    },
    PROVIDER: {
      activeBorder: "border-l-emerald-600",
      activeBg: "bg-emerald-500/12",
      activeText: "text-[#06395F]",
      iconActive: "text-emerald-600 bg-emerald-500/15",
      badge: "bg-emerald-100 text-emerald-800",
      logoBg: "bg-gradient-to-b from-emerald-500 to-teal-600",
    },
    ADMIN: {
      activeBorder: "border-l-indigo-600",
      activeBg: "bg-indigo-500/12",
      activeText: "text-[#06395F]",
      iconActive: "text-indigo-600 bg-indigo-500/15",
      badge: "bg-indigo-100 text-indigo-800",
      logoBg: "bg-gradient-to-b from-indigo-500 to-indigo-700",
    },
  }[role];

  const avatarSrc =
    user?.profileImage?.url ||
    (user as any)?.avatar ||
    (user as any)?.image;

  return (
    <aside
      className={cn(
        "sticky top-0 h-dvh z-30 hidden md:flex flex-col justify-between shrink-0 transition-all duration-300 ease-in-out",
        "border-r border-white/80 bg-white/55 backdrop-blur-xl backdrop-saturate-150",
        "shadow-[0_8px_30px_rgba(1,95,160,0.10),inset_0_1px_0_rgba(255,255,255,0.95)]",
        "p-3.5",
        collapsed ? "w-[72px]" : "w-[72px] lg:w-[264px]"
      )}
      aria-label="Dashboard Sidebar Navigation"
    >
      <div className="flex flex-col min-h-0 flex-1 space-y-4">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 pt-1 pb-2 border-b border-[#06395F]/10">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2.5 transition-transform hover:opacity-90",
              collapsed && "justify-center w-full"
            )}
          >
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] text-white shadow-xs",
                roleAccent.logoBg
              )}
            >
              <PawPrint className="h-5 w-5" aria-hidden="true" />
            </div>

            {!collapsed && (
              <div className="hidden lg:flex flex-col min-w-0">
                <span className="font-display text-[15px] font-bold tracking-tight text-[#06395F] leading-tight truncate">
                  {brandTitle}
                </span>
                <span className="text-[12px] font-medium text-[#06395F]/60 capitalize truncate">
                  {brandSubtitle}
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-0.5 scrollbar-none">
          {navGroups.map((group, gIdx) => (
            <div key={group.group || gIdx} className="space-y-1">
              {!collapsed && group.group && (
                <div className="hidden lg:block px-2.5 py-1">
                  <span className="text-[12px] font-medium text-[#06395F]/60 capitalize">
                    {group.group}
                  </span>
                </div>
              )}

              {group.items.map((item) => {
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
                    title={collapsed ? item.name : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded-[11px] text-[13px] font-medium transition-all duration-150",
                      collapsed
                        ? "h-10 w-10 justify-center mx-auto"
                        : "px-2.5 py-2 justify-between lg:px-3",
                      isActive
                        ? cn(
                            "border-l-[3px] font-semibold",
                            roleAccent.activeBorder,
                            roleAccent.activeBg,
                            roleAccent.activeText
                          )
                        : "text-[#06395F]/80 hover:bg-white/60 hover:text-[#06395F]"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-[11px] transition-colors",
                          isActive
                            ? roleAccent.iconActive
                            : "bg-[#06395F]/5 text-[#06395F]/70"
                        )}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </div>

                      {!collapsed && (
                        <span className="hidden lg:inline truncate font-medium">
                          {item.name}
                        </span>
                      )}
                    </div>

                    {!collapsed && item.badge && (
                      <span
                        className={cn(
                          "hidden lg:inline-flex rounded-[8px] px-1.5 py-0.5 text-[11px] font-semibold shrink-0",
                          roleAccent.badge
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer: User Profile Block & Collapse Toggle */}
      <div className="pt-3 border-t border-[#06395F]/10 space-y-2 shrink-0">
        {!collapsed ? (
          <div className="hidden lg:flex items-center justify-between p-2 rounded-[11px] bg-white/70 border border-white/80 shadow-[0_1px_2px_rgba(6,57,95,0.04)]">
            <Link
              href={
                role === "PROVIDER"
                  ? "/dashboard/provider/profile"
                  : "/dashboard/owner/profile"
              }
              className="flex items-center gap-2 min-w-0 flex-1 hover:opacity-80 transition"
            >
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={user?.name || "Avatar"}
                  className="h-8 w-8 rounded-full object-cover border border-white/80 shrink-0"
                />
              ) : (
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold shadow-xs",
                    roleAccent.logoBg
                  )}
                >
                  {user?.name ? user.name[0].toUpperCase() : "U"}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-semibold text-[#06395F] truncate">
                  {user?.name || "User"}
                </span>
                <span className="text-[12px] text-[#06395F]/60 truncate">
                  {user?.email || "Account"}
                </span>
              </div>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              title="Sign Out"
              aria-label="Sign out"
              className="p-1.5 rounded-[11px] text-[#06395F]/70 hover:bg-rose-50 hover:text-rose-600 transition"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleLogout}
            title="Sign Out"
            aria-label="Sign out"
            className="flex h-10 w-10 mx-auto items-center justify-center rounded-[11px] text-[#06395F]/70 hover:bg-rose-50 hover:text-rose-600 transition"
          >
            <LogOut className="h-4 w-4" />
          </button>
        )}

        {/* Collapse / Expand Toggle Button */}
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex h-8 w-full items-center justify-center rounded-[11px] bg-white/45 text-[#06395F]/60 hover:bg-white/80 hover:text-[#06395F] transition text-[12px] font-medium"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <div className="flex items-center gap-1.5">
              <ChevronLeft className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">Collapse</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
