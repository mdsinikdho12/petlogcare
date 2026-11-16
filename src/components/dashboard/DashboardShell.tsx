// src/components/dashboard/DashboardShell.tsx
"use client";

import React, { useState, useEffect } from "react";
import Sidebar, { NavGroup } from "./Sidebar";
import Topbar from "./Topbar";
import MobileBottomNav from "./MobileBottomNav";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  children: React.ReactNode;
  navGroups: NavGroup[];
  role: "OWNER" | "PROVIDER" | "ADMIN";
  title?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  brandTitle?: string;
  brandSubtitle?: string;
  actions?: React.ReactNode;
}

export default function DashboardShell({
  children,
  navGroups,
  role,
  title,
  breadcrumbs,
  brandTitle = "PetCareLog",
  brandSubtitle = "Dashboard",
  actions,
}: DashboardShellProps) {
  // Sidebar collapse state: collapsed on tablet (768px - 1024px), expanded on large desktop (>= 1024px)
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setCollapsed(true);
      } else if (window.innerWidth >= 1024) {
        setCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={cn(
        "relative min-h-dvh w-full bg-gradient-to-br from-[#CFE8FF] to-[#EEF7FF] text-[#06395F] antialiased selection:bg-[#2FB0FF]/20 selection:text-[#06395F]",
        "md:grid transition-all duration-300",
        collapsed
          ? "md:grid-cols-[72px_1fr]"
          : "md:grid-cols-[72px_1fr] lg:grid-cols-[264px_1fr]"
      )}
    >
      {/* Background ambient blurred colour blobs - clearly visible to give depth to glass */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none overflow-hidden -z-10"
      >
        {/* Cyan blob top-left */}
        <div className="absolute -top-16 -left-20 h-[500px] w-[500px] rounded-full bg-[#9EE7FF]/60 blur-3xl" />
        {/* Soft pink blob center-right */}
        <div className="absolute top-[28%] -right-24 h-[480px] w-[480px] rounded-full bg-[#FFD6E8]/70 blur-3xl" />
        {/* Cream blob bottom-left */}
        <div className="absolute -bottom-20 left-[18%] h-[460px] w-[460px] rounded-full bg-[#FFF1C9]/60 blur-3xl" />
      </div>

      {/* Full-height sticky glass sidebar flush to the left edge */}
      <Sidebar
        navGroups={navGroups}
        role={role}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        brandTitle={brandTitle}
        brandSubtitle={brandSubtitle}
      />

      {/* Main Column */}
      <div className="flex flex-col min-w-0 w-full">
        {/* Topbar sticky at top */}
        <Topbar
          title={title}
          breadcrumbs={breadcrumbs}
          role={role}
          actions={actions}
        />

        {/* Content area: starts from the left of the main column, up to 1440px */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
          <div className="w-full max-w-[1440px]">{children}</div>
        </main>
      </div>

      {/* Mobile Bottom Tab Navigation */}
      <MobileBottomNav navGroups={navGroups} role={role} />
    </div>
  );
}
