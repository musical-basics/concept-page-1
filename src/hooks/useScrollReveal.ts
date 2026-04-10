"use client";

import { useEffect, useRef, useState } from "react";
import { IO_OPTIONS } from "@/lib/animations";

/**
 * useScrollReveal — Intersection Observer hook that fires once when the
 * observed element enters the viewport.
 *
 * Returns a tuple of [ref, isVisible]:
 * - Attach `ref` to the element you want to observe.
 * - `isVisible` flips to `true` (and stays true) when the element crosses
 *   the threshold. Use it to toggle CSS classes or inline styles.
 *
 * Automatically respects `prefers-reduced-motion` by setting `isVisible`
 * immediately so no transforms/fades run.
 *
 * @param threshold  Fraction of element that must be visible. Default 0.15.
 * @param rootMargin CSS margin on the observer root. Default "0px 0px -50px 0px".
 */
export function useScrollReveal(
  threshold: number = IO_OPTIONS.threshold,
  rootMargin: string = IO_OPTIONS.rootMargin
) {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    // Skip animations when the user prefers reduced motion.
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // One-shot: stop observing after first trigger.
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, isVisible] as const;
}
