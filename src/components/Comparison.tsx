"use client";

import { useRef, useCallback, useEffect } from "react";

export default function Comparison() {
  const compRef = useRef<HTMLElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const setPosition = useCallback((x: number) => {
    const comp = compRef.current;
    const handle = handleRef.current;
    if (!comp || !handle) return;
    const rect = comp.getBoundingClientRect();
    let pos = ((x - rect.left) / rect.width) * 100;
    pos = Math.max(5, Math.min(95, pos));
    handle.style.left = pos + "%";
    const afterEl = comp.querySelector(".after") as HTMLElement;
    const beforeEl = comp.querySelector(".before") as HTMLElement;
    if (afterEl) afterEl.style.clipPath = `inset(0 ${100 - pos}% 0 0)`;
    if (beforeEl) beforeEl.style.clipPath = `inset(0 0 0 ${pos}%)`;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) setPosition(e.clientX);
    };
    const handleMouseUp = () => {
      isDragging.current = false;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging.current) setPosition(e.touches[0].clientX);
    };
    const handleTouchEnd = () => {
      isDragging.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [setPosition]);

  return (
    <section
      className="comparison"
      id="comparison"
      ref={compRef}
      onMouseDown={(e) => {
        isDragging.current = true;
        setPosition(e.clientX);
      }}
      onTouchStart={(e) => {
        isDragging.current = true;
        setPosition(e.touches[0].clientX);
      }}
    >
      <div className="comparison-img after">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://picsum.photos/seed/compgold/1600/800"
          alt="Gold Headphones"
        />
      </div>
      <div className="comparison-img before">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://picsum.photos/seed/compred/1600/800"
          alt="Crimson Headphones"
        />
      </div>
      <div className="comparison-handle" id="compHandle" ref={handleRef}>
        <div className="comparison-handle-circle">&#9666; &#9656;</div>
      </div>
      <span className="comparison-label left">Classic Gold</span>
      <span className="comparison-label right">Crimson Edition</span>
    </section>
  );
}
