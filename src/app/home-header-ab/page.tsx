"use client";

/**
 * /home-header-ab — A/B test for fidelity task #1: transparent-at-rest header
 *
 * Demonstrates the reference behavior from FIDELITY_GAPS_NEXT.md §1:
 *   • Header position: fixed always (no layout reflow on scroll)
 *   • At rest (scrollY ≤ 50px): transparent background, dark text,
 *     hero image shows full-bleed behind header
 *   • Scrolled (scrollY > 50px): white background, border, box-shadow,
 *     height shrinks 80px → 60px
 *   • Transition: background-color | border-color | box-shadow | height
 *                 500ms cubic-bezier(0,0,0.2,1)
 *
 * Primary routes (/ and /home2) are NOT modified.
 */

import { useState, useCallback } from "react";
import HeaderTransparentAB from "@/components/HeaderTransparentAB";
import HeroSlider from "@/components/HeroSlider";
import BrandIntro from "@/components/BrandIntro";
import ValueProps from "@/components/ValueProps";
import Footer from "@/components/Footer";

export default function HomeHeaderAB() {
  const [cartCount, setCartCount] = useState(0);

  const addToCart = useCallback(() => {
    setCartCount((prev) => prev + 1);
  }, []);

  // Suppress unused-variable lint; addToCart wired to future sections if needed.
  void addToCart;

  return (
    <>
      {/*
       * No AnnouncementBar: the header is position:fixed at top:0, so the
       * first section (HeroSlider) starts at the very top of the viewport.
       * The transparent header floats over it for the full-bleed effect.
       */}
      <HeaderTransparentAB cartCount={cartCount} />

      {/*
       * HeroSlider is the first block element in the layout.
       * Because .header-ab is position:fixed it contributes no height,
       * so the hero fills 100vh starting from y=0 — the header overlays it.
       */}
      <HeroSlider />

      {/* Sections below give the page enough height to trigger the scroll
          transition and show the white-background state. */}
      <BrandIntro />
      <ValueProps />
      <Footer />
    </>
  );
}
