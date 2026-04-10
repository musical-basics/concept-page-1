"use client";

import { useState, useRef, useCallback } from "react";
import { PRODUCTS } from "@/app/shop/_lib/shop-constants";

/**
 * DreamPlay megamenu — piano-specific content derived from shop-constants.
 *
 * Layout: two-column
 *   Left:  "Collections" heading + vertical tab buttons (SVG icon + label)
 *          Grand / Upright / Digital / Best Sellers
 *          + "View All Pianos" footer link
 *   Right: product-card grid (2 cards) + "Most Popular" highlight card
 */

/* ── Inline SVG icons for each category ─────────────────────────── */

function GrandPianoIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18V8a2 2 0 012-2h14a2 2 0 012 2v10" />
      <path d="M1 18h22" />
      <path d="M6 18v2M18 18v2" />
      <path d="M7 6V4a1 1 0 011-1h8a1 1 0 011 1v2" />
      <path d="M9 10v4M12 10v4M15 10v4" />
    </svg>
  );
}

function UprightPianoIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="18" rx="2" />
      <path d="M4 20h16" />
      <path d="M7 20v2M17 20v2" />
      <path d="M8 14h8" />
      <path d="M10 8v4M14 8v4" />
    </svg>
  );
}

function DigitalPianoIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="8" width="20" height="6" rx="1.5" />
      <path d="M5 14v4M19 14v4" />
      <path d="M3 18h4M17 18h4" />
      <path d="M7 10v2M10 10v2M13 10v2M16 10v2" />
      <circle cx="19" cy="11" r="0.5" fill="currentColor" />
    </svg>
  );
}

function BestSellersIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

const ICON_MAP: Record<string, () => React.JSX.Element> = {
  Grand: GrandPianoIcon,
  Upright: UprightPianoIcon,
  Digital: DigitalPianoIcon,
  "Best Sellers": BestSellersIcon,
};

/* ── Build megamenu data from shop-constants ─────────────────────── */

interface MegamenuProduct {
  title: string;
  subtitle: string;
  price: number;
  href: string;
  image: string;
}

interface CategoryTab {
  label: string;
  href: string;
  products: MegamenuProduct[];
  featured: MegamenuProduct;
}

function productToMega(p: (typeof PRODUCTS)[number]): MegamenuProduct {
  return {
    title: p.name,
    subtitle: `${p.finish} finish`,
    price: p.price,
    href: "/shop",
    image: p.image,
  };
}

// Pick the highest-rated (then most expensive) per category as "featured"
function pickFeatured(items: (typeof PRODUCTS)[number][]) {
  const sorted = [...items].sort((a, b) => b.rating - a.rating || b.price - a.price);
  return sorted[0];
}

const grandProducts = PRODUCTS.filter((p) => p.category === "Grand");
const uprightProducts = PRODUCTS.filter((p) => p.category === "Upright");
const digitalProducts = PRODUCTS.filter((p) => p.category === "Digital");
const bestSellers = PRODUCTS.filter((p) => p.badge === "lionels-pick" || p.rating === 5).slice(0, 4);

const MEGA_CATEGORIES: CategoryTab[] = [
  {
    label: "Grand",
    href: "/shop?category=Grand",
    products: grandProducts.slice(0, 2).map(productToMega),
    featured: productToMega(pickFeatured(grandProducts)),
  },
  {
    label: "Upright",
    href: "/shop?category=Upright",
    products: uprightProducts.slice(0, 2).map(productToMega),
    featured: productToMega(pickFeatured(uprightProducts)),
  },
  {
    label: "Digital",
    href: "/shop?category=Digital",
    products: digitalProducts.slice(0, 2).map(productToMega),
    featured: productToMega(pickFeatured(digitalProducts)),
  },
  {
    label: "Best Sellers",
    href: "/shop",
    products: bestSellers.slice(0, 2).map(productToMega),
    featured: productToMega(bestSellers[0]),
  },
];

/* ── Component ──────────────────────────────────────────────────── */

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

  const category = MEGA_CATEGORIES[displayTab];

  const formatPrice = (price: number) =>
    price.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 });

  return (
    <div className={`megamenu-ab${isOpen ? " is-open" : ""}`}>
      <div className="megamenu-ab__inner container">
        {/* Left column: collections + tabs */}
        <div className="megamenu-ab__sidebar">
          <p className="megamenu-ab__heading">Collections</p>
          <div className="megamenu-ab__tabs">
            {MEGA_CATEGORIES.map((cat, idx) => {
              const TabIcon = ICON_MAP[cat.label];
              return (
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
                  <span className="megamenu-ab__tab-icon">
                    {TabIcon ? <TabIcon /> : null}
                  </span>
                  <span className="megamenu-ab__tab-label">{cat.label}</span>
                </button>
              );
            })}
          </div>
          <div className="megamenu-ab__footer">
            <a href="/shop" className="megamenu-ab__view-all">
              View All Pianos
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

        {/* Right column: product cards + featured highlight */}
        <div className="megamenu-ab__panel" key={displayTab}>
          <p className="megamenu-ab__panel-title">{category.label}</p>
          <div className="megamenu-ab__panel-layout">
            {/* Product cards */}
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
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image}
                      alt={product.title}
                      className="megamenu-ab__card-img"
                    />
                  </div>
                  <div className="megamenu-ab__card-info">
                    <span className="megamenu-ab__card-title">
                      {product.title}
                    </span>
                    <span className="megamenu-ab__card-subtitle">
                      {product.subtitle} · {formatPrice(product.price)}
                    </span>
                  </div>
                </a>
              ))}
            </div>

            {/* "Most Popular" highlight card */}
            <a
              href={category.featured.href}
              className="megamenu-ab__featured"
              style={{ animationDelay: "0.18s" }}
            >
              <div className="megamenu-ab__featured-badge">Most Popular</div>
              <div className="megamenu-ab__featured-image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={category.featured.image}
                  alt={category.featured.title}
                  className="megamenu-ab__card-img"
                />
              </div>
              <div className="megamenu-ab__featured-info">
                <span className="megamenu-ab__featured-name">
                  {category.featured.title}
                </span>
                <span className="megamenu-ab__featured-price">
                  {formatPrice(category.featured.price)}
                </span>
              </div>
              <span className="megamenu-ab__featured-cta">
                Shop now
                <svg viewBox="0 0 21 20" width="14" height="14" stroke="currentColor" fill="none">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10H18M18 10L12.1667 4.16675M18 10L12.1667 15.8334" />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
