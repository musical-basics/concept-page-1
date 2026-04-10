"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

// ── Types ──────────────────────────────────────────────────────────────────

interface Product {
  id: string;
  name: string;
  tagline: string;
  price: number;
  stars: number;
  reviewCount: number;
  seed: string;
  badge: string | null;
}

interface PresetBundle {
  label: string;
  ids: string[];
  items: string[];
  originalTotal: number;
  bundlePrice: number;
  seed: string;
}

// ── Data ───────────────────────────────────────────────────────────────────

const PRODUCTS: Product[] = [
  {
    id: "ds6",
    name: "DS 6.0 Digital Piano",
    tagline: "88-key weighted hammer action, 4-speaker system",
    price: 2999,
    stars: 5.0,
    reviewCount: 214,
    seed: "byb-piano",
    badge: "Best Seller",
  },
  {
    id: "bench",
    name: "Adjustable Piano Bench",
    tagline: "Hand-stitched leather, height-adjustable frame",
    price: 299,
    stars: 4.9,
    reviewCount: 87,
    seed: "byb-bench",
    badge: null,
  },
  {
    id: "pedal",
    name: "Pro Sustain Pedal",
    tagline: "Continuous controller with weighted feel",
    price: 99,
    stars: 4.8,
    reviewCount: 156,
    seed: "byb-pedal",
    badge: null,
  },
  {
    id: "app",
    name: "DreamPlay App — 1 Year",
    tagline: "Full lesson library, songs & custom presets",
    price: 79,
    stars: 4.9,
    reviewCount: 432,
    seed: "byb-app",
    badge: "Fan Favourite",
  },
  {
    id: "headphones",
    name: "Studio Monitor Headphones",
    tagline: "40mm drivers, 20Hz–20kHz response range",
    price: 249,
    stars: 5.0,
    reviewCount: 98,
    seed: "byb-phones",
    badge: null,
  },
  {
    id: "case",
    name: "Instrument Carry Case",
    tagline: "Padded shell, waterproof, rolling wheels",
    price: 149,
    stars: 4.7,
    reviewCount: 63,
    seed: "byb-case",
    badge: null,
  },
];

const PRESET_BUNDLES: PresetBundle[] = [
  {
    label: "The Performer Set",
    ids: ["ds6", "bench", "pedal"],
    items: ["DS 6.0 Digital Piano", "Adjustable Piano Bench", "Pro Sustain Pedal"],
    originalTotal: 3397,
    bundlePrice: 2378,
    seed: "preset-performer",
  },
  {
    label: "The Studio Setup",
    ids: ["ds6", "headphones", "app"],
    items: ["DS 6.0 Digital Piano", "Studio Monitor Headphones", "DreamPlay App (1 yr)"],
    originalTotal: 3327,
    bundlePrice: 2329,
    seed: "preset-studio",
  },
  {
    label: "The Essential Trio",
    ids: ["bench", "pedal", "app"],
    items: ["Adjustable Piano Bench", "Pro Sustain Pedal", "DreamPlay App (1 yr)"],
    originalTotal: 477,
    bundlePrice: 334,
    seed: "preset-essential",
  },
];

// ── Scroll-reveal hook ─────────────────────────────────────────────────────

function useScrollReveal() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const revealAll = () => {
      document
        .querySelectorAll(".byb-reveal")
        .forEach((el) => el.classList.add("byb-revealed"));
    };

    if (prefersReduced) {
      revealAll();
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("byb-revealed");
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );

    const fallbackTimer = window.setTimeout(revealAll, 1200);

    requestAnimationFrame(() => {
      document.querySelectorAll(".byb-reveal").forEach((el) => {
        const rect = (el as HTMLElement).getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) {
          el.classList.add("byb-revealed");
        } else {
          observerRef.current?.observe(el);
        }
      });
    });

    return () => {
      window.clearTimeout(fallbackTimer);
      observerRef.current?.disconnect();
    };
  }, []);
}

// ── Stars ──────────────────────────────────────────────────────────────────

