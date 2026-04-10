"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

// ─── Scroll-reveal ───────────────────────────────────────────────────────────

function useScrollReveal() {
  const observerRef = useRef<IntersectionObserver | null>(null);

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
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
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
}

// ─── Data ────────────────────────────────────────────────────────────────────

type Category =
  | "All"
  | "Practice & Technique"
  | "Instrument Care"
  | "News & Events"
  | "Artist Stories";

interface Article {
  slug: string;
  category: Exclude<Category, "All">;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
}

const ARTICLES: Article[] = [
  {
    slug: "ds60-grand-feel",
    category: "News & Events",
    title: "The Perfect Grand: What Makes the DS 6.0 Feel Like an Acoustic",
    excerpt:
      "From graded hammer action to the resonance chamber beneath the keys, every detail in the DS 6.0 is engineered to disappear — leaving only music.",
    date: "April 3, 2026",
    readTime: "7 min read",
    image: "/assets/dreamplay/keyboard_studio.avif",
    featured: true,
  },
  {
    slug: "carol-leone-practice-diary",
    category: "Artist Stories",
    title: "Carol Leone on Practice Routines and the Art of Listening",
    excerpt:
      "The DreamPlay ambassador and concert pianist shares how deliberate listening — not just playing — transforms technique.",
    date: "March 28, 2026",
    readTime: "5 min read",
    image: "/assets/dreamplay/carol_leone.png",
  },
  {
    slug: "graded-hammer-explained",
    category: "Practice & Technique",
    title: "Graded Hammer Action: Why Key Weight Transforms Your Playing",
    excerpt:
      "Light at the top, heavy at the bottom — and every shade between. Here's why the weight gradient of the DS 6.0 matters from your first lesson onward.",
    date: "March 20, 2026",
    readTime: "6 min read",
    image: "/assets/dreamplay/pianist_hands.jpg",
  },
  {
    slug: "ds55-white-introduction",
    category: "News & Events",
    title: "Introducing the DS 5.5 White: A Quieter Voice for the Collection",
    excerpt:
      "Matte lacquer, ivory-weighted keys, and a softer tonal profile. The DS 5.5 White is DreamPlay's answer to the home studio.",
    date: "March 14, 2026",
    readTime: "4 min read",
    image: "/assets/dreamplay/ds55_white.png",
  },
  {
    slug: "five-warmup-exercises",
    category: "Practice & Technique",
    title: "5 Warm-Up Exercises Every Pianist Should Know",
    excerpt:
      "Before scales, before repertoire — give your fingers and wrists what they need. These five exercises take under ten minutes and change how you play.",
    date: "March 8, 2026",
    readTime: "5 min read",
    image: "/assets/pianist-hands.jpg",
  },
  {
    slug: "caring-for-your-digital-piano",
    category: "Instrument Care",
    title: "How to Care for Your Digital Piano in Any Climate",
    excerpt:
      "Humidity, dust, and direct sunlight are the quiet enemies of any instrument. A few simple habits will keep your DreamPlay performing for decades.",
    date: "February 28, 2026",
    readTime: "4 min read",
    image: "/assets/factory-keys.jpg",
  },
  {
    slug: "midi-ds60-guide",
    category: "Practice & Technique",
    title: "The MIDI Connection: Unlocking the DS 6.0's Full Potential",
    excerpt:
      "Recording DAW sessions, composing with notation software, or running a live rig — the DS 6.0's MIDI implementation covers all of it without compromise.",
    date: "February 19, 2026",
    readTime: "8 min read",
    image: "/assets/midi-app.png",
  },
  {
    slug: "lionel-performance-diary",
    category: "Artist Stories",
    title: "Lionel on Stage: A Performance Diary",
    excerpt:
      "Three cities, five recitals, one DS 6.0. DreamPlay founder Lionel Yu writes about what it means to bring a digital instrument to a classical stage.",
    date: "February 10, 2026",
    readTime: "9 min read",
    image: "/assets/dreamplay/lionel_performance.png",
  },
  {
    slug: "sustain-pedal-guide",
    category: "Practice & Technique",
    title: "The Sustain Pedal Is the Most Underrated Element of Piano Technique",
    excerpt:
      "Half-pedaling, flutter pedaling, pedal changes in legato lines — most players engage the sustain pedal on instinct. There is a better way.",
    date: "January 30, 2026",
    readTime: "6 min read",
    image: "/assets/hero-piano.avif",
  },
  {
    slug: "key-cleaning-guide",
    category: "Instrument Care",
    title: "Keeping the Ivory White: A Key-Cleaning Guide for DS Owners",
    excerpt:
      "Matte textured keys pick up oils and debris faster than polished surfaces. Here is the safest cleaning method that will not dull the finish.",
    date: "January 22, 2026",
    readTime: "3 min read",
    image: "/assets/keyboard-led.jpg",
  },
];

