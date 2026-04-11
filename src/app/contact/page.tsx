"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

/* ── Scroll-reveal hook ── */

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
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    const fallbackTimer = window.setTimeout(revealAll, 1200);

    requestAnimationFrame(() => {
      document
        .querySelectorAll(
          ".scroll-reveal, .scroll-reveal--from-left, .scroll-reveal--from-right"
        )
        .forEach((el) => {
          const rect = (el as HTMLElement).getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.92) {
            el.classList.add("revealed");
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

/* ── Subject options ── */

const SUBJECT_OPTIONS = [
  "Product Consultation",
  "Order Support",
  "Showroom Visit",
  "Press",
  "Other",
];

/* ── Contact info card data ── */

const CONTACT_CARDS = [
  {
    icon: "location",
    title: "Address",
    lines: ["DreamPlay Showroom", "1825 Market Street", "San Francisco, CA 94103"],
  },
  {
    icon: "email",
    title: "Email",
    lines: ["support@dreamplay.com", "concierge@dreamplay.com"],
    links: [
      { href: "mailto:support@dreamplay.com", label: "support@dreamplay.com" },
      { href: "mailto:concierge@dreamplay.com", label: "concierge@dreamplay.com" },
    ],
  },
  {
    icon: "phone",
    title: "Phone",
    lines: ["+1 (415) 820-0180", "Mon \u2013 Fri: 9:00 \u2013 18:00"],
    links: [
      { href: "tel:+14158200180", label: "+1 (415) 820-0180" },
    ],
  },
  {
    icon: "social",
    title: "Follow Us",
    socials: [
      { label: "Facebook", href: "#" },
      { label: "Instagram", href: "#" },
      { label: "YouTube", href: "#" },
      { label: "X", href: "#" },
    ],
  },
];

/* ── Icon components ── */

function LocationIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 4l-10 8L2 4" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

function SocialIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function getCardIcon(icon: string) {
  switch (icon) {
    case "location": return <LocationIcon />;
    case "email": return <EmailIcon />;
    case "phone": return <PhoneIcon />;
    case "social": return <SocialIcon />;
    default: return null;
  }
}

/* ── Page ── */

export default function ContactPage() {
  useScrollReveal();

  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <>
      <AnnouncementBar />
      <Header cartCount={0} />

      {/* ── Hero ── */}
      <section className="contact-hero">
        <div className="container">
          <nav className="contact-breadcrumb scroll-reveal" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
              <path d="M1 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Contact</span>
          </nav>
          <h1 className="scroll-reveal">Contact Us</h1>
          <p className="contact-hero-sub scroll-reveal">
            We&rsquo;d love to hear from you. Whether you&rsquo;re choosing your first
            instrument, booking a showroom visit, or need post-purchase support,
            our team is here to help.
          </p>
        </div>
      </section>

      {/* ── Body: form + map ── */}
      <section className="contact-body">
        <div className="container">
          <div className="contact-grid">
            {/* Left: form */}
            <div className="contact-form-col scroll-reveal--from-left">
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="contact-form-row">
                  <div className="contact-field">
                    <label htmlFor="contact-name">Name</label>
                    <input id="contact-name" type="text" placeholder="Your name" required />
                  </div>
                  <div className="contact-field">
                    <label htmlFor="contact-email">Email</label>
                    <input id="contact-email" type="email" placeholder="you@example.com" required />
                  </div>
                </div>
                <div className="contact-form-row">
                  <div className="contact-field">
                    <label htmlFor="contact-phone">Phone number</label>
                    <input id="contact-phone" type="tel" placeholder="+1 (___) ___-____" />
                  </div>
                  <div className="contact-field">
                    <label htmlFor="contact-subject">Subject</label>
                    <select id="contact-subject" required defaultValue="">
                      <option value="" disabled>Select a subject</option>
                      {SUBJECT_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="contact-field contact-field--full">
                  <label htmlFor="contact-message">Message</label>
                  <textarea id="contact-message" placeholder="How can we help?" rows={6} required />
                </div>
                <button type="submit" className="contact-submit-btn" disabled={submitted}>
                  {submitted ? "Message Sent" : "Send Message"}
                </button>
              </form>
            </div>

            {/* Right: map */}
            <div className="contact-map-col scroll-reveal--from-right">
              <div className="contact-map-wrapper">
                <iframe
                  className="contact-map-iframe"
                  title="DreamPlay Showroom Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.5!2d-122.4194!3d37.7749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ2JzI5LjYiTiAxMjLCsDI1JzA5LjgiVw!5e0!3m2!1sen!2sus!4v1700000000000"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen={false}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact info cards ── */}
      <section className="contact-info">
        <div className="container">
          <div className="contact-info-grid">
            {CONTACT_CARDS.map((card, i) => (
              <div
                key={card.title}
                className="contact-info-card scroll-reveal"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="contact-info-icon">{getCardIcon(card.icon)}</div>
                <h3 className="contact-info-title">{card.title}</h3>
                {card.links ? (
                  <div className="contact-info-lines">
                    {card.lines!.map((line, j) => {
                      const link = card.links![j];
                      return link ? (
                        <a key={j} href={link.href} className="contact-info-link">
                          {link.label}
                        </a>
                      ) : (
                        <span key={j}>{line}</span>
                      );
                    })}
                  </div>
                ) : card.socials ? (
                  <div className="contact-info-socials">
                    {card.socials.map((s) => (
                      <a key={s.label} href={s.href} className="contact-info-social-link">
                        {s.label}
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="contact-info-lines">
                    {card.lines!.map((line, j) => (
                      <span key={j}>{line}</span>
                    ))}
                  </div>
                )}
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
