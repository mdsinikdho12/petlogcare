import Link from "next/link";
import { PawPrint, Phone, Mail, MapPin, Heart, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const footerNavigation = {
  services: [
    { label: "Lab diagnostics", href: "/#services" },
    { label: "Surgery & trauma", href: "/#services" },
    { label: "Preventive wellness", href: "/#services" },
    { label: "Physical therapy", href: "/#services" },
    { label: "Visual diagnostics", href: "/#services" },
  ],
  company: [
    { label: "About PetCareLog", href: "/" },
    { label: "Our specialists", href: "/#doctors" },
    { label: "Partner clinics", href: "/providers" },
    { label: "Pricing & tiers", href: "/pricing" },
    { label: "Knowledge hub", href: "/blogs" },
  ],
  legal: [
    { label: "Privacy policy", href: "/legal?tab=privacy" },
    { label: "Terms of care", href: "/legal?tab=terms" },
    { label: "Emergency protocol", href: "/legal?tab=emergency" },
    { label: "Cookie settings", href: "/legal?tab=cookies" },
  ],
};

/* Apple liquid glass recipe */
const glass =
  "border border-white/70 bg-white/50 backdrop-blur-2xl backdrop-saturate-150 " +
  "shadow-[0_10px_40px_rgba(1,95,160,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]";

const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D96E6] focus-visible:ring-offset-2";

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-gradient-to-b from-[#DCEEFF] via-[#F4F9FF] to-[#E3F1FF] pt-20 pb-12">
      {/* Blurred background colour blooms */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/3 top-0 h-80 w-80 rounded-full bg-[#9EE7FF]/40 blur-3xl" />
        <div className="absolute right-10 bottom-10 h-72 w-72 rounded-full bg-[#FFD6E8]/45 blur-3xl" />
        <div className="absolute left-10 bottom-0 h-64 w-64 rounded-full bg-[#FFF1C9]/50 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Main Floating Glass Panel */}
        <div className={`rounded-[13px] p-8 sm:p-12 lg:p-14 ${glass}`}>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Brand column */}
            <div className="lg:col-span-5">
              <Link href="/" className={cn("inline-flex items-center gap-2.5 rounded-2xl", focus)}>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2FB0FF] to-[#0D8BE0] text-white shadow-[0_6px_16px_rgba(13,150,230,0.35),inset_0_1px_0_rgba(255,255,255,0.6)]">
                  <PawPrint className="h-6 w-6" aria-hidden />
                </span>
                <span className="font-display text-2xl font-bold tracking-tight text-[#06395F]">
                  Pet<span className="text-[#0D8BE0]">Care</span>Log
                </span>
              </Link>

              <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#0B4C7A]/75">
                Compassionate veterinary records, cal-style appointment booking, and verified clinic discovery for dedicated pet parents in Bangladesh.
              </p>

              {/* Direct Contacts Glass Row */}
              <div className="mt-8 space-y-3">
                <a
                  href="tel:+8801700123456"
                  className={cn(
                    "flex items-center gap-3 rounded-2xl p-2.5 text-xs font-semibold text-[#06395F] transition-colors hover:bg-white/60",
                    focus
                  )}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/15 text-sky-600">
                    <Phone className="h-4 w-4" aria-hidden />
                  </span>
                  +880 1700-123456 (24/7 hotline)
                </a>

                <a
                  href="mailto:support@petcarelog.com"
                  className={cn(
                    "flex items-center gap-3 rounded-2xl p-2.5 text-xs font-semibold text-[#06395F] transition-colors hover:bg-white/60",
                    focus
                  )}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-600">
                    <Mail className="h-4 w-4" aria-hidden />
                  </span>
                  support@petcarelog.com
                </a>

                <div className="flex items-center gap-3 rounded-2xl p-2.5 text-xs text-[#0B4C7A]/75">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600">
                    <MapPin className="h-4 w-4" aria-hidden />
                  </span>
                  Dhanmondi, Dhaka, Bangladesh
                </div>
              </div>
            </div>

            {/* Links Columns */}
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
              <div>
                <h3 className="font-display text-sm font-semibold text-[#06395F]">
                  Services
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {footerNavigation.services.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className={cn(
                          "inline-block text-sm text-[#0B4C7A]/75 transition-colors hover:text-[#0D8BE0]",
                          focus
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-display text-sm font-semibold text-[#06395F]">
                  Company
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {footerNavigation.company.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className={cn(
                          "inline-flex items-center gap-1 text-sm text-[#0B4C7A]/75 transition-colors hover:text-[#0D8BE0]",
                          focus
                        )}
                      >
                        {item.label}
                        {item.label === "Careers" && (
                          <ArrowUpRight className="h-3 w-3 text-[#0D8BE0]" />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-display text-sm font-semibold text-[#06395F]">
                  Legal &amp; Trust
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {footerNavigation.legal.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className={cn(
                          "inline-block text-sm text-[#0B4C7A]/75 transition-colors hover:text-[#0D8BE0]",
                          focus
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/60 pt-8 text-xs text-[#0B4C7A]/70 sm:flex-row">
            <p>© 2026 PetCareLog. Crafted with care for companion animals.</p>
            <div className="flex items-center gap-1.5 text-xs text-[#06395F]">
              <span>Made with</span>
              <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" aria-hidden />
              <span>for pets and their humans</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
