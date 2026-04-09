"use client";

/**
 * /home2 — Animated homepage
 *
 * A copy of the root homepage with all Concept-theme animations applied:
 *   • fadeInSlide  — hero slides (built into HeroSlider)
 *   • fadeInUp     — headings, body text, CTAs, product cards, value props
 *   • slideInLeft  — blog large card, brand intro left column
 *   • slideInRight — blog stack cards, brand intro right column
 *   • scaleIn      — social feed cells
 *   • stagger      — 50–100ms delay per child for grids and lists
 *
 * Sections with staggered children are recreated inline so individual
 * children can receive their own ScrollReveal delay. Sections that need
 * only a simple reveal are wrapped with <ScrollReveal>.
 *
 * Compare at: /home (no animations) vs /home2 (full Concept animations)
 */

import { useState, useCallback, type ReactNode } from "react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import VideoSection from "@/components/VideoSection";
import FeaturedProduct from "@/components/FeaturedProduct";
import Comparison from "@/components/Comparison";
import BundleBuilder from "@/components/BundleBuilder";
import Marquee from "@/components/Marquee";
import CountdownTimer from "@/components/CountdownTimer";
import TabbedCategories from "@/components/TabbedCategories";
import Footer from "@/components/Footer";
import NewsletterPopup from "@/components/NewsletterPopup";
import BackToTop from "@/components/BackToTop";
import ScrollReveal from "@/components/ScrollReveal";

// ─── Static data for inlined stagger sections ───────────────────────────────

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

const VALUE_ITEMS = [
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
  {
    title: "Refer a Friend",
    desc: "Give $20, get $20 with our referral program",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "Secure Payment",
    desc: "SSL encrypted checkout with multiple payment options",
    icon: (
      <svg viewBox="0 0 24 24">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Home2() {
  const [cartCount, setCartCount] = useState(0);

  const addToCart = useCallback(() => {
    setCartCount((prev) => prev + 1);
  }, []);

  const addMultipleToCart = useCallback((count: number) => {
    setCartCount((prev) => prev + count);
  }, []);

  return (
    <>
      {/* ── Utility chrome — no animation needed ─────────────────────── */}
      <AnnouncementBar />
      <Header cartCount={cartCount} />

      {/* ── Hero Slider ───────────────────────────────────────────────
          HeroSlider already applies the Concept `fadeInSlide` (@keyframes
          fadeInSlide: opacity 0→1, 1000ms ease-out) to the active slide
          via its `.hero-slide.active` CSS. No extra wrapper needed. */}
      <HeroSlider />

      {/* ── Brand Intro ───────────────────────────────────────────────
          • Left column  : fadeInUp, 0ms delay
          • Right column : fadeInUp, 150ms delay
          • Category cards: staggered fadeInUp, 0 / 100 / 200 / 300ms */}
      <section className="brand-intro">
        <div className="container">
          <div className="brand-intro-top">
            <ScrollReveal
              animation="fadeInUp"
              as="div"
              className="brand-intro-left"
            >
              <h2>
                We believe in the
                <br />
                power of sound
              </h2>
              <a href="#" className="story-btn">
                Our Story &rarr;
              </a>
            </ScrollReveal>

            <ScrollReveal
              animation="fadeInUp"
              delay={150}
              as="div"
              className="brand-intro-right"
            >
              <p>
                At DreamPlay, we craft audio experiences that transcend the
                ordinary. Every product is meticulously engineered to deliver
                pristine clarity, deep bass, and an immersive soundscape that
                brings your music to life. Founded by audiophiles, for
                audiophiles — we&apos;re on a mission to make premium sound
                accessible to everyone.
              </p>
            </ScrollReveal>
          </div>

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

      {/* ── Video Section ─────────────────────────────────────────────
          Section fades in as a unit; the play-button pulse and modal
          transitions are handled by VideoSection's own CSS/state. */}
      <ScrollReveal animation="fadeIn">
        <VideoSection />
      </ScrollReveal>

      {/* ── Featured Product ──────────────────────────────────────────
          Fades in as a unit on scroll. The gallery/info split
          (slideInLeft / slideInRight per ANIMATIONS.md §7) would require
          lifting the gallery state out of FeaturedProduct — wrapped here
          as a single reveal to preserve all interactive behaviour. */}
      <ScrollReveal animation="fadeIn">
        <FeaturedProduct onAddToCart={addToCart} />
      </ScrollReveal>

      {/* ── Before/After Comparison ───────────────────────────────────
          Real-time clip-path drag — no scroll animation (§8). */}
      <ScrollReveal animation="fadeIn">
        <Comparison />
      </ScrollReveal>

      {/* ── Bundle Builder ────────────────────────────────────────────
          Progress bar and selection state handled internally. */}
      <ScrollReveal animation="fadeInUp">
        <BundleBuilder onAddToCart={addMultipleToCart} />
      </ScrollReveal>

      {/* ── Marquee ───────────────────────────────────────────────────
          Continuous translateX loop — no scroll-reveal (§10). */}
      <Marquee />

      {/* ── Social Feed ───────────────────────────────────────────────
          • Header: fadeInUp
          • Grid cells: staggered scaleIn, 50ms apart (§11) */}
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

      {/* ── Countdown Timer ───────────────────────────────────────────
          Section fades up; number ticks handled by setInterval (§12). */}
      <ScrollReveal animation="fadeInUp">
        <CountdownTimer onAddToCart={addToCart} />
      </ScrollReveal>

      {/* ── Product Grid ──────────────────────────────────────────────
          • Heading : fadeInUp
          • Cards   : staggered fadeInUp, 100ms apart (§13) */}
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

      {/* ── Testimonial ───────────────────────────────────────────────
          • Blockquote: fadeIn, 800ms ease-out (§14)
          • Cite      : fadeInUp, 300ms delay */}
      <section className="testimonial">
        <ScrollReveal animation="fadeIn" as="blockquote">
          &ldquo;The DreamPlay Elite Pro completely changed how I experience
          music. The clarity is unreal, and the noise cancellation is the best
          I&apos;ve ever used. Worth every penny.&rdquo;
        </ScrollReveal>
        <ScrollReveal animation="fadeInUp" delay={300} as="cite">
          &mdash; James Morrison, Music Producer
        </ScrollReveal>
      </section>

      {/* ── Tabbed Categories ─────────────────────────────────────────
          Tab-panel fade and grid stagger are driven by click, handled
          internally (§15). Section itself fades in on scroll. */}
      <ScrollReveal animation="fadeIn">
        <TabbedCategories />
      </ScrollReveal>

      {/* ── Blog Grid ─────────────────────────────────────────────────
          • Heading      : fadeInUp
          • Large card   : slideInLeft (§16)
          • Stack card 1 : slideInRight, 0ms delay
          • Stack card 2 : slideInRight, 150ms delay */}
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

      {/* ── Value Props ───────────────────────────────────────────────
          Staggered fadeInUp, 100ms apart (§17) */}
      <section className="value-props">
        <div className="container">
          <div className="value-grid">
            {VALUE_ITEMS.map((item, i) => (
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

      {/* ── Footer / Popups — static (§18, §19, §20) ────────────────── */}
      <Footer />
      <NewsletterPopup />
      <BackToTop />
    </>
  );
}
