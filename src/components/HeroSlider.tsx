"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const slides = [
  {
    img: "https://picsum.photos/seed/hero1/1600/900",
    alt: "Hero 1",
    heading: "Redefine Your<br>Sound Experience",
    cta: "Shop Now",
  },
  {
    img: "https://picsum.photos/seed/hero2/1600/900",
    alt: "Hero 2",
    heading: "Premium Audio<br>Craftsmanship",
    cta: "Explore Collection",
  },
  {
    img: "https://picsum.photos/seed/hero3/1600/900",
    alt: "Hero 3",
    heading: "Sound That<br>Moves You",
    cta: "Discover More",
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goToSlide = useCallback((n: number) => {
    setCurrentSlide(n);
  }, []);

  const changeSlide = useCallback(
    (dir: number) => {
      setCurrentSlide((prev) => (prev + dir + slides.length) % slides.length);
    },
    []
  );

  const resetTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!paused) {
      intervalRef.current = setInterval(() => changeSlide(1), 5000);
    }
  }, [paused, changeSlide]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [resetTimer]);

  const togglePause = () => {
    setPaused((prev) => !prev);
  };

  return (
    <section className="hero" id="hero">
      {slides.map((slide, i) => (
        <div key={i} className={`hero-slide${i === currentSlide ? " active" : ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={slide.img} alt={slide.alt} />
          <div className="hero-overlay">
            {i === currentSlide && (
              <div key={currentSlide} className="hero-slide-text">
                <h1 dangerouslySetInnerHTML={{ __html: slide.heading }} />
                <a href="#" className="hero-cta">
                  {slide.cta}
                </a>
              </div>
            )}
          </div>
        </div>
      ))}
      <div className="hero-arrows">
        <button
          onClick={() => {
            changeSlide(-1);
            resetTimer();
          }}
        >
          &#8249;
        </button>
        <button
          onClick={() => {
            changeSlide(1);
            resetTimer();
          }}
        >
          &#8250;
        </button>
      </div>
      <div className="hero-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={i === currentSlide ? "active" : ""}
            onClick={() => {
              goToSlide(i);
              resetTimer();
            }}
          />
        ))}
      </div>
      <button className="hero-pause" onClick={togglePause}>
        {paused ? "\u25B6" : "\u23F8"}
      </button>
    </section>
  );
}
