// src/app/admin/layout.tsx
"use client";

import React from "react";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  CalendarCheck2,
  Wallet,
  Star,
  FileText,
  Activity,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { NavGroup } from "@/components/dashboard/Sidebar";

const adminNavGroups: NavGroup[] = [
  {
    group: "Platform operations",
    items: [
      {
        name: "Overview",
        href: "/admin",
        icon: LayoutDashboard,
      },
      {
        name: "User directory",
        href: "/admin/users",
        icon: Users,
      },
      {
        name: "Practice verification",
        href: "/admin/providers",
        icon: ShieldCheck,
        badge: "4",
      },
    ],
  },
  {
    group: "Care & financials",
    items: [
      {
        name: "Bookings & disputes",
        href: "/admin/bookings",
        icon: CalendarCheck2,
        badge: "2",
      },
      {
        name: "Payout settlements",
        href: "/admin/payouts",
        icon: Wallet,
      },
      {
        name: "Review moderation",
        href: "/admin/reviews",
        icon: Star,
      },
    ],
  },
  {
    group: "Platform oversight",
    items: [
      {
        name: "Content & notices",
        href: "/admin/cms",
        icon: FileText,
      },
      {
        name: "Audit logs",
        href: "/admin/audit-logs",
        icon: Activity,
      },
    ],
  },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell
      navGroups={adminNavGroups}
      role="ADMIN"
      brandTitle="PetCareLog"
      brandSubtitle="Super Admin"
      breadcrumbs={[
        { label: "PetCareLog", href: "/" },
        { label: "Admin Console", href: "/admin" },
      ]}
    >
      {children}
    </DashboardShell>
  );
}
