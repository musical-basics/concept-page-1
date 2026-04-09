"use client";

import { useState, useCallback, useMemo } from "react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: "sale" | "new" | "bestseller";
  category: string;
  rating: number;
  inStock: boolean;
}

const products: Product[] = [
  {
    id: 1,
    name: "DreamPlay DS-55 White",
    price: 1299,
    originalPrice: 1599,
    image: "/assets/dreamplay/ds55_white.png",
    badge: "sale",
    category: "Digital Pianos",
    rating: 5,
    inStock: true,
  },
  {
    id: 2,
    name: "DreamPlay DS-60 Black",
    price: 1899,
    image: "/assets/dreamplay/ds60_black.png",
    badge: "new",
    category: "Digital Pianos",
    rating: 5,
    inStock: true,
  },
  {
    id: 3,
    name: "Studio Monitor Keyboard",
    price: 2499,
    image: "/assets/dreamplay/keyboard_studio.avif",
    category: "Studio Equipment",
    rating: 4,
    inStock: true,
  },
  {
    id: 4,
    name: "Performance Grand Key Action",
    price: 3299,
    image: "/assets/dreamplay/keyboard_hero.jpg",
    badge: "bestseller",
    category: "Grand Pianos",
    rating: 5,
    inStock: true,
  },
  {
    id: 5,
    name: "Ergonomic Hand Guide Set",
    price: 89,
    image: "/assets/dreamplay/hand_span_guide.jpg",
    category: "Accessories",
    rating: 4,
    inStock: true,
  },
  {
    id: 6,
    name: "Relaxed Touch Trainer",
    price: 149,
    originalPrice: 199,
    image: "/assets/dreamplay/hand_relaxed.jpg",
    badge: "sale",
    category: "Accessories",
    rating: 4,
    inStock: false,
  },
  {
    id: 7,
    name: "Zone A Practice Pad",
    price: 59,
    image: "/assets/dreamplay/hand_zone_a.png",
    category: "Accessories",
    rating: 3,
    inStock: true,
  },
  {
    id: 8,
    name: "Zone B Practice Pad",
    price: 59,
    image: "/assets/dreamplay/hand_zone_b.png",
    badge: "new",
    category: "Accessories",
    rating: 4,
    inStock: true,
  },
  {
    id: 9,
    name: "Pianist Hands Poster",
    price: 39,
    image: "/assets/dreamplay/pianist_hands.jpg",
    category: "Accessories",
    rating: 5,
    inStock: true,
  },
  {
    id: 10,
    name: "DreamPlay DS-55 Studio Bundle",
    price: 1599,
    originalPrice: 1999,
    image: "/assets/dreamplay/ds55_white.png",
    badge: "sale",
    category: "Digital Pianos",
    rating: 5,
    inStock: true,
  },
  {
    id: 11,
    name: "Carol Leone Signature Edition",
    price: 4999,
    image: "/assets/dreamplay/carol_leone.png",
    badge: "bestseller",
    category: "Grand Pianos",
    rating: 5,
    inStock: true,
  },
  {
    id: 12,
    name: "Zone C Practice Pad",
    price: 59,
    image: "/assets/dreamplay/hand_zone_c.png",
    category: "Accessories",
    rating: 3,
    inStock: false,
  },
];

const categories = ["All", "Digital Pianos", "Grand Pianos", "Studio Equipment", "Accessories"];

const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under $100", min: 0, max: 100 },
  { label: "$100 – $500", min: 100, max: 500 },
  { label: "$500 – $2,000", min: 500, max: 2000 },
  { label: "$2,000+", min: 2000, max: Infinity },
];

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest", value: "newest" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i}>{i <= rating ? "\u2605" : "\u2606"}</span>
      ))}
    </div>
  );
}

