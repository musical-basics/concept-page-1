"use client";

import { useState, useEffect, useCallback } from "react";
import NavDropdown from "./NavDropdown";

interface Props {
  cartCount: number;
}

export default function HeaderTransparentAB({ cartCount }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <>
      <header
        className={`header-ab${scrolled ? " scrolled" : ""}`}
        id="header"
      >
        <div className="container">
          <a href="#" className="logo">
            DreamPlay
          </a>
          <nav className="nav-links">
            <a href="/shop">Shop</a>
            <a href="#collections">Collections</a>
            <NavDropdown
              label="Features"
              items={[
                { text: "Grand 6", href: "/piano/grand-6" },
                { text: "Digital Piano", href: "/piano/digital-piano" },
                { text: "Upright 4", href: "/piano/upright-4" },
                { text: "Digital 5", href: "/piano/digital-5" },
              ]}
            />
            <NavDropdown
              label="Resources"
              items={[
                { text: "Piano Guides", href: "/resources/piano-guides" },
                { text: "Comparison Charts", href: "/resources/comparisons" },
                { text: "FAQs", href: "/resources/faqs" },
                {
                  text: "Documentation",
                  href: "/help/docs",
                  isExternal: true,
                },
              ]}
            />
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </nav>
          <div className="header-actions">
            <button className="search-btn">&#128269;</button>
            <button className="account-btn">&#9825;</button>
            <a
              href="/cart"
              className="cart-btn"
              aria-label={`Cart with ${cartCount} items`}
            >
              &#8863;{" "}
              <span
                className={`cart-count${cartCount === 0 ? " hidden" : ""}`}
                id="cartCount"
              >
                {cartCount}
              </span>
            </a>
            <div
              className={`hamburger${menuOpen ? " active" : ""}`}
              id="hamburger"
              onClick={toggleMenu}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </header>

      <div className={`mobile-menu${menuOpen ? " open" : ""}`} id="mobileMenu">
        <a href="/shop" onClick={toggleMenu}>Shop</a>
        <a href="#collections" onClick={toggleMenu}>Collections</a>
        <a href="#features" onClick={toggleMenu}>Features</a>
        <a href="#resources" onClick={toggleMenu}>Resources</a>
        <a href="/about" onClick={toggleMenu}>About</a>
        <a href="/contact" onClick={toggleMenu}>Contact</a>
      </div>
    </>
  );
}
