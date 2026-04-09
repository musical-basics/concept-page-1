"use client";

import { useState, useEffect, useRef } from "react";

export default function CountdownTimer({
  onAddToCart,
}: {
  onAddToCart: () => void;
}) {
  const endRef = useRef(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000));
  const [time, setTime] = useState({ d: "00", h: "00", m: "00", s: "00" });

  useEffect(() => {
    const update = () => {
      let diff = endRef.current.getTime() - Date.now();
      if (diff < 0) diff = 0;
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTime({
        d: String(d).padStart(2, "0"),
        h: String(h).padStart(2, "0"),
        m: String(m).padStart(2, "0"),
        s: String(s).padStart(2, "0"),
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="countdown-section">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://picsum.photos/seed/countdown/1600/900"
        alt="Countdown BG"
      />
      <div className="countdown-overlay">
        <h2>Limited Time Offer</h2>
        <p className="promo-sub">Up to 50% off premium collection</p>
        <div className="countdown-timer">
          <div className="countdown-unit">
            <div className="number">{time.d}</div>
            <div className="label">Days</div>
          </div>
          <span className="countdown-separator">:</span>
          <div className="countdown-unit">
            <div className="number">{time.h}</div>
            <div className="label">Hours</div>
          </div>
          <span className="countdown-separator">:</span>
          <div className="countdown-unit">
            <div className="number">{time.m}</div>
            <div className="label">Minutes</div>
          </div>
          <span className="countdown-separator">:</span>
          <div className="countdown-unit">
            <div className="number">{time.s}</div>
            <div className="label">Seconds</div>
          </div>
        </div>
        <button className="countdown-cta" onClick={onAddToCart}>
          Shop the Sale
        </button>
      </div>
    </section>
  );
}
