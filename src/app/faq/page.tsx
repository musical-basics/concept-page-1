"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
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

type FaqItem = { q: string; a: string };
type FaqCategory = { id: string; label: string; items: FaqItem[] };

const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "shipping",
    label: "Shipping & Delivery",
    items: [
      {
        q: "Do you offer international shipping?",
        a: "Yes. DreamPlay ships to over 40 countries worldwide. International orders are fulfilled from our San Francisco warehouse and typically arrive within 10–18 business days depending on destination. Duties and import taxes are the responsibility of the recipient.",
      },
      {
        q: "How quickly will my order ship?",
        a: "In-stock instruments are prepared and dispatched within 2–3 business days. You will receive a shipment confirmation email with full tracking information as soon as your order leaves our facility.",
      },
      {
        q: "What are the estimated delivery timeframes?",
        a: "Domestic (United States): 3–7 business days. Canada: 6–10 business days. Europe: 8–14 business days. Rest of world: 10–18 business days. Expedited options are available at checkout.",
      },
      {
        q: "Can I track my shipment?",
        a: "Yes. Once your order ships, you will receive a tracking number by email. You can also log into your DreamPlay account at any time to view the current status of all past and pending orders.",
      },
    ],
  },
  {
    id: "orders",
    label: "Orders & Returns",
    items: [
      {
        q: "How do I place an order?",
        a: "Browse our collection at dreamplay.com/shop, select your instrument and preferred finish, then proceed through checkout. We accept all major credit cards, PayPal, and installment financing through Affirm.",
      },
      {
        q: "What is your return policy?",
        a: "We stand behind every instrument with a 30-day satisfaction guarantee. If you are not completely happy, contact our support team within 30 days of delivery. The instrument must be returned in its original packaging in like-new condition. Return shipping is covered by DreamPlay for all domestic orders.",
      },
      {
        q: "Can I change my shipping address after ordering?",
        a: "Address changes can be made within 24 hours of placing your order, provided it has not yet been dispatched. Contact support@dreamplay.com immediately with your order number and the corrected delivery address.",
      },
      {
        q: "How do I cancel or modify an order?",
        a: "Orders can be cancelled or modified within 24 hours of purchase. Once an instrument has entered the dispatch process, changes are no longer possible. For urgent requests, email support@dreamplay.com or call +1\u00a0(415)\u00a0820-0180 during business hours.",
      },
    ],
  },
  {
    id: "products",
    label: "Instruments & Products",
    items: [
      {
        q: "What key action does the DS\u00a06.0 use?",
        a: "The DS\u00a06.0 features DreamPlay's proprietary Weighted Gradient Action (WGA-III) — 88 fully-weighted keys with escapement simulation and four-sensor detection per key. Key weight is graded from heavier bass to lighter treble, precisely replicating the feel of a Steinway Model\u00a0B concert grand.",
      },
      {
        q: "Is DreamPlay suitable for beginner pianists?",
        a: "Absolutely. Our product line spans beginner to concert professional. The DreamPlay S1 is purpose-built for learners, with built-in lesson content, a simplified companion app, and an accessible price point. Every DreamPlay instrument uses professional-grade key action that grows with your technique.",
      },
      {
        q: "What does the DreamPlay warranty cover?",
        a: "All DreamPlay instruments ship with a 5-Year Comprehensive Warranty covering parts, labor, and in-home service visits for manufacturing defects. The warranty applies to the original purchaser and is non-transferable. Extended warranty packages are available at checkout.",
      },
      {
        q: "Can I try an instrument before purchasing?",
        a: "Yes. DreamPlay instruments are available to play at our San Francisco showroom and at select authorized dealers nationwide. We also offer a 14-day in-home trial for customers within the contiguous United States — delivery and pickup are fully included.",
      },
      {
        q: "Do you offer gift cards or gift packaging?",
        a: "Yes. DreamPlay gift cards are available in denominations from $100 to $5,000 and never expire. At checkout you can also add a personal gift message and request that pricing information be omitted from the packaging.",
      },
    ],
  },
];

/* ── Page ── */

export default function FAQPage() {
  useScrollReveal();
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <AnnouncementBar />
      <Header cartCount={0} />

      {/* ── Hero ── */}
      <section className="faq-hero">
        <div className="container">
          <nav
            className="os-breadcrumb faq-breadcrumb scroll-reveal"
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
            <span>FAQ</span>
          </nav>
          <h1
            className="scroll-reveal"
            style={{ transitionDelay: "60ms" } as React.CSSProperties}
          >
            FAQ
          </h1>
          <div
            className="faq-hero-rule scroll-reveal"
            style={{ transitionDelay: "120ms" } as React.CSSProperties}
          />
          <p
            className="faq-hero-sub scroll-reveal"
            style={{ transitionDelay: "180ms" } as React.CSSProperties}
          >
            Everything you need to know about DreamPlay instruments, orders,
            and&nbsp;support
          </p>
        </div>
      </section>

      {/* ── Two-column body ── */}
      <section className="faq-body">
        <div className="container faq-body-container">

          {/* Left column: accordion categories */}
          <div className="faq-main">
            {FAQ_CATEGORIES.map((cat, ci) => (
              <div
                key={cat.id}
                className="faq-category scroll-reveal"
                style={
                  { transitionDelay: `${ci * 80}ms` } as React.CSSProperties
                }
              >
                <h2 className="faq-category-heading">{cat.label}</h2>
                <div className="faq-list" role="list">
                  {cat.items.map((item, i) => {
                    const itemId = `${cat.id}-${i}`;
                    const isOpen = openId === itemId;
                    return (
                      <div
                        key={itemId}
                        className={`faq-item${isOpen ? " faq-item--open" : ""}`}
                        role="listitem"
                      >
                        <button
                          className="faq-question"
                          onClick={() => toggle(itemId)}
                          aria-expanded={isOpen}
                          aria-controls={`faq-answer-${itemId}`}
                        >
                          <span>{item.q}</span>
                          <svg
                            className="faq-chevron"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            aria-hidden="true"
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </button>
                        <div
                          id={`faq-answer-${itemId}`}
                          className="faq-answer"
                          aria-hidden={!isOpen}
                        >
                          <div className="faq-answer-inner">
                            <p>{item.a}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Right column: help sidebar */}
          <aside className="faq-sidebar">
            <div className="faq-help-box scroll-reveal">
              <h2 className="faq-help-heading">Didn&apos;t find your answer?</h2>
              <p className="faq-help-sub">
                Don&apos;t hesitate to contact us.
              </p>
              <form
                className="faq-help-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  window.location.href = "/contact";
                }}
              >
                <input
                  className="faq-help-input"
                  type="text"
                  name="name"
                  placeholder="Name"
                  autoComplete="name"
                />
                <input
                  className="faq-help-input"
                  type="email"
                  name="email"
                  placeholder="Email"
                  autoComplete="email"
                />
                <textarea
                  className="faq-help-textarea"
                  name="message"
                  placeholder="Message"
                  rows={4}
                />
                <button type="submit" className="faq-help-btn">
                  Send message
                </button>
              </form>
            </div>
          </aside>

        </div>
      </section>

      <Footer />
      <BackToTop />
    </>
  );
}