export default function ShopPage() {
  const [cartCount, setCartCount] = useState(0);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activePriceRange, setActivePriceRange] = useState(0);
  const [availability, setAvailability] = useState<"all" | "in-stock">("all");
  const [sortBy, setSortBy] = useState("featured");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const addToCart = useCallback(() => {
    setCartCount((prev) => prev + 1);
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      if (activeCategory !== "All" && p.category !== activeCategory) return false;
      const range = priceRanges[activePriceRange];
      if (p.price < range.min || p.price >= range.max) return false;
      if (availability === "in-stock" && !p.inStock) return false;
      return true;
    });

    switch (sortBy) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result = [...result].sort((a, b) => (b.badge === "new" ? 1 : 0) - (a.badge === "new" ? 1 : 0));
        break;
    }

    return result;
  }, [activeCategory, activePriceRange, availability, sortBy]);

  const clearFilters = () => {
    setActiveCategory("All");
    setActivePriceRange(0);
    setAvailability("all");
    setSortBy("featured");
  };

  const activeFilterCount =
    (activeCategory !== "All" ? 1 : 0) +
    (activePriceRange !== 0 ? 1 : 0) +
    (availability !== "all" ? 1 : 0);

  return (
    <>
      <AnnouncementBar />
      <Header cartCount={cartCount} />

      {/* Shop Hero Banner */}
      <section className="shop-hero">
        <div className="shop-hero-overlay">
          <p className="shop-hero-tag">The Collection</p>
          <h1>Shop All Instruments</h1>
          <p className="shop-hero-subtitle">
            Handcrafted precision meets modern innovation
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="shop-breadcrumb">
        <div className="container">
          <a href="/">Home</a>
          <span className="breadcrumb-sep">/</span>
          <span>Shop</span>
        </div>
      </div>

      {/* Shop Layout */}
      <section className="shop-section">
        <div className="container">
          {/* Toolbar */}
          <div className="shop-toolbar">
            <button
              className="shop-filter-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span className="filter-icon">&#9776;</span>
              Filters
              {activeFilterCount > 0 && (
                <span className="filter-count">{activeFilterCount}</span>
              )}
            </button>
            <p className="shop-result-count">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
            </p>
            <div className="shop-sort">
              <label htmlFor="sort-select">Sort by</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="shop-layout">
            {/* Filter Sidebar */}
            <aside className={`shop-sidebar${sidebarOpen ? " open" : ""}`}>
              <div className="sidebar-header">
                <h3>Filters</h3>
                {activeFilterCount > 0 && (
                  <button className="clear-filters" onClick={clearFilters}>
                    Clear All
                  </button>
                )}
                <button
                  className="sidebar-close"
                  onClick={() => setSidebarOpen(false)}
                >
                  &times;
                </button>
              </div>

              {/* Category Filter */}
              <div className="filter-group">
                <h4>Category</h4>
                <ul className="filter-list">
                  {categories.map((cat) => (
                    <li key={cat}>
                      <button
                        className={`filter-option${activeCategory === cat ? " active" : ""}`}
                        onClick={() => setActiveCategory(cat)}
                      >
                        {cat}
                        <span className="filter-option-count">
                          {cat === "All"
                            ? products.length
                            : products.filter((p) => p.category === cat).length}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Filter */}
              <div className="filter-group">
                <h4>Price</h4>
                <ul className="filter-list">
                  {priceRanges.map((range, i) => (
                    <li key={range.label}>
                      <button
                        className={`filter-option${activePriceRange === i ? " active" : ""}`}
                        onClick={() => setActivePriceRange(i)}
                      >
                        {range.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Availability Filter */}
              <div className="filter-group">
                <h4>Availability</h4>
                <ul className="filter-list">
                  <li>
                    <button
                      className={`filter-option${availability === "all" ? " active" : ""}`}
                      onClick={() => setAvailability("all")}
                    >
                      All Items
                    </button>
                  </li>
                  <li>
                    <button
                      className={`filter-option${availability === "in-stock" ? " active" : ""}`}
                      onClick={() => setAvailability("in-stock")}
                    >
                      In Stock Only
                    </button>
                  </li>
                </ul>
              </div>
            </aside>

            {/* Sidebar Overlay (mobile) */}
            {sidebarOpen && (
              <div
                className="sidebar-overlay"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Product Grid */}
            <div className="shop-grid-area">
              {filteredProducts.length === 0 ? (
                <div className="shop-empty">
                  <p>No products match your filters.</p>
                  <button className="shop-empty-btn" onClick={clearFilters}>
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="shop-product-grid">
                  {filteredProducts.map((product) => (
                    <div
                      className={`product-card${!product.inStock ? " out-of-stock" : ""}`}
                      key={product.id}
                    >
                      <div className="product-card-image">
                        {product.badge && (
                          <span className={`product-badge ${product.badge}`}>
                            {product.badge === "sale"
                              ? "Sale"
                              : product.badge === "new"
                              ? "New"
                              : "Best Seller"}
                          </span>
                        )}
                        {!product.inStock && (
                          <span className="product-badge sold-out">Sold Out</span>
                        )}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={product.image} alt={product.name} />
                        {product.inStock && (
                          <button className="quick-add" onClick={addToCart}>
                            Quick Add
                          </button>
                        )}
                      </div>
                      <div className="product-card-info">
                        <p className="product-card-category">{product.category}</p>
                        <h3>{product.name}</h3>
                        <p className="price">
                          {product.originalPrice ? (
                            <>
                              <span className="sale-price">
                                ${product.price.toLocaleString()}
                              </span>{" "}
                              <s>${product.originalPrice.toLocaleString()}</s>
                            </>
                          ) : (
                            `$${product.price.toLocaleString()}`
                          )}
                        </p>
                        <StarRating rating={product.rating} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Discover Pure Euphony */}
      <section className="euphony-section">
        <div className="euphony-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/dreamplay/lionel_performance.png"
            alt="Live performance"
          />
        </div>
        <div className="euphony-overlay">
          <div className="container">
            <div className="euphony-content">
              <p className="euphony-tag">The DreamPlay Philosophy</p>
              <h2>Discover Pure Euphony</h2>
              <p className="euphony-text">
                Every instrument we craft carries a singular purpose — to dissolve
                the boundary between musician and music. Our master artisans spend
                over 200 hours on each piece, tuning not just the mechanics, but the
                soul of every key. From the weighted touch of our grand actions to the
                whisper-quiet digital interfaces, DreamPlay instruments don&apos;t just
                produce sound — they channel emotion.
              </p>
              <p className="euphony-text">
                We believe that true euphony is not heard; it is felt. It lives in the
                resonance that lingers after the last note fades, in the perfect
                response of a key beneath your fingertip, in the moment when
                practice transcends into art.
              </p>
              <a href="/" className="euphony-cta">
                Explore Our Craft
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </>
  );
}
