"use client";

/**
 * /nav-megamenu-ab — A/B sandbox for Shop megamenu behavior
 *
 * Builds on the approved /home-header-ab sandbox (transparent header +
 * animated dropdown) and adds the full-width Shop megamenu panel matching
 * the Concept theme reference:
 *   - Left column: "Collections" + tabbed category nav with icons
 *   - Right panel: product card grid switching per active tab
 *   - "View All Products" footer link
 *   - Full-width overlay panel with fade/slide entrance
 *
 * Primary routes (/, /home2, /home-header-ab) are NOT modified.
 */

import { useState, useCallback } from "react";
import HeaderMegamenuAB from "@/components/HeaderMegamenuAB";
import HeroSlider from "@/components/HeroSlider";
import BrandIntro from "@/components/BrandIntro";
import ValueProps from "@/components/ValueProps";
import Footer from "@/components/Footer";

export default function NavMegamenuAB() {
  const [cartCount, setCartCount] = useState(0);

  const addToCart = useCallback(() => {
    setCartCount((prev) => prev + 1);
  }, []);

  void addToCart;

  return (
    <>
      <HeaderMegamenuAB cartCount={cartCount} />
      <HeroSlider />
      <BrandIntro />
      <ValueProps />
      <Footer />
    </>
  );
}