function Stars({ rating }: { rating: number }) {
  return (
    <span className="byb-stars" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          viewBox="0 0 20 20"
          fill={n <= Math.round(rating) ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function BuildYourBundlePage() {
  useScrollReveal();

  const [cartCount, setCartCount] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [addedToCart, setAddedToCart] = useState(false);

  const toggleProduct = useCallback((id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    setAddedToCart(false);
  }, []);

  const applyPreset = useCallback((ids: string[]) => {
    setSelected(ids);
    setAddedToCart(false);
    const builder = document.getElementById("byb-builder");
    if (builder) {
      builder.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const count = selected.length;
  const selectedProducts = PRODUCTS.filter((p) => selected.includes(p.id));
  const subtotal = selectedProducts.reduce((s, p) => s + p.price, 0);
  const discountPct = count >= 3 ? 0.3 : 0;
  const savings = Math.round(subtotal * discountPct);
  const total = subtotal - savings;

  const progress = Math.min((count / 3) * 100, 100);
  const progressText =
    count === 0
      ? "Add 3 or more items to save 30%"
      : count === 1
        ? "Add 2 more items to unlock 30% off"
        : count === 2
          ? "Add 1 more item to unlock 30% off"
          : `${count} items selected — 30% discount applied`;

  const handleAddToCart = useCallback(() => {
    if (count >= 3) {
      setCartCount((c) => c + count);
      setAddedToCart(true);
    }
  }, [count]);

  return (
    <>
      <AnnouncementBar />
      <Header cartCount={cartCount} />

      {/* ── Hero ── */}
      <section className="byb-hero">
        <div className="byb-hero-overlay">
          <div className="container">
            <nav
              className="byb-breadcrumb byb-reveal"
              aria-label="Breadcrumb"
            >
              <Link href="/">Home</Link>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <span>Build Your Bundle</span>
            </nav>
            <h1
              className="byb-reveal"
              style={{ transitionDelay: "80ms" } as React.CSSProperties}
            >
              Build Your Bundle
            </h1>
            <p
              className="byb-hero-sub byb-reveal"
              style={{ transitionDelay: "160ms" } as React.CSSProperties}
            >
              Select 3 or more items and save 30%
            </p>
            <div
              className="byb-hero-badges byb-reveal"
              style={{ transitionDelay: "240ms" } as React.CSSProperties}
            >
              <span>Free Shipping</span>
              <span>30-Day Returns</span>
              <span>5-Year Warranty</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Builder ── */}
      <section className="byb-builder" id="byb-builder">
        <div className="container">
          <div className="byb-grid">
            {/* Left: editorial intro + product grid */}
            <div>
              <div className="byb-intro-copy byb-reveal">
                <h2 className="byb-intro-heading">
                  Buy 3 and <em>save 30%</em>
                </h2>
                <p className="byb-intro-text">
                  The choice is yours. Build a DreamPlay setup with any
                  combination of essentials, accessories, and studio add-ons —
                  then unlock the full bundle discount automatically.
                </p>
              </div>

              <div
                className="byb-selection-stage byb-reveal"
                style={{ transitionDelay: "70ms" } as React.CSSProperties}
              >
                {[0, 1, 2].map((slot) => {
                  const item = selectedProducts[slot];
                  return (
                    <div
                      key={item?.id ?? `slot-${slot}`}
                      className={`byb-selection-slot${item ? " is-filled" : ""}`}
                    >
                      {item ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`https://picsum.photos/seed/${item.seed}/160/120`}
                            alt={item.name}
                            className="byb-selection-slot-image"
                          />
                          <div className="byb-selection-slot-copy">
                            <span>{item.name}</span>
                            <strong>${item.price.toLocaleString()}</strong>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="byb-selection-slot-plus">+</span>
                          <span className="byb-selection-slot-label">
                            Select item {slot + 1}
                          </span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="byb-product-section byb-reveal" style={{ transitionDelay: "120ms" } as React.CSSProperties}>
                <p className="byb-section-label">Build a custom set</p>
                <div className="byb-products">
                {PRODUCTS.map((prod, i) => {
                  const isSelected = selected.includes(prod.id);
                  return (
                    <div
                      key={prod.id}
                      className={`byb-card byb-reveal${isSelected ? " is-selected" : ""}`}
                      style={
                        { transitionDelay: `${i * 55}ms` } as React.CSSProperties
                      }
                      onClick={() => toggleProduct(prod.id)}
                    >
                      {prod.badge && (
                        <span className="byb-card-badge">{prod.badge}</span>
                      )}
                      <div className="byb-card-check">
                        {isSelected ? "✓" : ""}
                      </div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://picsum.photos/seed/${prod.seed}/300/300`}
                        alt={prod.name}
                        className="byb-card-img"
                      />
                      <div className="byb-card-info">
                        <div className="byb-card-rating">
                          <Stars rating={prod.stars} />
                          <span className="byb-review-count">
                            ({prod.reviewCount})
                          </span>
                        </div>
                        <h3 className="byb-card-name">{prod.name}</h3>
                        <p className="byb-card-tagline">{prod.tagline}</p>
                        <div className="byb-card-footer">
                          <span className="byb-card-price">
                            ${prod.price.toLocaleString()}
                          </span>
                          <button
                            className={`byb-add-btn${isSelected ? " is-added" : ""}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleProduct(prod.id);
                            }}
                            aria-pressed={isSelected}
                          >
                            {isSelected ? "Added ✓" : "Add to bundle"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                </div>
              </div>
            </div>

            {/* Right: sticky summary */}
            <aside className="byb-sidebar byb-reveal">
              <h2 className="byb-sidebar-title">Your Bundle</h2>

              {/* Tier progress */}
              <div className="byb-progress">
                <div className="byb-progress-track">
                  <div
                    className="byb-progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p
                  className={`byb-progress-text${count >= 3 ? " is-unlocked" : ""}`}
                >
                  {progressText}
                </p>
                <div className="byb-tier-markers">
                  <span>0</span>
                  <span className={count >= 1 ? "is-active" : ""}>1</span>
                  <span className={count >= 2 ? "is-active" : ""}>2</span>
                  <span
                    className={count >= 3 ? "is-active is-gold" : ""}
                  >
                    3+
                  </span>
                </div>
              </div>

              {/* Selected items */}
              <div className="byb-item-list">
                {selectedProducts.length === 0 ? (
                  <p className="byb-empty-state">No items added yet</p>
                ) : (
                  selectedProducts.map((p) => (
                    <div key={p.id} className="byb-item">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://picsum.photos/seed/${p.seed}/60/60`}
                        alt={p.name}
                        className="byb-item-thumb"
                      />
                      <div className="byb-item-meta">
                        <span className="byb-item-name">{p.name}</span>
                        <span className="byb-item-price">
                          ${p.price.toLocaleString()}
                        </span>
                      </div>
                      <button
                        className="byb-item-remove"
                        onClick={() => toggleProduct(p.id)}
                        aria-label={`Remove ${p.name}`}
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Totals */}
              {selectedProducts.length > 0 && (
                <div className="byb-totals">
                  <div className="byb-total-row">
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  {savings > 0 && (
                    <div className="byb-total-row byb-total-row--discount">
                      <span>Bundle discount (30%)</span>
                      <span>−${savings.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="byb-total-row byb-total-row--final">
                    <span>Total</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {savings > 0 && (
                <p className="byb-savings-callout">
                  You&apos;re saving ${savings.toLocaleString()} with this
                  bundle!
                </p>
              )}

              <button
                className={`byb-cta-btn${count >= 3 ? " is-active" : ""}${addedToCart ? " is-done" : ""}`}
                onClick={handleAddToCart}
                disabled={count < 3}
              >
                {addedToCart
                  ? "Added to Cart ✓"
                  : count >= 3
                    ? "Add Bundle to Cart"
                    : `Add ${Math.max(0, 3 - count)} more to unlock`}
              </button>

              {count < 3 && (
                <p className="byb-sidebar-note">
                  Discount applies at checkout when 3 or more items are
                  selected.
                </p>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* ── Preset Bundles ── */}
      <section className="byb-presets">
        <div className="container">
          <h2 className="byb-presets-heading byb-reveal">
            Popular Bundle Sets
          </h2>
          <p
            className="byb-presets-sub byb-reveal"
            style={{ transitionDelay: "80ms" } as React.CSSProperties}
          >
            Curated combinations — click any set to load it into your builder
          </p>
          <div className="byb-preset-grid">
            {PRESET_BUNDLES.map((preset, i) => {
              const saving = preset.originalTotal - preset.bundlePrice;
              return (
                <div
                  key={preset.label}
                  className="byb-preset-card byb-reveal"
                  style={
                    { transitionDelay: `${i * 100}ms` } as React.CSSProperties
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://picsum.photos/seed/${preset.seed}/600/360`}
                    alt={preset.label}
                    className="byb-preset-img"
                  />
                  <div className="byb-preset-content">
                    <span className="byb-preset-save-badge">
                      Save ${saving.toLocaleString()}
                    </span>
                    <h3 className="byb-preset-name">{preset.label}</h3>
                    <ul className="byb-preset-items">
                      {preset.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <div className="byb-preset-pricing">
                      <span className="byb-preset-original">
                        ${preset.originalTotal.toLocaleString()}
                      </span>
                      <span className="byb-preset-bundle">
                        ${preset.bundlePrice.toLocaleString()}
                      </span>
                    </div>
                    <button
                      className="byb-preset-load-btn"
                      onClick={() => applyPreset(preset.ids)}
                    >
                      Load this bundle
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Trust section ── */}
      <section className="byb-trust">
        <div className="container">
          <div className="byb-trust-grid">
            {[
              {
                icon: (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect x="1" y="3" width="15" height="13" rx="1" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                ),
                title: "Free Shipping",
                desc: "Complimentary on all bundle orders over $300",
              },
              {
                icon: (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ),
                title: "30-Day Returns",
                desc: "No-hassle returns on any item in your bundle",
              },
              {
                icon: (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                ),
                title: "Expert Support",
                desc: "Piano specialists available 7 days a week",
              },
              {
                icon: (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                ),
                title: "5-Year Warranty",
                desc: "Comprehensive coverage on all instruments",
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className="byb-trust-item byb-reveal"
                style={
                  { transitionDelay: `${i * 80}ms` } as React.CSSProperties
                }
              >
                <div className="byb-trust-icon">{item.icon}</div>
                <h4 className="byb-trust-title">{item.title}</h4>
                <p className="byb-trust-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </>
  );
}
