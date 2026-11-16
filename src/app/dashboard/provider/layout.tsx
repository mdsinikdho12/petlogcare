// src/app/dashboard/provider/layout.tsx
"use client";

import React from "react";
import {
  LayoutDashboard,
  ShieldCheck,
  Stethoscope,
  Clock,
  CalendarCheck2,
  Users,
  Wallet,
  Building2,
  MessageSquare,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { NavGroup } from "@/components/dashboard/Sidebar";

const providerNavGroups: NavGroup[] = [
  {
    group: "Practice management",
    items: [
      {
        name: "Overview",
        href: "/dashboard/provider",
        icon: LayoutDashboard,
      },
      {
        name: "Verification & setup",
        href: "/dashboard/provider/onboarding",
        icon: ShieldCheck,
      },
      {
        name: "Services & pricing",
        href: "/dashboard/provider/services",
        icon: Stethoscope,
      },
      {
        name: "Operating hours",
        href: "/dashboard/provider/availability",
        icon: Clock,
      },
    ],
  },
  {
    group: "Operations & flow",
    items: [
      {
        name: "Patient bookings",
        href: "/dashboard/provider/bookings",
        icon: CalendarCheck2,
      },
      {
        name: "Patient chats",
        href: "/dashboard/provider/messages",
        icon: MessageSquare,
        badge: "Live",
      },
      {
        name: "Staff members",
        href: "/dashboard/provider/staff",
        icon: Users,
      },
    ],
  },
  {
    group: "Financials & clinic",
    items: [
      {
        name: "Wallet & payouts",
        href: "/dashboard/provider/wallet",
        icon: Wallet,
      },
      {
        name: "Clinic profile",
        href: "/dashboard/provider/profile",
        icon: Building2,
      },
    ],
  },
];

export default function ProviderDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell
      navGroups={providerNavGroups}
      role="PROVIDER"
      brandTitle="PetCareLog"
      brandSubtitle="Clinic Console"
      breadcrumbs={[
        { label: "PetCareLog", href: "/" },
        { label: "Provider Console", href: "/dashboard/provider" },
      ]}
    >
      {children}
    </DashboardShell>
  );
}
