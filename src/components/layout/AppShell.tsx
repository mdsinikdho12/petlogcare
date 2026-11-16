"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Route groupings
  const isDashboard =
    pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  const isAuth =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/verify-email") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/auth/");

  // 1. Dashboard & Admin: No public Navbar, No public Footer
  if (isDashboard) {
    return <main className="flex-1 w-full min-h-screen">{children}</main>;
  }

  // 2. Auth flows: Has top Navbar for branding/navigation, but NO public Footer
  if (isAuth) {
    return (
      <div className="flex flex-col min-h-screen w-full">
        <Navbar />
        <main className="flex-1 w-full flex flex-col justify-center">{children}</main>
      </div>
    );
  }

  // 3. Public website: Navbar + Main + Footer
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
}
