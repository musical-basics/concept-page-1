"use client";

import { useState, useEffect, useCallback } from "react";

export default function Header({
  cartCount,
}: {
  cartCount: number;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <>
      <header className={`header${scrolled ? " scrolled" : ""}`} id="header">
        <div className="container">
          <a href="#" className="logo">
            DreamPlay
          </a>
          <nav className="nav-links">
            <a href="#">Shop</a>
            <a href="#">Collections</a>
            <a href="#">Explore</a>
            <a href="#">Compare</a>
            <a href="#">Contact</a>
          </nav>
          <div className="header-actions">
            <button>&#9740;</button>
            <button>&#9825;</button>
            <button className="cart-btn">
              &#8863; <span className={`cart-count${cartCount === 0 ? " hidden" : ""}`} id="cartCount">{cartCount}</span>
            </button>
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
        <a href="#" onClick={toggleMenu}>Shop</a>
        <a href="#" onClick={toggleMenu}>Collections</a>
        <a href="#" onClick={toggleMenu}>Explore</a>
        <a href="#" onClick={toggleMenu}>Compare</a>
        <a href="#" onClick={toggleMenu}>Contact</a>
      </div>
    </>
  );
}
