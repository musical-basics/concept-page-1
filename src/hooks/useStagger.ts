import { useMemo } from "react";
import type { CSSProperties } from "react";
import { STAGGER } from "@/lib/animations";

/**
 * useStagger — generates an array of `CSSProperties` objects, each containing
 * an `animationDelay` and `transitionDelay` offset for staggered child reveals.
 *
 * Usage:
 * ```tsx
 * const delays = useStagger(cards.length, 100);
 * cards.map((card, i) => (
 *   <ScrollReveal key={i} delay={i * 100}>
 *     <Card {...card} />
 *   </ScrollReveal>
 * ))
 * ```
 *
 * Or apply directly as inline styles when not using ScrollReveal:
 * ```tsx
 * const delays = useStagger(items.length);
 * items.map((item, i) => (
 *   <div key={i} className="anim-fadeInUp" style={delays[i]}>…</div>
 * ))
 * ```
 *
 * @param count          Number of children to stagger.
 * @param delayBetween   Delay increment in ms between each child. Default 80ms.
 * @param baseDelay      Initial delay before the first child. Default 0.
 */
export function useStagger(
  count: number,
  delayBetween: number = STAGGER.normal,
  baseDelay = 0
): CSSProperties[] {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        animationDelay: `${baseDelay + i * delayBetween}ms`,
        transitionDelay: `${baseDelay + i * delayBetween}ms`,
      })),
    [count, delayBetween, baseDelay]
  );
}