const CATEGORIES: Category[] = [
  "All",
  "Practice & Technique",
  "Instrument Care",
  "News & Events",
  "Artist Stories",
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function JournalPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [cartCount] = useState(0);

  useScrollReveal();

  const handleCategoryChange = useCallback((cat: Category) => {
    setActiveCategory(cat);
  }, []);

  const filtered = ARTICLES.filter(
    (a) => activeCategory === "All" || a.category === activeCategory
  );

  const featured = filtered.find((a) => a.featured) ?? filtered[0] ?? null;
  const grid = filtered.filter((a) => a !== featured);

  return (
    <>
      <AnnouncementBar />
      <Header cartCount={cartCount} />

      {/* ── Page hero ── */}
      <section className="journal-hero scroll-reveal">
        <div className="container">
          <h1>Journal</h1>
          <div className="journal-hero-rule" />
          <p className="journal-hero-sub">
            Technique · Craft · Stories from the Keys
          </p>
        </div>
      </section>

      {/* ── Category filters ── */}
      <nav className="journal-filters" aria-label="Journal categories">
        <div className="container">
          <div className="journal-filters-inner">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`journal-filter-btn${activeCategory === cat ? " active" : ""}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ── Main content ── */}
      <main className="journal-main">
        <div className="container">

          {/* Featured article */}
          {featured && (
            <div className="journal-featured scroll-reveal">
              <Link href={`/journal/${featured.slug}`} style={{ textDecoration: "none" }}>
                <article className="journal-featured-card">
                  <div className="journal-featured-img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={featured.image} alt={featured.title} />
                  </div>
                  <div className="journal-featured-body">
                    <div className="journal-featured-eyebrow">
                      <span className="journal-tag">{featured.category}</span>
                      <span className="journal-featured-label">
                        Featured Article
                      </span>
                    </div>
                    <h2>{featured.title}</h2>
                    <p className="journal-excerpt">{featured.excerpt}</p>
                    <p className="journal-featured-meta">
                      {featured.date}&nbsp;&middot;&nbsp;{featured.readTime}
                    </p>
                    <span className="journal-read-more">
                      Read Article &rarr;
                    </span>
                  </div>
                </article>
              </Link>
            </div>
          )}

          {/* Grid */}
          {grid.length > 0 && (
            <>
              <p className="journal-section-label scroll-reveal">
                {activeCategory === "All"
                  ? "Latest Articles"
                  : activeCategory}
              </p>
              <div className="journal-grid">
                {grid.map((article, i) => (
                  <Link
                    key={article.slug}
                    href={`/journal/${article.slug}`}
                    style={{ textDecoration: "none" }}
                  >
                    <article
                      className="journal-card scroll-reveal"
                      style={{ transitionDelay: `${(i % 3) * 60}ms` }}
                    >
                      <div className="journal-card-img">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={article.image} alt={article.title} />
                      </div>
                      <div className="journal-card-body">
                        <span className="journal-tag">{article.category}</span>
                        <h3>{article.title}</h3>
                        <p className="journal-excerpt">{article.excerpt}</p>
                        <p className="journal-meta">
                          {article.date}&nbsp;&middot;&nbsp;{article.readTime}
                        </p>
                        <span className="journal-read-more">
                          Read More &rarr;
                        </span>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </>
          )}

          {filtered.length === 0 && (
            <p
              style={{
                textAlign: "center",
                color: "var(--gray)",
                padding: "80px 0",
                fontSize: "14px",
                letterSpacing: "1px",
              }}
            >
              No articles in this category yet.
            </p>
          )}

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className="journal-pagination scroll-reveal">
              <button className="journal-page-btn prev-next" disabled>
                &larr; Prev
              </button>
              <button className="journal-page-btn active">1</button>
              <button className="journal-page-btn">2</button>
              <button className="journal-page-btn prev-next">
                Next &rarr;
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <BackToTop />
    </>
  );
}
