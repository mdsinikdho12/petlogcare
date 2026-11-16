import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import Providers from "./providers";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PetCareLog — Pet Health Records & Veterinary Booking",
  description:
    "Comprehensive pet health records, appointment booking, and verified veterinary services for pet owners in Bangladesh.",
  keywords: ["pet care", "veterinary", "pet health records", "pet booking", "Bangladesh"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistMono.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Agrave+Pro:wght@100..700&family=Caveat:wght@600;700&family=Noto+Sans+Bengali:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-surface-50 text-text-primary">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
