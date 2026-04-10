"use client";

import { useMemo, useState } from "react";
import type { Product } from "../_lib/shop-types";
import { EyeIcon } from "./icons";

interface ProductCardProps {
  product: Product;
  activeColorIndex: number;
  onColorChange: (productId: number, colorIndex: number) => void;
  onQuickView: (product: Product) => void;
}

const COLOR_LABELS: Record<string, string> = {
  "#1a1a1a": "Ebony",
  "#f5f0e8": "White",
  "#6b4226": "Walnut",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="shop-card-rating" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill={i < rating ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  );
}

/** Generate a deterministic variant image URL by appending color index to the seed */
function variantImage(baseUrl: string, colorIndex: number): string {
  if (colorIndex === 0) return baseUrl;
  return baseUrl.replace(/\/seed\/([^/]+)\//, `/seed/$1-v${colorIndex}/`);
}

export default function ProductCard({
  product,
  activeColorIndex,
  onColorChange,
  onQuickView,
}: ProductCardProps) {
  const [isMediaHovered, setIsMediaHovered] = useState(false);

  const primarySrc = useMemo(
    () => variantImage(product.image, activeColorIndex),
    [product.image, activeColorIndex]
  );
  const hoverSrc = useMemo(
    () => variantImage(product.hoverImage, activeColorIndex),
    [product.hoverImage, activeColorIndex]
  );

  const activeColorLabel =
    COLOR_LABELS[product.colors[activeColorIndex]] ?? `Variant ${activeColorIndex + 1}`;

  return (
    <div className="shop-card">
      <div
        className="shop-card-image"
        onMouseEnter={() => setIsMediaHovered(true)}
        onMouseLeave={() => setIsMediaHovered(false)}
      >
        {product.badge === "lionels-pick" && (
          <span className="product-badge lionels-pick">
            Lionel&apos;s Pick
          </span>
        )}
        {product.badge === "sale" && (
          <span className="product-badge sale">Sale</span>
        )}
        {product.badge === "new" && (
          <span className="product-badge new-badge">New</span>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={primarySrc}
          alt={product.name}
          className="shop-img-primary"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hoverSrc}
          alt={`${product.name} detail`}
          className="shop-img-hover"
        />

        {/* Media indicator dots */}
        <div className="shop-card-media-dots">
          <span className={`shop-media-dot${!isMediaHovered ? " active" : ""}`} />
          <span className={`shop-media-dot${isMediaHovered ? " active" : ""}`} />
        </div>

        {/* Quick-view eye button — top-right */}
        <button
          className="quick-view-btn"
          onClick={() => onQuickView(product)}
          aria-label={`Quick view ${product.name}`}
        >
          <EyeIcon />
        </button>

        {/* Secondary CTA */}
        <button
          className="shop-card-cta"
          onClick={() => onQuickView(product)}
        >
          Choose options
        </button>
      </div>

      <div className="shop-card-info">
        <p className="shop-card-vendor">DREAMPLAY</p>
        <div className="shop-card-title-row">
          <h3>{product.name}</h3>
          <p className="price">
            {product.comparePrice && (
              <>
                <s>${product.comparePrice.toLocaleString()}</s>
                <span className="sale-price">
                  ${product.price.toLocaleString()}
                </span>
              </>
            )}
            {!product.comparePrice && `$${product.price.toLocaleString()}`}
          </p>
        </div>
        {product.rating > 0 && <StarRating rating={product.rating} />}
        {product.colors.length > 0 && (
          <div className="shop-card-swatches">
            {product.colors.map((color, i) => (
              <button
                key={i}
                className={`shop-swatch${activeColorIndex === i ? " active" : ""}`}
                style={{ background: color }}
                onClick={() => onColorChange(product.id, i)}
                aria-label={COLOR_LABELS[color] ?? `Color variant ${i + 1}`}
                title={COLOR_LABELS[color] ?? `Variant ${i + 1}`}
              />
            ))}
            <span className="shop-swatch-label">{activeColorLabel}</span>
          </div>
        )}
        {product.stock <= 5 && (
          <p className="shop-stock-label">Only {product.stock} left</p>
        )}
      </div>
    </div>
  );
}
