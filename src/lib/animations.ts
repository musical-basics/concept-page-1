import type { CSSProperties } from "react";

// ─── Easing Curves ─────────────────────────────────────────────────────────────
// Extracted from Concept theme CSS (see ANIMATIONS.md)
export const EASING = {
  /** Fast start → smooth stop. Used for scroll reveals and transitions. */
  decelerate: "cubic-bezier(0, 0, 0.2, 1)",
  /** Standard Material Design curve. Used for drawers and overlays. */
  standard: "cubic-bezier(0.4, 0, 0.2, 1)",
  /** Custom curve for arrow/link transforms. */
  arrowLink: "cubic-bezier(0.4, 0.22, 0.28, 1)",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  linear: "linear",
} as const;

// ─── Durations (ms) ────────────────────────────────────────────────────────────
export const DURATION = {
  instant: 0,
  fast: 150,
  quick: 300,
  medium: 400,
  normal: 600,
  slow: 800,
  hero: 1000,
  marquee: 15000,
} as const;

// ─── Stagger Delays (ms between children) ──────────────────────────────────────
export const STAGGER = {
  fast: 50,   // social feed cells
  normal: 80, // general children
  slow: 100,  // product cards, value props
  drawer: 40, // mobile menu links
} as const;

// ─── Intersection Observer Defaults ────────────────────────────────────────────
export const IO_OPTIONS = {
  /** Trigger when 15% of the element is visible. */
  threshold: 0.15,
  /** Trigger 50px before the element hits the bottom of the viewport. */
  rootMargin: "0px 0px -50px 0px",
} as const;

// ─── Animation Variants ────────────────────────────────────────────────────────
export type AnimationVariant =
  | "fadeIn"
  | "fadeInUp"
  | "fadeInSlide"
  | "slideInLeft"
  | "slideInRight"
  | "scaleIn";

export interface AnimationConfig {
  hidden: CSSProperties;
  visible: CSSProperties;
  duration: number;
  easing: string;
}

/**
 * CSS-driven animation variants matching the Concept theme spec.
 * Each variant defines the hidden (initial) and visible (final) CSS states
 * plus the timing parameters used to build the `transition` shorthand.
 */
export const ANIMATION_VARIANTS: Record<AnimationVariant, AnimationConfig> = {
  /**
   * Simple opacity fade — used for hero slide active state, testimonial,
   * video section background.
   * Duration 800ms, ease-out.
   */
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    duration: DURATION.slow,
    easing: EASING.easeOut,
  },

  /**
   * Opacity + translateY(30px→0) — primary scroll-reveal animation.
   * Used for headings, body text, CTAs, product cards, value props.
   * Duration 600ms, cubic-bezier(0,0,0.2,1).
   */
  fadeInUp: {
    hidden: { opacity: 0, transform: "translateY(30px)" },
    visible: { opacity: 1, transform: "translateY(0)" },
    duration: DURATION.normal,
    easing: EASING.decelerate,
  },

  /**
   * Opacity-only hero slide fade — matches `@keyframes fadeInSlide` exactly.
   * Duration 1000ms, ease-out (one-shot on slide activation).
   */
  fadeInSlide: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    duration: DURATION.hero,
    easing: EASING.easeOut,
  },

  /**
   * Opacity + translateX(-30px→0) — used for left column (gallery, large blog card).
   * Duration 600ms, cubic-bezier(0,0,0.2,1).
   */
  slideInLeft: {
    hidden: { opacity: 0, transform: "translateX(-30px)" },
    visible: { opacity: 1, transform: "translateX(0)" },
    duration: DURATION.normal,
    easing: EASING.decelerate,
  },

  /**
   * Opacity + translateX(30px→0) — used for right column (product info, stack cards).
   * Duration 600ms, cubic-bezier(0,0,0.2,1).
   */
  slideInRight: {
    hidden: { opacity: 0, transform: "translateX(30px)" },
    visible: { opacity: 1, transform: "translateX(0)" },
    duration: DURATION.normal,
    easing: EASING.decelerate,
  },

  /**
   * Opacity + scale(0.95→1) — used for social feed cells, newsletter popup.
   * Duration 400ms, cubic-bezier(0,0,0.2,1).
   */
  scaleIn: {
    hidden: { opacity: 0, transform: "scale(0.95)" },
    visible: { opacity: 1, transform: "scale(1)" },
    duration: DURATION.medium,
    easing: EASING.decelerate,
  },
};

// ─── Transition Presets ────────────────────────────────────────────────────────
/**
 * Pre-built CSS `transition` values for interactive elements.
 * Use these as `style.transition` or in Tailwind's `[transition:...]` utility.
 */
export const TRANSITION_PRESETS = {
  drawer: `transform ${DURATION.medium}ms ${EASING.standard}`,
  overlay: `opacity ${DURATION.medium}ms ${EASING.standard}, visibility ${DURATION.medium}ms ${EASING.linear}`,
  navHeader: `color ${DURATION.slow}ms ${EASING.decelerate}, background-color ${DURATION.slow}ms ${EASING.decelerate}, border-color ${DURATION.slow}ms ${EASING.decelerate}`,
  navLinkUnderline: `width ${DURATION.quick}ms`,
  button: `background-color ${DURATION.fast}ms ease, border-color ${DURATION.fast}ms ease, box-shadow ${DURATION.fast}ms ease, color ${DURATION.fast}ms ease`,
  arrowLink: `transform ${DURATION.quick}ms ${EASING.arrowLink}`,
  modal: `opacity ${DURATION.fast}ms ${EASING.easeOut}, transform ${DURATION.fast}ms ${EASING.easeOut}`,
  footerLink: `color ${DURATION.quick}ms ${EASING.easeInOut}`,
  imageLoad: `opacity 500ms ${EASING.decelerate}`,
  cardImageHover: `transform 500ms ease`,
  swatch: `border-color ${DURATION.fast}ms ease`,
  playBtn: `transform ${DURATION.quick}ms ease`,
  backToTop: `opacity ${DURATION.quick}ms ease, background-color ${DURATION.quick}ms ease`,
} as const;
