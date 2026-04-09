"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import {
  ANIMATION_VARIANTS,
  IO_OPTIONS,
  type AnimationVariant,
} from "@/lib/animations";

interface ScrollRevealProps {
  /** Content to reveal. */
  children: ReactNode;
  /** Animation preset to apply. Default: "fadeInUp". */
  animation?: AnimationVariant;
  /**
   * Delay in ms before the transition starts after the element becomes visible.
   * Use this to stagger siblings by passing increasing values (e.g. i * 100).
   */
  delay?: number;
  /** Override the animation duration in ms. Defaults to the preset duration. */
  duration?: number;
  /** HTML element to render as the wrapper. Default: "div". */
  as?: ElementType;
  className?: string;
  /** Extra inline styles merged onto the wrapper (after animation styles). */
  style?: CSSProperties;
  /**
   * Fraction of the element that must be in-view before triggering.
   * Default: 0.15 (15%).
   */
  threshold?: number;
  /**
   * CSS margin applied to the IntersectionObserver root.
   * Default: "0px 0px -50px 0px" (triggers 50px before element hits viewport bottom).
   */
  rootMargin?: string;
}

/**
 * ScrollReveal — a zero-dependency wrapper that animates its children into view
 * when they enter the viewport, using IntersectionObserver and CSS transitions.
 *
 * - One-shot: triggers once, then disconnects the observer.
 * - Respects `prefers-reduced-motion`: immediately shows content with no transforms.
 * - Uses `will-change: opacity, transform` for GPU compositing.
 *
 * @example
 * // Simple section reveal
 * <ScrollReveal animation="fadeInUp">
 *   <h2>Section Heading</h2>
 * </ScrollReveal>
 *
 * @example
 * // Staggered siblings — pass increasing delay
 * {cards.map((card, i) => (
 *   <ScrollReveal key={i} animation="scaleIn" delay={i * 50} as="article">
 *     <Card {...card} />
 *   </ScrollReveal>
 * ))}
 *
 * @example
 * // Render as a semantic element instead of a div
 * <ScrollReveal as="section" animation="slideInLeft" className="blog-card blog-large">
 *   …
 * </ScrollReveal>
 */
export default function ScrollReveal({
  children,
  animation = "fadeInUp",
  delay = 0,
  duration,
  as: Tag = "div",
  className,
  style,
  threshold = IO_OPTIONS.threshold,
  rootMargin = IO_OPTIONS.rootMargin,
}: ScrollRevealProps) {
  // We type the ref as HTMLDivElement for the common case; for other tag types
  // the underlying DOM element still conforms to HTMLElement for IO purposes.
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Respect the user's motion preference — skip all transforms/fades.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element); // one-shot
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const variant = ANIMATION_VARIANTS[animation];
  const dur = duration ?? variant.duration;

  // Build a single `transition` shorthand that covers both opacity and transform.
  // If the variant only animates opacity (fadeIn, fadeInSlide), the transform
  // transition is effectively a no-op.
  const transitionValue = `opacity ${dur}ms ${variant.easing} ${delay}ms, transform ${dur}ms ${variant.easing} ${delay}ms`;

  const animStyle: CSSProperties = {
    willChange: "opacity, transform",
    transition: transitionValue,
    ...(isVisible ? variant.visible : variant.hidden),
    // Caller-provided style wins over animation state so layout overrides work.
    ...style,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const AnyTag = Tag as any;
  return (
    <AnyTag ref={ref} className={className} style={animStyle}>
      {children}
    </AnyTag>
  );
}
