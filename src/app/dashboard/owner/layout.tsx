// src/app/dashboard/owner/layout.tsx
"use client";

import React from "react";
import {
  LayoutDashboard,
  Dog,
  CalendarCheck2,
  Bell,
  MessageSquare,
  User,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { NavGroup } from "@/components/dashboard/Sidebar";

const ownerNavGroups: NavGroup[] = [
  {
    group: "Core care",
    items: [
      {
        name: "Overview",
        href: "/dashboard/owner",
        icon: LayoutDashboard,
      },
      {
        name: "My pets",
        href: "/dashboard/owner/pets",
        icon: Dog,
      },
      {
        name: "Reminders",
        href: "/dashboard/owner/reminders",
        icon: Bell,
      },
    ],
  },
  {
    group: "Visits & consults",
    items: [
      {
        name: "Appointments",
        href: "/dashboard/owner/bookings",
        icon: CalendarCheck2,
      },
      {
        name: "Care chats",
        href: "/dashboard/owner/messages",
        icon: MessageSquare,
        badge: "Live",
      },
    ],
  },
  {
    group: "Account",
    items: [
      {
        name: "My profile",
        href: "/dashboard/owner/profile",
        icon: User,
      },
    ],
  },
];

export default function OwnerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell
      navGroups={ownerNavGroups}
      role="OWNER"
      brandTitle="PetCareLog"
      brandSubtitle="Owner Hub"
      breadcrumbs={[
        { label: "PetCareLog", href: "/" },
        { label: "Owner Hub", href: "/dashboard/owner" },
      ]}
    >
      {children}
    </DashboardShell>
  );
}
