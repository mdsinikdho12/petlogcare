"use client";

import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function useInView(options: UseInViewOptions = {}) {
  const { threshold = 0.15, rootMargin = "0px 0px -60px 0px", once = true } = options;
  const ref = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Build an observer-based approach that works for all cases.
    // For prefers-reduced-motion, trigger with an observer that fires immediately.
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting || prefersReduced) {
          setIsInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsInView(false);
        }
      },
      // For reduced motion, use threshold:0 so any intersection fires immediately
      { threshold: prefersReduced ? 0 : threshold, rootMargin: prefersReduced ? "0px" : rootMargin }
    );

    observer.observe(el);

    // If reduced motion, also force-fire after a tick in case element is out of viewport
    if (prefersReduced) {
      const id = window.setTimeout(() => setIsInView(true), 50);
      return () => {
        clearTimeout(id);
        observer.disconnect();
      };
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isInView };
}
