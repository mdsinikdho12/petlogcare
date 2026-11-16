"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, Star } from "lucide-react";

/**
 * Hero v3
 * - Glass recipe is now identical to the navbar (border-white/60, bg-white/35, blur-2xl,
 *   saturate-150, same shadow + inset top light), so buttons, rating card and nav feel like one family.
 * - Primary button uses the same gradient as the navbar "Sign up" button.
 * - Animated balloon cat sits beside the heading (top-right corner of the headline).
 * - Mobile: rating card overlaps the cat's bottom edge instead of taking its own row,
 *   so the cat is visible in the first screen.
 */

// Same recipe as the navbar's `glass` (the un-scrolled state)
const glass =
  "border border-white/60 bg-white/35 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_6px_24px_rgba(1,95,160,0.10),inset_0_1px_0_rgba(255,255,255,0.85)]";



export default function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate flex min-h-dvh flex-col items-center overflow-hidden bg-gradient-to-b from-[#7DBFFB] via-[#B5DBFE] to-[#DCEEFF] px-5 pt-24 sm:pt-32 lg:pt-36"
    >
      <style>{`
        @keyframes hero-rise { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes hero-peek { from { opacity: 0; transform: translate(-50%, 14%) } to { opacity: 1; transform: translate(-50%, 2%) } }
        @keyframes hero-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
        .hero-rise { opacity: 0; animation: hero-rise .7s cubic-bezier(.22,1,.36,1) forwards; }
        .hero-rise-2 { animation-delay: .08s }
        .hero-rise-3 { animation-delay: .16s }
        .hero-peek { opacity: 0; animation: hero-peek .9s cubic-bezier(.22,1,.36,1) .2s forwards; }
        .hero-float { animation: hero-float 7s ease-in-out infinite; }
        .hero-float-slow { animation: hero-float 9s ease-in-out infinite reverse; }
        @media (prefers-reduced-motion: reduce) {
          .hero-rise, .hero-peek { animation: none; opacity: 1; }
          .hero-peek { transform: translate(-50%, 2%); }
          .hero-float, .hero-float-slow { animation: none; }
        }
      `}</style>

      {/* Colour blobs: give the glass something to blur */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[30%] h-[540px] w-[860px] max-w-[160vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/50 blur-3xl" />
        <div className="absolute -left-28 top-[28%] h-96 w-96 rounded-full bg-[#9EE7FF]/70 blur-3xl" />
        <div className="absolute -right-24 top-[46%] h-[26rem] w-[26rem] rounded-full bg-[#FFD6E8]/65 blur-3xl" />
        <div className="absolute bottom-[8%] left-[14%] h-72 w-72 rounded-full bg-[#FFF1C9]/70 blur-3xl" />
      </div>

      {/* Text block */}
      <div className="relative z-30 mx-auto max-w-4xl text-center">
        {/* Heading with the animated balloon cat beside it */}
        <div className="relative">
          <h1
            id="hero-heading"
            className="hero-rise text-balance font-display text-[2.6rem] font-bold leading-[1.05] tracking-[-0.03em] text-[#06395F] sm:text-6xl lg:text-[4.75rem]"
          >
            Your pet&rsquo;s health companion, in{" "}
            <span className="bg-gradient-to-b from-[#1FA3F5] to-[#0A6FBF] bg-clip-text text-transparent">
              safe hands.
            </span>
          </h1>

          
        </div>

        <p className="hero-rise hero-rise-2 mx-auto mt-6 max-w-xl text-pretty font-sans text-lg leading-relaxed text-[#0B4C7A] sm:text-xl">
          Experienced doctors, modern equipment, and gentle care your companion will feel safe in.
        </p>

        <div className="hero-rise hero-rise-3 mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          {/* Primary: same gradient as navbar Sign up */}
          <Link
            href="#contact"
            className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-white/30 bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] px-8 text-base font-semibold text-white shadow-[0_10px_30px_rgba(13,150,230,0.4),inset_0_1px_0_rgba(255,255,255,0.5)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(13,150,230,0.45),inset_0_1px_0_rgba(255,255,255,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06395F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#B5DBFE] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-auto"
          >
            Book appointment
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>

          {/* Secondary: exact navbar glass */}
          <Link
            href="#services"
            className={`${glass} group inline-flex min-h-12 w-full items-center justify-center gap-1 rounded-full px-7 text-base font-semibold text-[#06395F] transition duration-200 hover:-translate-y-0.5 hover:bg-white/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D8BE0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#B5DBFE] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-auto`}
          >
            See our services
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
      </div>

      {/* Visual stage: min height equals cat height, so the cat never reaches the buttons */}
      <div className="relative mt-6 min-h-[17rem] w-full max-w-5xl flex-1 sm:mt-10 sm:min-h-[25rem] lg:mt-8 lg:min-h-[30rem]">
        {/* Light behind the cat's head */}
        <div
          aria-hidden
          className="absolute left-1/2 top-[8%] h-56 w-56 -translate-x-1/2 rounded-full bg-white/80 blur-3xl sm:h-80 sm:w-80"
        />

        {/* Glass halo rings, centred on the cat's centre line */}
        <div
          aria-hidden
          className="absolute bottom-0 left-1/2 h-[22rem] w-[22rem] -translate-x-1/2 translate-y-[45%] rounded-full border border-white/70 bg-white/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_30px_80px_rgba(1,95,160,0.12)] backdrop-blur-xl sm:h-[32rem] sm:w-[32rem] lg:h-[38rem] lg:w-[38rem]"
        />
        <div
          aria-hidden
          className="absolute bottom-0 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 translate-y-[52%] rounded-full border border-white/40 bg-white/10 sm:h-[46rem] sm:w-[46rem] lg:h-[54rem] lg:w-[54rem]"
        />

        {/* Cat: fixed height per breakpoint, bottom anchored, centred */}
        <div className="hero-peek pointer-events-none absolute bottom-0 left-1/2 z-10 h-[17rem] select-none sm:h-[25rem] lg:h-[30rem]">
          <Image
            src="/images/Persian_Cat.png"
            alt="Fluffy Persian cat looking at the camera"
            width={480}
            height={600}
            priority
            sizes="(min-width: 1024px) 384px, (min-width: 640px) 320px, 220px"
            className="h-full w-auto object-contain object-bottom drop-shadow-[0_28px_40px_rgba(1,95,160,0.30)]"
          />
        </div>

       
      </div>

      {/* Soft fade so the cat blends into the next section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-14 bg-gradient-to-t from-[#DCEEFF] to-transparent"
      />
    </section>
  );
}