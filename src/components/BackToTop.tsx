"use client";

import { useState, useEffect, useCallback } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  const handleScroll = useCallback(() => {
    setVisible(window.scrollY > 600);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <button
      className={`back-to-top${visible ? " visible" : ""}`}
      id="backToTop"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      &uarr;
    </button>
  );
}
