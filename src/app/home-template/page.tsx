"use client";

/**
 * /home-template — Reference showroom page
 *
 * Preserves the Concept-theme reference sections that were moved off the
 * main homepage to keep `/` conversion-focused. All animations and
 * interactions are kept intact.
 *
 * Sections hosted here:
 *   • Category cards grid
 *   • Before/After Comparison
 *   • Marquee
 *   • Social Feed ("Shop the Feed")
 *   • Countdown Timer
 *   • Product Grid ("Premium Speakers")
 *   • Tabbed Categories
 *   • Blog Grid ("From the Journal")
 */

import { useState, useCallback, type ReactNode } from "react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Comparison from "@/components/Comparison";
import Marquee from "@/components/Marquee";
import CountdownTimer from "@/components/CountdownTimer";
import TabbedCategories from "@/components/TabbedCategories";
import Footer from "@/components/Footer";
import NewsletterPopup from "@/components/NewsletterPopup";
import BackToTop from "@/components/BackToTop";
import ScrollReveal from "@/components/ScrollReveal";

// ─── Static data ────────────────────────────────────────────────────────────

const CATEGORIES = [
  { seed: "catall", label: "All Products" },
  { seed: "catheadphones", label: "Headphones" },
  { seed: "catearphones", label: "Earphones" },
  { seed: "catspeakers", label: "Speakers" },
];

interface Product {
  seed: string;
  name: string;
  badge: string | null;
  badgeClass: string | null;
  price: ReactNode;
  stars: string;
}
const PRODUCTS: Product[] = [
  {
    seed: "speaker1",
    name: "Arena Pro Speaker",
    badge: "Sale",
    badgeClass: "sale",
    price: (
      <>
        <span className="sale-price">$199</span> <s>$349</s>
      </>
    ),
    stars: "★★★★★",
  },
  {
    seed: "speaker2",
    name: "Pulse Mini",
    badge: "New",
    badgeClass: "new",
    price: "$129",
    stars: "★★★★☆",
  },
  {
    seed: "speaker3",
    name: "Horizon Tower",
    badge: null,
    badgeClass: null,
    price: "$499",
    stars: "★★★★★",
  },
];

// ─── Page ───────────────────────────────────────────────────────────────────

