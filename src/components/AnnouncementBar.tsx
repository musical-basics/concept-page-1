"use client";

import { useState, useEffect, useCallback } from "react";

const promos = [
  "Save up to 60% with code BLACKFRIDAY",
  "Free shipping on all orders over $75",
  "New arrivals — Shop the latest collection",
];

export default function AnnouncementBar() {
  const [promoIndex, setPromoIndex] = useState(0);
  const [hidden, setHidden] = useState(false);

  const changePromo = useCallback((dir: number) => {
    setPromoIndex((prev) => (prev + dir + promos.length) % promos.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => changePromo(1), 4000);
    return () => clearInterval(interval);
  }, [changePromo]);

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`announcement-bar${hidden ? " hidden-up" : ""}`}>
      <div className="container">
        <div className="announcement-social">
          <a href="#">FB</a>
          <a href="#">X</a>
          <a href="#">IG</a>
          <a href="#">YT</a>
        </div>
        <div className="announcement-promo">
          <button className="promo-prev" onClick={() => changePromo(-1)}>
            &#8249;
          </button>
          <span className="promo-text">{promos[promoIndex]}</span>
          <button className="promo-next" onClick={() => changePromo(1)}>
            &#8250;
          </button>
        </div>
        <div className="announcement-options">
          <select>
            <option>English</option>
            <option>French</option>
            <option>German</option>
          </select>
          <select>
            <option>USD $</option>
            <option>EUR €</option>
            <option>GBP £</option>
          </select>
        </div>
      </div>
    </div>
  );
}
