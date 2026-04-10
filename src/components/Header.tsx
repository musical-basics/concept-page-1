"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import NavDropdown from "./NavDropdown";
import ShopMegamenuAB from "./ShopMegamenuAB";
import CollectionsMegamenu from "./CollectionsMegamenu";

interface CartCountProps {
  cartCount: number;
}

export default function Header({ cartCount }: CartCountProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const shopLeaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const openShop = useCallback(() => {
    if (shopLeaveTimer.current) {
      clearTimeout(shopLeaveTimer.current);
      shopLeaveTimer.current = null;
    }
    setShopOpen(true);
  }, []);

  const closeShop = useCallback(() => {
    shopLeaveTimer.current = setTimeout(() => {
      setShopOpen(false);
    }, 120);
  }, []);

  const megamenuOpen = shopOpen || collectionsOpen;
  const pathname = usePathname();

  return (
    <>
      <header
        className={`header${scrolled ? " scrolled" : ""}${megamenuOpen ? " megamenu-active" : ""}`}
        id="header"
      >
        <div className="container">
          <Link href="/" className="logo">
            DreamPlay
          </Link>
          <nav className="nav-links">
            <div
              className="nav-megamenu-trigger"
              onMouseEnter={openShop}
              onMouseLeave={closeShop}
            >
              <Link href="/shop" className={`nav-link${shopOpen || pathname === "/shop" ? " is-active" : ""}`}>
                Shop
              </Link>
            </div>
            <CollectionsMegamenu onOpenChange={setCollectionsOpen} />
            <Link href="/features" className={pathname === "/features" ? "is-active" : ""}>Features</Link>
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
            <Link href="/about" className={pathname === "/about" ? "is-active" : ""}>About</Link>
            <Link href="/contact" className={pathname === "/contact" ? "is-active" : ""}>Contact</Link>
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
                className={`cart-count${
                  cartCount === 0 ? " hidden" : ""
                }`}
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

        <div onMouseEnter={openShop} onMouseLeave={closeShop}>
          <ShopMegamenuAB isOpen={shopOpen} />
        </div>
      </header>

      <div className={`header-megamenu-overlay${megamenuOpen ? " open" : ""}`} aria-hidden="true" />

      <div
        className={`mobile-overlay${menuOpen ? " open" : ""}`}
        onClick={toggleMenu}
      />
      <div className={`mobile-menu${menuOpen ? " open" : ""}`} id="mobileMenu">
        <Link href="/shop" onClick={toggleMenu}>Shop</Link>
        <Link href="/collections" onClick={toggleMenu}>Collections</Link>
        <Link href="/features" onClick={toggleMenu}>Features</Link>
        <a href="#resources" onClick={toggleMenu}>Resources</a>
        <Link href="/about" onClick={toggleMenu}>About</Link>
        <Link href="/contact" onClick={toggleMenu}>Contact</Link>
      </div>
    </>
  );
}
