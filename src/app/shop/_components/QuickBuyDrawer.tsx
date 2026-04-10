"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { Product } from "../_lib/shop-types";

/** Generate a deterministic variant image URL by appending color index to the seed */
function variantImage(baseUrl: string, colorIndex: number): string {
  if (colorIndex === 0) return baseUrl;
  return baseUrl.replace(/\/seed\/([^/]+)\//, `/seed/$1-v${colorIndex}/`);
}

export function QuickBuyDrawer({
  product,
  open,
  onClose,
  onAddToCart,
}: {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onAddToCart: () => void;
}) {
  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);

  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEsc);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open, handleEsc]);

  const imageSrc = useMemo(
    () => (product ? variantImage(product.image, selectedColor) : ""),
    [product, selectedColor]
  );

  if (!product) return null;

  return (
    <>
      <div
        className={`qb-overlay${open ? " active" : ""}`}
        onClick={onClose}
      />
      <aside className={`qb-drawer${open ? " active" : ""}`}>
        <button className="qb-close" onClick={onClose} aria-label="Close drawer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
        <div className="qb-inner">
          <div className="qb-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageSrc} alt={product.name} className="qb-img" />
            {product.badge && (
              <span className={`product-badge ${product.badge === "lionels-pick" ? "lionels-pick" : product.badge === "sale" ? "sale" : "new-badge"}`}>
                {product.badge === "lionels-pick" ? "Lionel\u2019s Pick" : product.badge === "sale" ? "Sale" : "New"}
              </span>
            )}
          </div>
          <div className="qb-details">
            <p className="qb-vendor">DREAMPLAY</p>
            <h3>{product.name}</h3>
            <p className="qb-price">
              {product.comparePrice && (
                <s>${product.comparePrice.toLocaleString()}</s>
              )}
              <span className={product.comparePrice ? " sale-price" : ""}>
                ${product.price.toLocaleString()}
              </span>
            </p>
            {product.colors.length > 0 && (
              <div className="qb-color-section">
                <p className="qb-color-label">Color</p>
                <div className="qb-swatches">
                  {product.colors.map((color, i) => (
                    <button
                      key={i}
                      className={`qb-swatch${selectedColor === i ? " active" : ""}`}
                      style={{ background: color }}
                      onClick={() => setSelectedColor(i)}
                      aria-label={`Color ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
            {product.stock <= 3 && (
              <p className="qb-stock-alert">
                Only {product.stock} left in stock
              </p>
            )}
            <div className="qb-qty">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}>
                &minus;
              </button>
              <span>{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
              >
                +
              </button>
            </div>
            <button
              className="qb-add-btn"
              onClick={() => {
                for (let i = 0; i < qty; i++) onAddToCart();
                onClose();
              }}
            >
              Add to Cart &mdash; ${(product.price * qty).toLocaleString()}
            </button>
            <a href="#" className="qb-view-full">View full details</a>
          </div>
        </div>
      </aside>
    </>
  );
}
