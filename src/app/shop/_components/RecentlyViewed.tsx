"use client";

import type { Product } from "../_lib/shop-types";

interface RecentlyViewedProps {
  products: Product[];
  onOpenQuickView: (product: Product) => void;
}

export default function RecentlyViewed({
  products,
  onOpenQuickView,
}: RecentlyViewedProps) {
  if (products.length === 0) return null;

  return (
    <section className="shop-recent-section">
      <div className="container">
        <h2 className="section-heading">Recently Viewed</h2>
        <div className="shop-recent-scroller">
          {products.map((p) => (
            <div
              className="shop-recent-card"
              key={p.id}
              onClick={() => onOpenQuickView(p)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt={p.name} />
              <h4>{p.name}</h4>
              <p>${p.price.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
