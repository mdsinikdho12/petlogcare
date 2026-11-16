"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, MessageSquare } from "lucide-react";
import { useInView } from "@/lib/hooks/useInView";
import { cn } from "@/lib/utils";

const contactItems = [
  {
    icon: Phone,
    label: "Emergency & appointments",
    value: "+880 1700-123456",
    href: "tel:+8801700123456",
    tint: "bg-sky-500/15 text-sky-600",
  },
  {
    icon: Mail,
    label: "Email consultation",
    value: "support@petcarelog.com",
    href: "mailto:support@petcarelog.com",
    tint: "bg-indigo-500/15 text-indigo-600",
  },
  {
    icon: MapPin,
    label: "Main facility",
    value: "House 42, Road 7/A, Dhanmondi, Dhaka",
    href: "https://maps.google.com",
    tint: "bg-emerald-500/15 text-emerald-600",
  },
  {
    icon: Clock,
    label: "Consultation hours",
    value: "Sat – Thu: 9:00 AM – 9:00 PM (24/7 emergency triage)",
    href: undefined,
    tint: "bg-amber-500/15 text-amber-600",
  },
];

/* Apple liquid glass recipe */
const glass =
  "border border-white/70 bg-white/45 backdrop-blur-2xl backdrop-saturate-150 " +
  "shadow-[0_10px_40px_rgba(1,95,160,0.12),inset_0_1px_0_rgba(255,255,255,0.9)]";

const inputGlass =
  "border border-white/80 bg-white/70 text-[#06395F] placeholder:text-[#0B4C7A]/50 " +
  "shadow-[inset_0_1px_3px_rgba(1,95,160,0.06),0_1px_0_rgba(255,255,255,0.9)] " +
  "backdrop-blur-md transition-all duration-200 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D96E6] focus-visible:bg-white";

const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D96E6] focus-visible:ring-offset-2";

export default function ContactSection() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const { ref, isInView } = useInView({ threshold: 0.1 });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 900));
    setStatus("sent");
  };

  return (
    <section
      id="contact"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative isolate overflow-hidden bg-gradient-to-b from-[#DCEEFF] via-[#EAF5FF] to-[#DCEEFF] py-24 sm:py-28"
    >
      {/* Blurred colour blobs behind the glass */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-16 h-96 w-96 rounded-full bg-[#9EE7FF]/55 blur-3xl" />
        <div className="absolute -right-20 top-1/2 h-96 w-96 rounded-full bg-[#FFD6E8]/60 blur-3xl" />
        <div className="absolute bottom-10 left-10 h-80 w-80 rounded-full bg-[#FFF1C9]/70 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Header */}
        <div
          className={cn(
            "mx-auto mb-14 max-w-2xl text-center",
            isInView ? "animate-fade-up" : "opacity-0"
          )}
        >
          <h2 className="font-display text-balance text-4xl font-bold tracking-tight text-[#06395F] sm:text-5xl">
            We are here for you and your companion
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-[#0B4C7A]/75">
            Send a query or call directly. Our team responds within minutes during working hours.
          </p>
        </div>

        {/* Two-Column Bento Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left: Contact Info Glass Cards */}
          <div
            className={cn(
              "space-y-4 lg:col-span-5",
              isInView ? "animate-fade-up" : "opacity-0"
            )}
          >
            {contactItems.map((item) => {
              const Icon = item.icon;
              const content = (
                <div
                  className={cn(
                    "group flex items-start gap-4 rounded-[2rem] p-5 transition duration-200 hover:-translate-y-0.5 hover:bg-white/60",
                    glass
                  )}
                >
                  <span
                    className={cn(
                      "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]",
                      item.tint
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#0B4C7A]/70">
                      {item.label}
                    </p>
                    <p className="mt-1 font-display text-base font-semibold text-[#06395F] group-hover:text-[#0D8BE0] transition-colors">
                      {item.value}
                    </p>
                  </div>
                </div>
              );

              return item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  className={cn("block rounded-[2rem]", focus)}
                >
                  {content}
                </a>
              ) : (
                <div key={item.label}>{content}</div>
              );
            })}

            {/* Quick Consultation Guarantee Pill */}
            <div
              className={cn(
                "flex items-center gap-3 rounded-[2rem] p-5 border border-white/80 bg-white/60 shadow-sm",
                glass
              )}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold text-[#06395F]">Same-day response promise</p>
                <p className="text-xs text-[#0B4C7A]/75">In-clinic consultations scheduled in 2 minutes</p>
              </div>
            </div>
          </div>

          {/* Right: Glass Inquiry Form */}
          <div
            className={cn(
              "rounded-[2.5rem] p-7 sm:p-10 lg:col-span-7",
              glass,
              isInView ? "animate-fade-up delay-100" : "opacity-0"
            )}
          >
            {status === "sent" ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 mb-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                  <CheckCircle2 className="h-8 w-8" />
                </span>
                <h3 className="font-display text-2xl font-bold text-[#06395F]">
                  Message received!
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#0B4C7A]/75">
                  Thank you for reaching out. A dedicated care coordinator will review your request and get back to you promptly.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className={cn(
                    "mt-6 rounded-full border border-white/80 bg-white/70 px-6 py-2.5 text-sm font-semibold text-[#06395F] shadow-sm hover:bg-white transition-colors",
                    focus
                  )}
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-[#0D8BE0]" />
                  <span className="text-xs font-semibold text-[#0B4C7A]/75">Direct clinic message</span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-semibold text-[#06395F] mb-1.5"
                    >
                      Your name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="e.g. Samira Ahmed"
                      className={cn("w-full h-12 rounded-2xl px-4 text-sm", inputGlass)}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-phone"
                      className="block text-xs font-semibold text-[#06395F] mb-1.5"
                    >
                      Phone number
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      placeholder="+880 17XXXXXXXX"
                      className={cn("w-full h-12 rounded-2xl px-4 text-sm", inputGlass)}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-semibold text-[#06395F] mb-1.5"
                  >
                    Email address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    className={cn("w-full h-12 rounded-2xl px-4 text-sm", inputGlass)}
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-semibold text-[#06395F] mb-1.5"
                  >
                    How can we help your pet?
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    required
                    placeholder="Tell us about your pet's breed, symptoms, or service you are looking for..."
                    className={cn("w-full rounded-2xl p-4 text-sm resize-none", inputGlass)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className={cn(
                    "mt-2 w-full flex h-13 items-center justify-center gap-2 rounded-full",
                    "bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-sm font-semibold text-white",
                    "shadow-[0_10px_28px_rgba(13,150,230,0.38),inset_0_1px_0_rgba(255,255,255,0.5)]",
                    "transition duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60",
                    focus
                  )}
                >
                  <Send className="h-4 w-4" />
                  {status === "sending" ? "Sending message..." : "Send consultation request"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
