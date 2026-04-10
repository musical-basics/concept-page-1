"use client";

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

/* ── Scroll-reveal hook ── */

function useScrollReveal() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const observe = useCallback(() => {
    // Elements are observed centrally after mount.
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const revealAll = () => {
      document
        .querySelectorAll(".scroll-reveal")
        .forEach((el) => el.classList.add("revealed"));
    };

    if (prefersReduced) {
      revealAll();
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("revealed");
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    requestAnimationFrame(() => {
      document.querySelectorAll(".scroll-reveal").forEach((el) => {
        observerRef.current?.observe(el);
      });
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return observe;
}

/* ── Feature data ── */

interface Feature {
  title: string;
  description: string;
  image: string;
}

const HERO_FEATURES: Feature[] = [
  {
    title: "Premium Sound Engine",
    description:
      "Concert-grade multi-layer sampling captures every nuance of hammer, string, and resonance across the full dynamic range.",
    image: "/assets/dreamplay/keyboard_studio.avif",
  },
  {
    title: "Responsive Touch System",
    description:
      "Graded hammer action with 88 fully weighted keys delivers the expressive control of an acoustic grand.",
    image: "/assets/dreamplay/hand_relaxed.jpg",
  },
  {
    title: "Intelligent Connectivity",
    description:
      "Bluetooth MIDI, USB-C, and the DreamPlay app turn your instrument into a complete creative studio.",
    image: "/assets/dreamplay/starred/dreamplay-piano-with-midi-app-copy.png",
  },
];

const DETAIL_FEATURES_1: Feature[] = [
  {
    title: "Weighted Key Action",
    description:
      "Progressive hammer weighting replicates the heavier bass and lighter treble of an acoustic piano.",
    image: "/assets/dreamplay/hand_span_guide.jpg",
  },
  {
    title: "Bluetooth MIDI",
    description:
      "Connect wirelessly to any DAW, notation software, or learning app with zero-latency Bluetooth.",
    image: "/assets/midi-app.png",
  },
  {
    title: "Practice Mode",
    description:
      "Built-in metronome, recorder, and split-keyboard mode make every practice session count.",
    image: "/assets/dreamplay/ds55_white.png",
  },
  {
    title: "LED Key Guides",
    description:
      "Subtle LED strips above each key light up to guide learners through songs and exercises.",
    image: "/assets/keyboard-led.jpg",
  },
  {
    title: "Multi-Layer Sampling",
    description:
      "Up to 12 velocity layers per note ensure that pianissimo whispers and fortissimo roars feel real.",
    image: "/assets/piano-front.jpg",
  },
  {
    title: "Headphone Optimization",
    description:
      "Spatial audio processing delivers a natural, room-filling sound even through headphones.",
    image: "/assets/dreamplay/ds60_black.png",
  },
];

const DETAIL_FEATURES_2: Feature[] = [
  {
    title: "DreamPlay App",
    description:
      "Access thousands of songs, lessons, and sound presets from the free companion app.",
    image: "/assets/dreamplay/starred/dreamplay-piano-with-midi-app-copy.png",
  },
  {
    title: "Ergonomic Bench",
    description:
      "Height-adjustable bench with memory-foam cushion keeps you comfortable through long sessions.",
    image: "/assets/dreamplay/starred/piano-bench-frontal-bundle.png",
  },
  {
    title: "Triple Pedal System",
    description:
      "Sustain, sostenuto, and soft pedals with half-damper detection for fully expressive performance.",
    image: "/assets/dreamplay/starred/ds-6.jpg",
  },
  {
    title: "Studio Recording",
    description:
      "Line-out and USB audio let you record broadcast-quality audio directly from the instrument.",
    image: "/assets/dreamplay/keyboard_studio.avif",
  },
  {
    title: "Performance Presets",
    description:
      "Grand, upright, electric piano, organ, and string presets at the touch of a button.",
    image: "/assets/dreamplay/lionel_performance.png",
  },
  {
    title: "Customizable Touch",
    description:
      "Five touch-sensitivity curves let you dial in the exact key response you prefer.",
    image: "/assets/dreamplay/hand_strain.png",
  },
];

const CLOSING_FEATURES: Feature[] = [
  {
    title: "Compact Design",
    description:
      "Slim-profile cabinet fits gracefully in apartments, studios, and practice rooms.",
    image: "/assets/dreamplay/starred/gold-ds-6.0-full.png",
  },
  {
    title: "Premium Materials",
    description:
      "Sustainably sourced wood veneer, brushed metal accents, and a hand-finished matte lacquer.",
    image: "/assets/factory-keys.jpg",
  },
  {
    title: "5-Year Warranty",
    description:
      "Every DreamPlay instrument is backed by our comprehensive five-year warranty and lifetime support.",
    image: "/assets/factory-exterior.jpg",
  },
];

/* ── Feature Card component ── */

function FeatureCard({
  feature,
  revealRef,
  delay = 0,
}: {
  feature: Feature;
  revealRef?: (el: HTMLElement | null) => void;
  delay?: number;
}) {
  return (
    <div
      className="feat-card scroll-reveal"
      ref={revealRef}
      style={{ transitionDelay: `${delay}ms` } as React.CSSProperties}
    >
      <div className="feat-card-media">
        <Image
          src={feature.image}
          alt={feature.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="feat-card-info">
        <h3 className="feat-card-title">{feature.title}</h3>
        <p className="feat-card-desc">{feature.description}</p>
      </div>
    </div>
  );
}

/* ── Feature Highlight component ── */

interface HighlightProps {
  icon: React.ReactNode;
  heading: string;
  description: string;
  image: string;
  imageAlt: string;
  reverse?: boolean;
}

function FeatureHighlight({
  icon,
  heading,
  description,
  image,
  imageAlt,
  reverse,
  revealRef,
}: HighlightProps & { revealRef?: (el: HTMLElement | null) => void }) {
  return (
    <section
      className={`feat-highlight${reverse ? " feat-highlight--reverse" : ""} scroll-reveal`}
      ref={revealRef}
    >
      <div className="container">
        <div className="feat-highlight-inner">
          <div className="feat-highlight-text">
            <div className="feat-highlight-icon">{icon}</div>
            <h2 className="feat-highlight-heading">{heading}</h2>
            <p className="feat-highlight-desc">{description}</p>
          </div>
          <div className="feat-highlight-media">
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Icons for highlights ── */

const IconSound = (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20v8M18 16v16M24 12v24M30 16v16M36 20v8" />
  </svg>
);

const IconDesign = (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="10" width="36" height="28" rx="3" />
    <path d="M6 18h36" />
    <path d="M16 10v8M24 10v8M32 10v8" />
  </svg>
);

const IconMusician = (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="24" cy="16" r="8" />
    <path d="M8 42c0-8.837 7.163-16 16-16s16 7.163 16 16" />
  </svg>
);

/* ── Page ── */

export default function FeaturesPage() {
  const observe = useScrollReveal();

  return (
    <>
      <AnnouncementBar />
      <Header cartCount={0} />

      {/* Hero Banner */}
      <section className="features-hero">
        <div className="features-hero-bg scroll-reveal scroll-reveal--zoom" ref={observe} />
        <div className="features-hero-overlay">
          <div className="container features-hero-content scroll-reveal" ref={observe}>
            <nav className="features-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <span>Features</span>
            </nav>
            <h1>Features</h1>
            <p className="features-hero-sub">
              Every detail engineered for expression. Discover what makes DreamPlay instruments exceptional.
            </p>
          </div>
        </div>
      </section>

      {/* Hero Features — 3 cards */}
      <section className="feat-section">
        <div className="container">
          <div className="feat-grid feat-grid--3">
            {HERO_FEATURES.map((f, i) => (
              <FeatureCard key={f.title} feature={f} revealRef={observe} delay={i * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* Highlight 1 — Sound */}
      <FeatureHighlight
        icon={IconSound}
        heading="Sound that moves you"
        description="Recorded on a Steinway concert grand in a world-class studio, our multi-layer samples capture every subtlety of tone, from the softest pianissimo to the most commanding fortissimo. Advanced sympathetic resonance modeling adds the warmth and depth of a real acoustic piano."
        image="/assets/dreamplay/pianist_hands.jpg"
        imageAlt="Pianist hands on DreamPlay keyboard"
        revealRef={observe}
      />

      {/* Detail Features 1 — 6 cards */}
      <section className="feat-section">
        <div className="container">
          <div className="feat-grid feat-grid--3">
            {DETAIL_FEATURES_1.map((f, i) => (
              <FeatureCard key={f.title} feature={f} revealRef={observe} delay={(i % 3) * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* Highlight 2 — Design */}
      <FeatureHighlight
        icon={IconDesign}
        heading="Designed for every space"
        description="From concert stage to compact apartment, DreamPlay instruments are crafted to look and sound stunning in any environment. The slim-profile cabinet, premium finishes, and integrated cable management mean your piano is as beautiful silent as it is in full voice."
        image="/assets/dreamplay/starred/gold-ds-6.jpg"
        imageAlt="Gold DreamPlay DS 6 in modern room"
        reverse
        revealRef={observe}
      />

      {/* Feature Showcase — spotlights */}
      <section className="feat-section">
        <div className="container">
          <h2 className="feat-section-heading scroll-reveal">Technology &amp; Connectivity</h2>
          <div className="feat-showcase-duo">
            {DETAIL_FEATURES_2.slice(0, 2).map((f, i) => (
              <div key={f.title} className="feat-showcase-card scroll-reveal" style={{ transitionDelay: `${i * 120}ms` } as React.CSSProperties}>
                <div className="feat-showcase-media">
                  <Image src={f.image} alt={f.title} fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: "cover" }} />
                </div>
                <div className="feat-showcase-content">
                  <h3>{f.title}</h3>
                  <p>{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compact feature strip */}
      <section className="feat-section feat-section--warm">
        <div className="container">
          <div className="feat-grid feat-grid--4">
            {DETAIL_FEATURES_2.slice(2).map((f, i) => (
              <FeatureCard key={f.title} feature={f} revealRef={observe} delay={(i % 4) * 80} />
            ))}
          </div>
        </div>
      </section>

      {/* Highlight 3 — Musicians */}
      <FeatureHighlight
        icon={IconMusician}
        heading="Built for musicians"
        description="DreamPlay instruments are shaped by feedback from concert pianists, studio producers, and music educators around the world. Every feature — from touch sensitivity curves to pedal response — has been refined through thousands of hours of real-world performance testing."
        image="/assets/dreamplay/carol_leone.png"
        imageAlt="Carol Leone performing on DreamPlay piano"
        revealRef={observe}
      />

      {/* Specs Banner */}
      <section className="feat-specs scroll-reveal" ref={observe}>
        <div className="container">
          <div className="feat-specs-grid">
            {[
              { number: "12", label: "Velocity Layers" },
              { number: "88", label: "Weighted Keys" },
              { number: "47", label: "Quality Checks" },
              { number: "5yr", label: "Warranty" },
            ].map((s) => (
              <div key={s.label} className="feat-spec-item">
                <span className="feat-spec-number">{s.number}</span>
                <span className="feat-spec-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Craftsmanship Showcase — full-bleed */}
      <section className="feat-fullbleed scroll-reveal" ref={observe}>
        <div
          className="feat-fullbleed-bg"
          style={{ backgroundImage: "url('/assets/factory-keys.jpg')" }}
        />
        <div className="feat-fullbleed-overlay">
          <div className="container">
            <div className="feat-fullbleed-content">
              <h2 className="feat-fullbleed-heading">Craftsmanship you can feel</h2>
              <p className="feat-fullbleed-desc">
                Every DreamPlay instrument passes through 47 quality checkpoints
                before leaving our workshop.
              </p>
            </div>
            <div className="feat-fullbleed-points">
              {CLOSING_FEATURES.map((f) => (
                <div key={f.title} className="feat-fullbleed-point">
                  <h3>{f.title}</h3>
                  <p>{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="feat-cta scroll-reveal" ref={observe}>
        <div className="container feat-cta-inner">
          <h2 className="feat-cta-heading">Experience DreamPlay</h2>
          <p className="feat-cta-desc">
            Discover an instrument crafted for every stage of your musical journey.
          </p>
          <Link href="/shop" className="feat-cta-btn">
            Shop the Collection
          </Link>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </>
  );
}
