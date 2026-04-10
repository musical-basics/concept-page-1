"use client";

import { useMemo } from "react";
import type { Product } from "../_lib/shop-types";
import { EyeIcon } from "./icons";

interface ProductCardProps {
  product: Product;
  activeColorIndex: number;
  onColorChange: (productId: number, colorIndex: number) => void;
  onQuickView: (product: Product) => void;
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
  const primarySrc = useMemo(
    () => variantImage(product.image, activeColorIndex),
    [product.image, activeColorIndex]
  );
  const hoverSrc = useMemo(
    () => variantImage(product.hoverImage, activeColorIndex),
    [product.hoverImage, activeColorIndex]
  );

  return (
    <div className="shop-card">
      <div className="shop-card-image">
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

        <button
          className="quick-view-btn"
          onClick={() => onQuickView(product)}
          aria-label={`Quick view ${product.name}`}
        >
          <EyeIcon />
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
        {product.colors.length > 0 && (
          <div className="shop-card-swatches">
            {product.colors.map((color, i) => (
              <button
                key={i}
                className={`shop-swatch${activeColorIndex === i ? " active" : ""}`}
                style={{ background: color }}
                onClick={() => onColorChange(product.id, i)}
                aria-label={`Color variant ${i + 1}`}
              />
            ))}
          </div>
        )}
        {product.stock <= 5 && (
          <p className="shop-stock-label">Only {product.stock} left</p>
        )}
      </div>
    </div>
  );
}
