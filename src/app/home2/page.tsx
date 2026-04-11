"use client";

/**
 * /home2 — Core homepage (conversion-focused)
 *
 * Shortened homepage with only the key sections that drive engagement
 * and conversion. The remaining Concept-theme reference sections have
 * been moved to /home-template for preservation.
 *
 * Sections:
 *   • Hero Slider
 *   • Brand Intro (text only — category cards moved to /home-template)
 *   • Video Section (lifestyle/ecosystem)
 *   • Featured Product
 *   • Bundle Builder
 *   • Testimonial
 *   • Value Props
 */

import { useState, useCallback } from "react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import VideoSection from "@/components/VideoSection";
import FeaturedProduct from "@/components/FeaturedProduct";
import BundleBuilder from "@/components/BundleBuilder";
import Footer from "@/components/Footer";
import NewsletterPopup from "@/components/NewsletterPopup";
import BackToTop from "@/components/BackToTop";
import ScrollReveal from "@/components/ScrollReveal";

// ─── Static data ────────────────────────────────────────────────────────────

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

// ─── Page ───────────────────────────────────────────────────────────────────

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
      {/* ── Utility chrome ─────────────────────────────────────────── */}
      <AnnouncementBar />
      <Header cartCount={cartCount} />

      {/* ── Hero Slider ────────────────────────────────────────────── */}
      <HeroSlider />

      {/* ── Brand Intro (text only) ────────────────────────────────── */}
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
        </div>
      </section>

      {/* ── Video Section (lifestyle/ecosystem) ────────────────────── */}
      <ScrollReveal animation="fadeIn">
        <VideoSection />
      </ScrollReveal>

      {/* ── Featured Product ───────────────────────────────────────── */}
      <ScrollReveal animation="fadeIn">
        <FeaturedProduct onAddToCart={addToCart} />
      </ScrollReveal>

      {/* ── Bundle Builder ─────────────────────────────────────────── */}
      <ScrollReveal animation="fadeInUp">
        <BundleBuilder onAddToCart={addMultipleToCart} />
      </ScrollReveal>

      {/* ── Testimonial ────────────────────────────────────────────── */}
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

      {/* ── Value Props ────────────────────────────────────────────── */}
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

      {/* ── Footer / Popups ────────────────────────────────────────── */}
      <Footer />
      <NewsletterPopup />
      <BackToTop />
    </>
  );
}