export default function HomeTemplate() {
  const [cartCount, setCartCount] = useState(0);

  const addToCart = useCallback(() => {
    setCartCount((prev) => prev + 1);
  }, []);

  return (
    <>
      {/* ── Utility chrome ─────────────────────────────────────────── */}
      <AnnouncementBar />
      <Header cartCount={cartCount} />

      {/* ── Page title banner ──────────────────────────────────────── */}
      <section className="brand-intro" style={{ paddingBottom: 0 }}>
        <div className="container">
          <ScrollReveal animation="fadeInUp" as="div" className="brand-intro-left">
            <h2>Template Sections</h2>
            <p style={{ marginTop: "0.5rem", opacity: 0.7 }}>
              Reference showroom — Concept-theme sections preserved from the homepage.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Category Cards ────────────────────────────────────────── */}
      <section className="brand-intro">
        <div className="container">
          <div className="category-cards">
            {CATEGORIES.map((cat, i) => (
              <ScrollReveal
                key={cat.seed}
                animation="fadeInUp"
                delay={i * 100}
                as="div"
                className="category-card"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://picsum.photos/seed/${cat.seed}/600/800`}
                  alt={cat.label}
                />
                <div className="category-card-overlay">
                  <span>{cat.label}</span>
                  <span className="arrow">&rarr;</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Before/After Comparison ───────────────────────────────── */}
      <ScrollReveal animation="fadeIn">
        <Comparison />
      </ScrollReveal>

      {/* ── Marquee ───────────────────────────────────────────────── */}
      <Marquee />

      {/* ── Social Feed ───────────────────────────────────────────── */}
      <section className="social-feed">
        <div className="container">
          <div className="social-feed-header">
            <ScrollReveal animation="fadeInUp" as="h2">
              Shop the Feed
            </ScrollReveal>
            <ScrollReveal
              animation="fadeInUp"
              delay={100}
              as="div"
              className="handle"
            >
              <span>@DreamPlay</span>
              <button className="follow-btn">Follow</button>
            </ScrollReveal>
          </div>

          <div className="social-grid">
            {[1, 2, 3, 4, 5, 6].map((n, i) => (
              <ScrollReveal
                key={n}
                animation="scaleIn"
                delay={i * 50}
                as="div"
                className="social-item"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://picsum.photos/seed/social${n}/400/400`}
                  alt={`Social ${n}`}
                />
                <div className="social-item-overlay">
                  <span className="bag-icon">&#128717;</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Countdown Timer ───────────────────────────────────────── */}
      <ScrollReveal animation="fadeInUp">
        <CountdownTimer onAddToCart={addToCart} />
      </ScrollReveal>

      {/* ── Product Grid ──────────────────────────────────────────── */}
      <section className="product-grid-section">
        <div className="container">
          <ScrollReveal animation="fadeInUp" as="h2" className="section-heading">
            Premium Speakers
          </ScrollReveal>

          <div className="product-grid">
            {PRODUCTS.map((product, i) => (
              <ScrollReveal
                key={product.name}
                animation="fadeInUp"
                delay={i * 100}
                as="div"
                className="product-card"
              >
                <div className="product-card-image">
                  {product.badge && (
                    <span className={`product-badge ${product.badgeClass}`}>
                      {product.badge}
                    </span>
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://picsum.photos/seed/${product.seed}/600/800`}
                    alt={product.name}
                  />
                  <button className="quick-add" onClick={addToCart}>
                    Quick Add
                  </button>
                </div>
                <div className="product-card-info">
                  <h3>{product.name}</h3>
                  <p className="price">{product.price}</p>
                  <div className="stars">{product.stars}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tabbed Categories ─────────────────────────────────────── */}
      <ScrollReveal animation="fadeIn">
        <TabbedCategories />
      </ScrollReveal>

      {/* ── Blog Grid ─────────────────────────────────────────────── */}
      <section className="blog-section">
        <div className="container">
          <ScrollReveal animation="fadeInUp" as="h2" className="section-heading">
            From the Journal
          </ScrollReveal>

          <div className="blog-grid">
            <ScrollReveal
              animation="slideInLeft"
              as="div"
              className="blog-card blog-large"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://picsum.photos/seed/blog1/800/600"
                alt="Blog 1"
              />
              <div className="blog-card-content">
                <div className="blog-tag">Sound Design</div>
                <h3>The Art of Crafting Perfect Audio Drivers</h3>
                <div className="meta">March 15, 2026 &middot; 8 min read</div>
                <span className="read-more">Read More &rarr;</span>
              </div>
            </ScrollReveal>

            <div className="blog-stack">
              <ScrollReveal
                animation="slideInRight"
                as="div"
                className="blog-card"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://picsum.photos/seed/blog2/600/400"
                  alt="Blog 2"
                />
                <div className="blog-card-content">
                  <div className="blog-tag">Lifestyle</div>
                  <h3>How Music Shapes Your Daily Routine</h3>
                  <div className="meta">March 10, 2026</div>
                  <span className="read-more">Read More &rarr;</span>
                </div>
              </ScrollReveal>

              <ScrollReveal
                animation="slideInRight"
                delay={150}
                as="div"
                className="blog-card"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://picsum.photos/seed/blog3/600/400"
                  alt="Blog 3"
                />
                <div className="blog-card-content">
                  <div className="blog-tag">Technology</div>
                  <h3>Active Noise Cancellation Explained</h3>
                  <div className="meta">March 5, 2026</div>
                  <span className="read-more">Read More &rarr;</span>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Value Props ───────────────────────────────────────────── */}
      <section className="value-props">
        <div className="container">
          <div className="value-grid">
            {[
              {
                title: "Customer Service",
                desc: "24/7 expert support for all your audio needs",
                icon: (
                  <svg viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                ),
              },
              {
                title: "Free Shipping",
                desc: "Complimentary shipping on orders over $75",
                icon: (
                  <svg viewBox="0 0 24 24">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <ScrollReveal
                key={item.title}
                animation="fadeInUp"
                delay={i * 100}
                as="div"
                className="value-item"
              >
                <div className="icon-circle">{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer / Popups ───────────────────────────────────────── */}
      <Footer />
      <NewsletterPopup />
      <BackToTop />
    </>
  );
}
