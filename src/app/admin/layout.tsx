// src/app/admin/layout.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  CalendarCheck2,
  Wallet,
  Star,
  FileText,
  Activity,
  Lock,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { NavGroup } from "@/components/dashboard/Sidebar";
import { useAuthStore } from "@/lib/store/authStore";

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
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Client-side guard for admin
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("petcarelog-auth");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const currentUser = parsed?.state?.user;
          const isAuth = parsed?.state?.isAuthenticated;
          if (!isAuth) {
            router.replace("/login?redirect=/admin");
          } else if (currentUser?.role && currentUser.role !== "ADMIN") {
            const redirectPath = currentUser.role === "PROVIDER" ? "/dashboard/provider" : "/dashboard/owner";
            router.replace(redirectPath);
          }
        } catch (_) {}
      } else if (!isAuthenticated) {
        router.replace("/login?redirect=/admin");
      }
    }
  }, [router, isAuthenticated]);

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
