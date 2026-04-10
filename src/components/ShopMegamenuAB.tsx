"use client";

import { useState, useRef, useCallback } from "react";

/**
 * Reference structure from Concept theme scrape (after-hover.json):
 *
 * The Shop mega menu is a full-width panel triggered on hover over "Shop".
 * Layout: two-column
 *   Left:  "Collections" heading + vertical tab buttons (icon + label)
 *          for Headphones, Earphones, Speakers, Accessories
 *          + "View All Products" footer link
 *   Right: product-card grid (switches per active tab)
 *
 * Animations:
 *   - Panel slides down + fades in (opacity 0→1, translateY(-8px)→0)
 *     300ms cubic-bezier(0.4, 0.22, 0.28, 1)
 *   - Tab items stagger-fade on panel open
 *   - Product cards stagger-fade when tab changes
 *   - No box-shadow on panel (reference: "no border, no shadow")
 */

interface CategoryTab {
  label: string;
  href: string;
  /** Placeholder icon character or emoji — swap for SVG later */
  icon: string;
  products: ProductCard[];
}

interface ProductCard {
  title: string;
  subtitle: string;
  href: string;
  /** Placeholder image path */
  image: string;
}

const CATEGORIES: CategoryTab[] = [
  {
    label: "Headphones",
    href: "/collections/headphones",
    icon: "🎧",
    products: [
      {
        title: "Studio Pro",
        subtitle: "Over-ear wireless",
        href: "/products/studio-pro",
        image: "/placeholder-headphones-1.jpg",
      },
      {
        title: "Bass Elite",
        subtitle: "Noise cancelling",
        href: "/products/bass-elite",
        image: "/placeholder-headphones-2.jpg",
      },
      {
        title: "AirWave",
        subtitle: "Lightweight design",
        href: "/products/airwave",
        image: "/placeholder-headphones-3.jpg",
      },
    ],
  },
  {
    label: "Earphones",
    href: "/collections/earphones",
    icon: "🎵",
    products: [
      {
        title: "BudPro X",
        subtitle: "True wireless",
        href: "/products/budpro-x",
        image: "/placeholder-earphones-1.jpg",
      },
      {
        title: "SoundPod",
        subtitle: "Active noise control",
        href: "/products/soundpod",
        image: "/placeholder-earphones-2.jpg",
      },
      {
        title: "FitBuds",
        subtitle: "Sport edition",
        href: "/products/fitbuds",
        image: "/placeholder-earphones-3.jpg",
      },
    ],
  },
  {
    label: "Speakers",
    href: "/collections/speakers",
    icon: "🔊",
    products: [
      {
        title: "SoundTower",
        subtitle: "Floor standing",
        href: "/products/soundtower",
        image: "/placeholder-speakers-1.jpg",
      },
      {
        title: "MiniBlast",
        subtitle: "Portable bluetooth",
        href: "/products/miniblast",
        image: "/placeholder-speakers-2.jpg",
      },
      {
        title: "HomePod Ultra",
        subtitle: "Smart speaker",
        href: "/products/homepod-ultra",
        image: "/placeholder-speakers-3.jpg",
      },
    ],
  },
  {
    label: "Accessories",
    href: "/collections/accessories",
    icon: "🔌",
    products: [
      {
        title: "Charging Case",
        subtitle: "Universal fit",
        href: "/products/charging-case",
        image: "/placeholder-accessories-1.jpg",
      },
      {
        title: "Cable Kit",
        subtitle: "Premium braided",
        href: "/products/cable-kit",
        image: "/placeholder-accessories-2.jpg",
      },
      {
        title: "Ear Tips Pack",
        subtitle: "Memory foam",
        href: "/products/ear-tips",
        image: "/placeholder-accessories-3.jpg",
      },
    ],
  },
];

interface Props {
  isOpen: boolean;
}

export default function ShopMegamenuAB({ isOpen }: Props) {
  const [activeTab, setActiveTab] = useState(0);
  const [displayTab, setDisplayTab] = useState(0);
  const tabChangeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTabChange = useCallback((idx: number) => {
    if (tabChangeTimer.current) clearTimeout(tabChangeTimer.current);
    setActiveTab(idx);
    // Brief delay before swapping product panel for crossfade effect
    tabChangeTimer.current = setTimeout(() => setDisplayTab(idx), 50);
  }, []);

  const category = CATEGORIES[displayTab];

  return (
    <div className={`megamenu-ab${isOpen ? " is-open" : ""}`}>
      <div className="megamenu-ab__inner container">
        {/* Left column: collections + tabs */}
        <div className="megamenu-ab__sidebar">
          <p className="megamenu-ab__heading">Collections</p>
          <div className="megamenu-ab__tabs">
            {CATEGORIES.map((cat, idx) => (
              <button
                key={cat.label}
                type="button"
                className={`megamenu-ab__tab${activeTab === idx ? " is-active" : ""}`}
                style={{
                  transitionDelay: isOpen ? `${0.15 + idx * 0.06}s` : "0s",
                }}
                onMouseEnter={() => handleTabChange(idx)}
                onClick={() => handleTabChange(idx)}
              >
                <span className="megamenu-ab__tab-icon">{cat.icon}</span>
                <span className="megamenu-ab__tab-label">{cat.label}</span>
              </button>
            ))}
          </div>
          <div className="megamenu-ab__footer">
            <a href="/collections/all" className="megamenu-ab__view-all">
              View All Products
              <svg
                viewBox="0 0 21 20"
                width="16"
                height="16"
                stroke="currentColor"
                fill="none"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 10H18M18 10L12.1667 4.16675M18 10L12.1667 15.8334"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Right column: product cards for active tab */}
        <div className="megamenu-ab__panel" key={displayTab}>
          <p className="megamenu-ab__panel-title">
            {category.label}
          </p>
          <div className="megamenu-ab__grid">
            {category.products.map((product, idx) => (
              <a
                key={product.title}
                href={product.href}
                className="megamenu-ab__card"
                style={{
                  animationDelay: `${0.1 + idx * 0.08}s`,
                }}
              >
                <div className="megamenu-ab__card-image">
                  {/* Placeholder colored box until real images are wired */}
                  <div
                    className="megamenu-ab__card-placeholder"
                    aria-label={product.title}
                  />
                </div>
                <div className="megamenu-ab__card-info">
                  <span className="megamenu-ab__card-title">
                    {product.title}
                  </span>
                  <span className="megamenu-ab__card-subtitle">
                    {product.subtitle}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
