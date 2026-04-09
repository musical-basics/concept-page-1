"use client";

import { useState, useRef, useCallback } from "react";

const productImages = [
  "https://picsum.photos/seed/prod1/800/800",
  "https://picsum.photos/seed/prod2/800/800",
  "https://picsum.photos/seed/prod3/800/800",
  "https://picsum.photos/seed/prod4/800/800",
  "https://picsum.photos/seed/prod5/800/800",
  "https://picsum.photos/seed/prod6/800/800",
];

const thumbImages = [
  "https://picsum.photos/seed/prod1/200/200",
  "https://picsum.photos/seed/prod2/200/200",
  "https://picsum.photos/seed/prod3/200/200",
  "https://picsum.photos/seed/prod4/200/200",
  "https://picsum.photos/seed/prod5/200/200",
  "https://picsum.photos/seed/prod6/200/200",
];

const colorSwatches = [
  { name: "Midnight Black", color: "#1a1a1a", seed: "prodblack" },
  { name: "Arctic White", color: "#f0f0f0", seed: "prodwhite" },
  { name: "Navy Blue", color: "#2c3e6b", seed: "prodblue" },
  { name: "Rose Gold", color: "#c9a96e", seed: "prodrose" },
  { name: "Crimson Red", color: "#8b2500", seed: "prodred" },
];

export default function FeaturedProduct({
  onAddToCart,
}: {
  onAddToCart: () => void;
}) {
  const [activeThumb, setActiveThumb] = useState(0);
  const [mainSrc, setMainSrc] = useState(productImages[0]);
  const [activeColor, setActiveColor] = useState(0);
  const [colorName, setColorName] = useState("Midnight Black");
  const mainImageRef = useRef<HTMLDivElement>(null);

  const switchImage = useCallback((idx: number) => {
    setActiveThumb(idx);
    setMainSrc(productImages[idx]);
  }, []);

  const selectColor = useCallback((idx: number) => {
    setActiveColor(idx);
    setColorName(colorSwatches[idx].name);
    setMainSrc(`https://picsum.photos/seed/${colorSwatches[idx].seed}/800/800`);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const container = mainImageRef.current;
      if (!container) return;
      const img = container.querySelector("img") as HTMLImageElement;
      if (!img) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      img.style.transformOrigin = `${x}% ${y}%`;
    },
    []
  );

  return (
    <section className="featured-product" id="featured">
      <div className="container">
        <div className="product-gallery">
          <div className="thumbnail-strip" id="thumbnails">
            {thumbImages.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt={`Thumb ${i + 1}`}
                className={i === activeThumb ? "active" : ""}
                onClick={() => switchImage(i)}
              />
            ))}
          </div>
          <div
            className="main-image"
            id="mainImage"
            ref={mainImageRef}
            onMouseMove={handleMouseMove}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mainSrc} alt="Main Product" />
          </div>
        </div>
        <div className="product-info">
          <h2>Harmony Elite Pro</h2>
          <div className="product-price">
            <span className="current">$99</span>
            <span className="original">$299</span>
            <span className="badge">Save 67%</span>
          </div>
          <div className="star-rating">
            &#9733;&#9733;&#9733;&#9733;&#9733; <span>(128 reviews)</span>
          </div>
          <p className="product-desc">
            Experience unparalleled audio quality with the Harmony Elite Pro.
            Featuring 40mm custom drivers, active noise cancellation, and 60-hour
            battery life. Crafted with premium materials for all-day comfort.
          </p>
          <div className="color-swatches">
            <p>
              Color: <span id="colorName">{colorName}</span>
            </p>
            <div className="swatches">
              {colorSwatches.map((swatch, i) => (
                <div
                  key={swatch.seed}
                  className={`swatch${i === activeColor ? " active" : ""}`}
                  onClick={() => selectColor(i)}
                  title={swatch.name}
                >
                  <div
                    className="swatch-inner"
                    style={{ background: swatch.color }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="stock-warning">Only 3 left in stock — order soon</div>
          <button className="add-to-cart-btn" onClick={onAddToCart}>
            Add to Cart — $99
          </button>
          <div className="trust-icons">
            <div className="trust-icon">
              <span className="icon">&#128666;</span>Free Shipping
            </div>
            <div className="trust-icon">
              <span className="icon">&larr;</span>30-Day Returns
            </div>
            <div className="trust-icon">
              <span className="icon">&#128274;</span>Secure Checkout
            </div>
            <div className="trust-icon">
              <span className="icon">&#10003;</span>2-Year Warranty
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
