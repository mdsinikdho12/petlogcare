
import React from "react";
import Image from "next/image";
import { BadgeCheck, Bell, ClipboardList, Star } from "lucide-react";

const glass =
  "border border-white/70 bg-white/40 backdrop-blur-2xl " +
  "shadow-[0_12px_40px_rgba(30,100,160,0.10)]";

const features = [
  {
    icon: BadgeCheck,
    tint: "bg-emerald-100 text-emerald-600",
    title: "Verified vets and clinics",
    text: "Book trusted care near you in a few taps.",
  },
  {
    icon: Bell,
    tint: "bg-sky-100 text-sky-600",
    title: "Smart reminders",
    text: "Never miss a vaccine or booster again.",
  },
  {
    icon: ClipboardList,
    tint: "bg-violet-100 text-violet-600",
    title: "Digital health records",
    text: "History, dosage and weight in one dashboard.",
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#A8D8FF] via-[#D8EDFF] to-[#E8E9FF] px-4 py-8 sm:px-6">

      {/* Background decoration */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-40 top-10 h-[450px] w-[450px] rounded-full bg-sky-300/40 blur-[110px]" />
        <div className="absolute -right-32 top-20 h-[400px] w-[400px] rounded-full bg-pink-200/40 blur-[110px]" />
        <div className="absolute bottom-[-150px] left-1/3 h-[400px] w-[400px] rounded-full bg-blue-200/50 blur-[110px]" />
      </div>

      {/* Main Layout */}
      <main className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">

        {/* Left Section */}
        <section className="hidden flex-col items-center text-center lg:flex">

          {/* Rating */}
          <div className={`mb-4 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs sm:text-sm text-[#16466D] ${glass}`}>
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span>4.9 out of 5 from 1,280+ reviews</span>
          </div>

          {/* Illustration */}
          <div className="relative mb-4 flex h-36 w-full items-center justify-center">
            <div className="absolute h-36 w-36 rounded-full bg-white/50 blur-3xl" />

            <Image
              src="/animated/Cat_feeling_love_emotionsexpression.svg"
              alt="Cute cat illustration"
              width={220}
              height={180}
              unoptimized
              priority
              className="relative h-36 w-auto object-contain drop-shadow-[0_15px_20px_rgba(30,90,150,0.15)]"
            />
          </div>

          {/* Heading */}
          <h1 className="max-w-lg font-display text-3xl font-bold leading-[1.2] tracking-tight text-[#073B65] xl:text-4xl">
            Your pet's health,
            <br />
            all in one place
          </h1>

          <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#245B83]/80">
            Book verified vets, keep records tidy, and get
            reminders before every booster.
          </p>

          
        </section>

        {/* Form Section */}
        <section className="flex w-full flex-col items-center lg:items-start">

          {/* Mobile Illustration */}
          <div className="mb-5 flex flex-col items-center lg:hidden">
            <Image
              src="/animated/Cat_feeling_love_emotionsexpression.svg"
              alt="Cute cat illustration"
              width={220}
              height={120}
              unoptimized
              priority
              className="h-24 w-auto object-contain"
            />

            <p className="mt-2 text-sm font-medium text-[#16466D]">
              PetCareLog – Your pet's health companion
            </p>
          </div>

          {/* Auth Form */}
          <div className="w-full max-w-[440px] sm:max-w-[480px]">
            {children}
          </div>

        </section>
      </main>
    </div>
  );
}
