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

  const observe = useCallback(() => {}, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const revealAll = () => {
      document
        .querySelectorAll(
          ".scroll-reveal, .scroll-reveal--from-left, .scroll-reveal--from-right"
        )
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
      document
        .querySelectorAll(
          ".scroll-reveal, .scroll-reveal--from-left, .scroll-reveal--from-right"
        )
        .forEach((el) => {
          observerRef.current?.observe(el);
        });
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return observe;
}

/* ── Data ── */

const TIMELINE = [
  {
    year: "2019",
    heading: "Founded",
    body: "Lionel Yu founded DreamPlay from a San Francisco studio, convinced that the emotional experience of playing piano had never been fully translated into a digital instrument.",
    image: "/assets/dreamplay/starred/ds-6.0---dreamplay-black-white-background.jpg",
  },
  {
    year: "2020",
    heading: "The Workshop",
    body: "We opened our first engineering workshop, uniting instrument designers, acoustic engineers, and concert pianists to build something entirely new.",
    image: "/assets/factory-exterior.jpg",
  },
  {
    year: "2021",
    heading: "App & Ecosystem",
    body: "The DreamPlay companion app launched, connecting instruments to thousands of songs, guided lessons, and custom sound presets.",
    image: "/assets/dreamplay/starred/dreamplay-piano-with-midi-app-copy.png",
  },
  {
    year: "2022",
    heading: "Concert Halls",
    body: "DreamPlay instruments reached their first professional stage partnerships, placing our pianos in performance venues across North America.",
    image: "/assets/dreamplay/lionel_performance.png",
  },
  {
    year: "2023",
    heading: "DS 6.0",
    body: "Our most advanced instrument yet. The DS 6.0 redefined what a digital piano could sound, feel, and look like — winning four industry design awards.",
    image: "/assets/dreamplay/starred/gold-ds-6.jpg",
  },
  {
    year: "2024",
    heading: "Gold Edition",
    body: "Limited to 250 units worldwide, the Gold Edition sold out in 72 hours — affirming DreamPlay's place at the intersection of art and engineering.",
    image: "/assets/dreamplay/starred/piano-bench-frontal-bundle.png",
  },
];

/* ── Page ── */

export default function OurStoryPage() {
  useScrollReveal();

  return (
    <>
      <AnnouncementBar />
      <Header cartCount={0} />

      {/* ── Hero ── */}
      <section className="os-hero">
        <div className="os-hero-bg scroll-reveal scroll-reveal--zoom" />
        <div className="os-hero-overlay">
          <div className="container">
            <nav className="os-breadcrumb scroll-reveal" aria-label="Breadcrumb">
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
              <span>Our Story</span>
            </nav>
            <h1
              className="scroll-reveal"
              style={{ transitionDelay: "80ms" } as React.CSSProperties}
            >
              Our Story
            </h1>
            <p
              className="os-hero-sub scroll-reveal"
              style={{ transitionDelay: "180ms" } as React.CSSProperties}
            >
              We cultivate the emotional language of sound
            </p>
          </div>
        </div>
      </section>

      {/* ── Intro Statement ── */}
      <section className="os-intro">
        <div className="container">
          <p className="os-intro-text scroll-reveal">
            At DreamPlay, we believe every person deserves an instrument that
            responds the way music feels — with nuance, warmth, and depth. From
            our first prototype to the DS&nbsp;6.0, that conviction has never
            changed.
          </p>
        </div>
      </section>

      {/* ── Journey ── */}
      <section className="os-journey">
        <div className="os-journey-heading-wrap container">
          <h2 className="os-section-heading scroll-reveal">Our Journey</h2>
        </div>

        {/* Panel 1 — media left, text right */}
        <div className="os-journey-panel">
          <div className="os-journey-media scroll-reveal--from-left">
            <Image
              src="/assets/dreamplay/pianist_hands.jpg"
              alt="Pianist hands on DreamPlay keys"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="os-journey-text scroll-reveal--from-right">
            <span className="os-eyebrow">The Beginning</span>
            <h3>A question without an answer</h3>
            <p>
              Lionel Yu had been playing piano since age five. By the time he
              was a graduate student in engineering, he was frustrated by a
              simple problem: every digital piano he tried felt like a
              simulation, not an instrument.
            </p>
            <p>
              In 2019, he left his job and started DreamPlay in a rented studio.
              His obsession: build a digital piano that doesn&apos;t apologize
              for not being acoustic — one that earns its place on its own
              terms.
            </p>
          </div>
        </div>

        {/* Panel 2 — text left, media right */}
        <div className="os-journey-panel os-journey-panel--reverse">
          <div className="os-journey-media scroll-reveal--from-right">
            <Image
              src="/assets/dreamplay/keyboard_studio.avif"
              alt="DreamPlay studio recording session"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="os-journey-text scroll-reveal--from-left">
            <span className="os-eyebrow">Our Philosophy</span>
            <h3>Engineering and artistry, unified</h3>
            <p>
              Every DreamPlay instrument is built by a team that includes
              concert pianists alongside acoustic engineers. We don&apos;t ship
              a feature until a performer would choose it.
            </p>
            <p>
              We record our samples on Steinway concert grands in world-class
              studios. We tune our key action through thousands of hours of live
              testing. We refine until the instrument disappears — and all
              that&apos;s left is the music.
            </p>
          </div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="os-values">
        <div className="container">
          <h2 className="os-section-heading scroll-reveal">
            What we stand for
          </h2>
          <div className="os-values-grid">
            <div
              className="os-value-card os-value-card--forest scroll-reveal"
              style={{ transitionDelay: "0ms" } as React.CSSProperties}
            >
              <div className="os-value-card-bg">
                <Image
                  src="/assets/factory-keys.jpg"
                  alt="Innovation"
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="os-value-card-content">
                <h3>Innovation &amp; Technology</h3>
                <p>
                  We push the boundary of what a digital instrument can do — in
                  sound fidelity, touch response, and connectivity — without
                  ever losing sight of the player.
                </p>
              </div>
            </div>

            <div
              className="os-value-card os-value-card--amber scroll-reveal"
              style={{ transitionDelay: "120ms" } as React.CSSProperties}
            >
              <div className="os-value-card-bg">
                <Image
                  src="/assets/dreamplay/starred/gold-ds-6.jpg"
                  alt="Craftsmanship"
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="os-value-card-content">
                <h3>Uncompromising Craft</h3>
                <p>
                  Sustainably sourced wood veneer, brushed metal accents, and
                  hand-finished lacquer. Every surface is deliberate. Every
                  detail is earned.
                </p>
              </div>
            </div>

            <div
              className="os-value-card os-value-card--indigo scroll-reveal"
              style={{ transitionDelay: "240ms" } as React.CSSProperties}
            >
              <div className="os-value-card-bg">
                <Image
                  src="/assets/dreamplay/hand_relaxed.jpg"
                  alt="Accessibility"
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="os-value-card-content">
                <h3>Music for Everyone</h3>
                <p>
                  From the first-time learner to the concert professional,
                  DreamPlay instruments meet you where you are — and grow with
                  you as you evolve.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Founder Quote ── */}
      <section className="os-quote">
        <div className="container">
          <div className="os-quote-inner scroll-reveal">
            <blockquote>
              Sound is the language of emotion. We build the instruments that
              let you speak it fluently — whether you&apos;ve played for forty
              years or forty days.
            </blockquote>
            <footer className="os-quote-attribution">
              <span className="os-quote-name">Lionel Yu</span>
              <span className="os-quote-title">
                Founder &amp; CEO, DreamPlay
              </span>
            </footer>
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="os-timeline">
        <div className="container os-timeline-header">
          <h2 className="os-section-heading os-section-heading--light scroll-reveal">
            How we got here
          </h2>
        </div>
        <div className="os-timeline-track">
          {TIMELINE.map((entry, i) => (
            <article
              key={entry.year}
              className="os-timeline-entry scroll-reveal scroll-reveal--quick"
              style={
                { transitionDelay: `${i * 80}ms` } as React.CSSProperties
              }
            >
              <div className="os-timeline-media">
                <Image
                  src={entry.image}
                  alt={entry.heading}
                  fill
                  sizes="320px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="os-timeline-meta">
                <span className="os-timeline-year">{entry.year}</span>
                <h3 className="os-timeline-milestone">{entry.heading}</h3>
                <p className="os-timeline-body">{entry.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="os-stats">
        <div className="container">
          <div className="os-stats-grid">
            {[
              { number: "2019", label: "Founded" },
              { number: "47", label: "Quality Checks" },
              { number: "250+", label: "Artists & Educators" },
              { number: "5yr", label: "Warranty" },
            ].map((s, i) => (
              <div
                key={s.label}
                className="os-stat scroll-reveal scroll-reveal--quick"
                style={
                  { transitionDelay: `${i * 100}ms` } as React.CSSProperties
                }
              >
                <span className="os-stat-number">{s.number}</span>
                <span className="os-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section className="os-cta">
        <div className="os-cta-bg">
          <Image
            src="/assets/dreamplay/starred/gold-ds-6.0-full.png"
            alt="DreamPlay Gold DS 6.0"
            fill
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center 30%" }}
          />
        </div>
        <div className="os-cta-overlay">
          <div className="container os-cta-inner">
            <h2
              className="scroll-reveal"
              style={{ transitionDelay: "0ms" } as React.CSSProperties}
            >
              Ready to play?
            </h2>
            <p
              className="os-cta-sub scroll-reveal"
              style={{ transitionDelay: "100ms" } as React.CSSProperties}
            >
              Discover an instrument built for every stage of your musical
              journey.
            </p>
            <Link
              href="/shop"
              className="os-cta-btn scroll-reveal"
              style={{ transitionDelay: "200ms" } as React.CSSProperties}
            >
              Shop the Collection
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </>
  );
}
