"use client";

import { useState, useEffect, useCallback } from "react";

export default function NewsletterPopup() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== "undefined" && !sessionStorage.getItem("popupDismissed")) {
        setActive(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const closePopup = useCallback(() => {
    setActive(false);
    sessionStorage.setItem("popupDismissed", "true");
  }, []);

  return (
    <div
      className={`newsletter-popup${active ? " active" : ""}`}
      id="newsletterPopup"
      onClick={(e) => {
        if (e.target === e.currentTarget) closePopup();
      }}
    >
      <div className="popup-content">
        <span className="popup-close" onClick={closePopup}>
          &#10005;
        </span>
        <h3>Stay in the Loop</h3>
        <p>
          Subscribe for 15% off your first order plus early access to new
          releases.
        </p>
        <form
          className="popup-form"
          onSubmit={(e) => {
            e.preventDefault();
            closePopup();
            alert("Welcome! Check your inbox for your discount code.");
          }}
        >
          <input type="email" placeholder="Enter your email" required />
          <button type="submit">Subscribe</button>
        </form>
      </div>
    </div>
  );
}
