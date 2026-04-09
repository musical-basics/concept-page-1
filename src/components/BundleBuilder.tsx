"use client";

import { useState, useCallback } from "react";

interface BundleItem {
  name: string;
  price: number;
}

const bundleProducts = [
  { name: "Elite Pro Headphones", price: 99, seed: "bundle1" },
  { name: "Studio Earbuds", price: 79, seed: "bundle2" },
  { name: "Portable Speaker", price: 149, seed: "bundle3" },
  { name: "DAC Amplifier", price: 199, seed: "bundle4" },
  { name: "Premium Cable Kit", price: 29, seed: "bundle5" },
  { name: "Carrying Case", price: 49, seed: "bundle6" },
];

export default function BundleBuilder({
  onAddToCart,
}: {
  onAddToCart: (count: number) => void;
}) {
  const [selected, setSelected] = useState<BundleItem[]>([]);

  const toggleBundle = useCallback(
    (name: string, price: number) => {
      setSelected((prev) => {
        const idx = prev.findIndex((b) => b.name === name);
        if (idx > -1) return prev.filter((_, i) => i !== idx);
        return [...prev, { name, price }];
      });
    },
    []
  );

  const count = selected.length;
  const progress = Math.min(count / 3, 1) * 100;
  const subtotal = selected.reduce((s, b) => s + b.price, 0);
  const discount = count >= 3 ? 0.3 : 0;
  const total = subtotal * (1 - discount);

  const progressText =
    count >= 3
      ? `${count} items selected — 30% discount applied!`
      : `Select ${3 - count} more item${3 - count !== 1 ? "s" : ""} to unlock 30% off`;

  return (
    <section className="bundle-builder" id="bundle">
      <div className="container">
        <h2>Build Your Bundle</h2>
        <p className="subtitle">Select 3 or more products and save 30%</p>
        <div className="bundle-content">
          <div className="bundle-products" id="bundleProducts">
            {bundleProducts.map((prod) => {
              const isSelected = selected.some((b) => b.name === prod.name);
              return (
                <div
                  key={prod.name}
                  className={`bundle-product${isSelected ? " selected" : ""}`}
                  onClick={() => toggleBundle(prod.name, prod.price)}
                  data-name={prod.name}
                  data-price={prod.price}
                >
                  <div className="bundle-checkbox">&#10003;</div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://picsum.photos/seed/${prod.seed}/140/140`}
                    alt="Product"
                  />
                  <div className="bundle-product-info">
                    <h4>{prod.name}</h4>
                    <p>${prod.price}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="bundle-summary">
            <h3>Your Bundle</h3>
            <div className="bundle-progress">
              <div className="bundle-progress-bar">
                <div
                  className="bundle-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="bundle-progress-text">{progressText}</span>
            </div>
            <div className="bundle-items-list">
              {selected.map((b) => (
                <div className="bundle-item-row" key={b.name}>
                  <span>{b.name}</span>
                  <span>${b.price}</span>
                </div>
              ))}
            </div>
            <div className="bundle-discount">
              {discount ? `You save $${(subtotal * discount).toFixed(0)}!` : ""}
            </div>
            <div className="bundle-total-row">
              <span>Total</span>
              <span>${total.toFixed(0)}</span>
            </div>
            <button
              className={`bundle-add-btn${count >= 3 ? " active" : ""}`}
              onClick={() => {
                if (count >= 3) onAddToCart(count);
              }}
            >
              Add Bundle to Cart
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
