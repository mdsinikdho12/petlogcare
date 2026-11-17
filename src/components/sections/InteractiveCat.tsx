"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

type Mood = "idle" | "happy" | "meow";

const IMAGES: Record<Mood, string> = {
  idle: "/images/Persian_Cat.png",
  happy: "/images/Persian_Cat_happy.png",
  meow: "/images/Persian_Cat_meow.png",
};

const MOODS = Object.keys(IMAGES) as Mood[];
const SOUNDS = ["/sounds/meow1.wav", "/sounds/meow2.wav", "/sounds/meow3.wav"];
const MEOW_MS = 900;

export default function InteractiveCat() {
  const reduce = useReducedMotion();
  const controls = useAnimationControls();
  const [muted, setMuted] = useState(false);
  const [bubbles, setBubbles] = useState<number[]>([]);
  const [hover, setHover] = useState(false);
  const [meowing, setMeowing] = useState(false);
  const audios = useRef<HTMLAudioElement[]>([]);
  const meowTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mood: Mood = meowing ? "meow" : hover ? "happy" : "idle";

  // -1..1 pointer position, smoothed with a spring
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 14, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 120, damping: 14, mass: 0.6 });

  const rotateY = useTransform(sx, [-1, 1], [-14, 14]);
  const rotateX = useTransform(sy, [-1, 1], [10, -10]);
  const moveX = useTransform(sx, [-1, 1], [-12, 12]);
  const moveY = useTransform(sy, [-1, 1], [-4, 4]);

  // Track mouse / touch anywhere on the page
  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      mx.set(Math.max(-1, Math.min(1, nx)));
      my.set(Math.max(-1, Math.min(1, ny)));
    };
    const onLeave = () => {
      mx.set(0);
      my.set(0);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [mx, my, reduce]);

  // Preload sounds so the first click has no delay
  useEffect(() => {
    audios.current = SOUNDS.map((src) => {
      const a = new Audio(src);
      a.preload = "auto";
      a.volume = 0.6;
      return a;
    });
    return () => {
      if (meowTimer.current) clearTimeout(meowTimer.current);
    };
  }, []);

  const meow = useCallback(() => {
    if (!muted && audios.current.length) {
      const a = audios.current[Math.floor(Math.random() * audios.current.length)];
      a.currentTime = 0;
      a.play().catch(() => {});
    }

    if (!reduce) {
      controls.start({
        scale: [1, 1.1, 0.94, 1.03, 1],
        rotate: [0, -4, 4, -2, 0],
        transition: { duration: 0.6, ease: "easeOut" },
      });
    }

    // Switch to the "meow" face, then back
    setMeowing(true);
    if (meowTimer.current) clearTimeout(meowTimer.current);
    meowTimer.current = setTimeout(() => setMeowing(false), MEOW_MS);

    const id = Date.now();
    setBubbles((b) => [...b, id]);
    setTimeout(() => setBubbles((b) => b.filter((x) => x !== id)), 1000);
  }, [muted, reduce, controls]);

  return (
    <div className="relative h-full">
      <motion.button
        type="button"
        onClick={meow}
        onHoverStart={() => setHover(true)}
        onHoverEnd={() => setHover(false)}
        aria-label="Pet the cat"
        className="pointer-events-auto relative block h-full cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[#0D8BE0]"
        style={{
          rotateX: reduce ? 0 : rotateX,
          rotateY: reduce ? 0 : rotateY,
          x: reduce ? 0 : moveX,
          y: reduce ? 0 : moveY,
          transformPerspective: 900,
          transformOrigin: "50% 100%",
        }}
        animate={controls}
        whileHover={reduce ? undefined : { scale: 1.03 }}
        whileTap={reduce ? undefined : { scale: 0.97 }}
      >
        {/* idle breathing */}
        <motion.div
          className="relative h-full"
          style={{ transformOrigin: "50% 100%" }}
          animate={reduce ? undefined : { scaleY: [1, 1.015, 1], scaleX: [1, 0.995, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          {MOODS.map((m) => (
            <Image
              key={m}
              src={IMAGES[m]}
              alt={m === "idle" ? "Fluffy Persian cat looking at the camera" : ""}
              aria-hidden={m !== "idle"}
              width={480}
              height={600}
              priority
              draggable={false}
              sizes="(min-width: 1024px) 384px, (min-width: 640px) 320px, 220px"
              className={`object-contain object-bottom drop-shadow-[0_28px_40px_rgba(1,95,160,0.30)] transition-opacity duration-150 ${
                m === "idle"
                  ? "relative h-full w-auto"
                  : "absolute inset-0 h-full w-full"
              } ${mood === m ? "opacity-100" : "opacity-0"}`}
            />
          ))}
        </motion.div>
      </motion.button>

      {/* Meow bubbles */}
      <AnimatePresence>
        {bubbles.map((id) => (
          <motion.span
            key={id}
            initial={{ opacity: 0, y: 0, scale: 0.6 }}
            animate={{ opacity: 1, y: -50, scale: 1 }}
            exit={{ opacity: 0, y: -80 }}
            transition={{ duration: 0.6 }}
            className="pointer-events-none absolute left-1/2 top-[8%] -translate-x-1/2 rounded-full border border-white/60 bg-white/60 px-3 py-1 text-sm font-semibold text-[#06395F] shadow-lg backdrop-blur-xl"
          >
            Meow~ 🐾
          </motion.span>
        ))}
      </AnimatePresence>

      {/* Sound toggle */}
      <button
        type="button"
        onClick={() => setMuted((m) => !m)}
        aria-label={muted ? "Unmute cat sounds" : "Mute cat sounds"}
        className="pointer-events-auto absolute -right-14 bottom-4 grid h-10 w-10 place-items-center rounded-full border border-white/60 bg-white/35 text-[#06395F] backdrop-blur-2xl transition hover:bg-white/55"
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
    </div>
  );
}