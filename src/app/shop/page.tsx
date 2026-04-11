"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

/* ─── Product Data (server-side mock) ─── */
interface Product {
  id: number;
  name: string;
  category: "Grand" | "Upright" | "Digital";
  finish: "Ebony" | "White" | "Walnut";
  price: number;
  comparePrice?: number;
  image: string;
  hoverImage: string;
  badge?: "lionels-pick" | "sale" | "new";
  stock: number;
  rating: number;
  colors: string[];
}

const PRODUCTS: Product[] = [
  { id: 1, name: "Concert Grand S7", category: "Grand", finish: "Ebony", price: 12999, image: "https://picsum.photos/seed/piano-g1/600/750", hoverImage: "https://picsum.photos/seed/piano-g1d/600/750", badge: "lionels-pick", stock: 2, rating: 5, colors: ["#1a1a1a", "#f5f0e8", "#6b4226"] },
  { id: 2, name: "Parlour Grand P5", category: "Grand", finish: "Walnut", price: 9499, image: "https://picsum.photos/seed/piano-g2/600/750", hoverImage: "https://picsum.photos/seed/piano-g2d/600/750", stock: 5, rating: 5, colors: ["#6b4226", "#1a1a1a"] },
  { id: 3, name: "Studio Upright U3", category: "Upright", finish: "Ebony", price: 4299, image: "https://picsum.photos/seed/piano-u1/600/750", hoverImage: "https://picsum.photos/seed/piano-u1d/600/750", badge: "new", stock: 8, rating: 4, colors: ["#1a1a1a", "#f5f0e8"] },
  { id: 4, name: "Classic Upright U1", category: "Upright", finish: "White", price: 3499, image: "https://picsum.photos/seed/piano-u2/600/750", hoverImage: "https://picsum.photos/seed/piano-u2d/600/750", stock: 3, rating: 4, colors: ["#f5f0e8", "#1a1a1a", "#6b4226"] },
  { id: 5, name: "Virtuoso Digital V9", category: "Digital", finish: "Ebony", price: 2199, comparePrice: 2799, image: "https://picsum.photos/seed/piano-d1/600/750", hoverImage: "https://picsum.photos/seed/piano-d1d/600/750", badge: "sale", stock: 12, rating: 5, colors: ["#1a1a1a", "#f5f0e8"] },
  { id: 6, name: "Ensemble Grand E7", category: "Grand", finish: "White", price: 15999, image: "https://picsum.photos/seed/piano-g3/600/750", hoverImage: "https://picsum.photos/seed/piano-g3d/600/750", badge: "lionels-pick", stock: 1, rating: 5, colors: ["#f5f0e8", "#1a1a1a"] },
  { id: 7, name: "Heritage Upright H4", category: "Upright", finish: "Walnut", price: 5199, image: "https://picsum.photos/seed/piano-u3/600/750", hoverImage: "https://picsum.photos/seed/piano-u3d/600/750", stock: 6, rating: 4, colors: ["#6b4226", "#1a1a1a", "#f5f0e8"] },
  { id: 8, name: "Stage Digital SD5", category: "Digital", finish: "Ebony", price: 1599, image: "https://picsum.photos/seed/piano-d2/600/750", hoverImage: "https://picsum.photos/seed/piano-d2d/600/750", badge: "new", stock: 15, rating: 4, colors: ["#1a1a1a"] },
  { id: 9, name: "Salon Grand SL9", category: "Grand", finish: "Ebony", price: 18999, image: "https://picsum.photos/seed/piano-g4/600/750", hoverImage: "https://picsum.photos/seed/piano-g4d/600/750", badge: "lionels-pick", stock: 1, rating: 5, colors: ["#1a1a1a", "#6b4226"] },
  { id: 10, name: "Portable Digital PD3", category: "Digital", finish: "White", price: 899, image: "https://picsum.photos/seed/piano-d3/600/750", hoverImage: "https://picsum.photos/seed/piano-d3d/600/750", stock: 20, rating: 3, colors: ["#f5f0e8", "#1a1a1a"] },
  { id: 11, name: "Conservatory Upright C5", category: "Upright", finish: "Ebony", price: 6799, image: "https://picsum.photos/seed/piano-u4/600/750", hoverImage: "https://picsum.photos/seed/piano-u4d/600/750", stock: 4, rating: 5, colors: ["#1a1a1a", "#f5f0e8", "#6b4226"] },
  { id: 12, name: "Hybrid Digital HX7", category: "Digital", finish: "Walnut", price: 3299, image: "https://picsum.photos/seed/piano-d4/600/750", hoverImage: "https://picsum.photos/seed/piano-d4d/600/750", badge: "new", stock: 7, rating: 4, colors: ["#6b4226", "#1a1a1a"] },
];

const CATEGORIES = ["Grand", "Upright", "Digital"] as const;
const FINISHES = ["Ebony", "White", "Walnut"] as const;
const PRICE_RANGES = [
  { label: "Under $2,000", min: 0, max: 2000 },
  { label: "$2,000 – $5,000", min: 2000, max: 5000 },
  { label: "$5,000 – $10,000", min: 5000, max: 10000 },
  { label: "$10,000+", min: 10000, max: Infinity },
] as const;

type SortOption = "featured" | "best-selling" | "alpha-az" | "alpha-za" | "price-asc" | "price-desc" | "date-old" | "date-new";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "best-selling", label: "Best selling" },
  { value: "alpha-az", label: "Alphabetically, A-Z" },
  { value: "alpha-za", label: "Alphabetically, Z-A" },
  { value: "price-asc", label: "Price, low to high" },
  { value: "price-desc", label: "Price, high to low" },
  { value: "date-old", label: "Date, old to new" },
  { value: "date-new", label: "Date, new to old" },
];

const ITEMS_PER_PAGE = 8;

/* ─── Quick View Drawer ─── */
function QuickBuyDrawer({
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

  useEffect(() => {
    if (open) {
      setQty(1);
      setSelectedColor(0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.image} alt={product.name} className="qb-img" />
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

/* ─── Eye Icon SVG ─── */
function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

/* ─── Filter Icon SVG ─── */
function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="8" y1="12" x2="20" y2="12" />
      <line x1="12" y1="18" x2="20" y2="18" />
      <circle cx="6" cy="12" r="2" fill="currentColor" />
      <circle cx="14" cy="18" r="2" fill="currentColor" />
    </svg>
  );
}

/* ─── Home Icon SVG ─── */
function HomeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

/* ─── Shop Page ─── */
export default function ShopPage() {
  const [cartCount, setCartCount] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  /* Filters */
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  /* Pagination */
  const [currentPage, setCurrentPage] = useState(1);

  /* Quick View */
  const [drawerProduct, setDrawerProduct] = useState<Product | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  /* Recently Viewed */
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const recentRef = useRef<HTMLDivElement>(null);

  /* Active color per card */
  const [activeColors, setActiveColors] = useState<Record<number, number>>({});

  const addToCart = useCallback(() => {
    setCartCount((prev) => prev + 1);
  }, []);

  const openQuickView = (product: Product) => {
    setDrawerProduct(product);
    setDrawerOpen(true);
    setRecentlyViewed((prev) => {
      const without = prev.filter((p) => p.id !== product.id);
      return [product, ...without].slice(0, 8);
    });
  };

  /* Toggle helpers */
  const toggle = (
    arr: string[],
    val: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };

  /* Category counts */
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    CATEGORIES.forEach((c) => {
      counts[c] = PRODUCTS.filter((p) => p.category === c).length;
    });
    return counts;
  }, []);

  /* Filter + Sort */
  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (selectedCategories.length && !selectedCategories.includes(p.category)) return false;
      if (selectedFinishes.length && !selectedFinishes.includes(p.finish)) return false;
      if (selectedPriceRange !== null) {
        const r = PRICE_RANGES[selectedPriceRange];
        if (p.price < r.min || p.price >= r.max) return false;
      }
      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "alpha-az": return a.name.localeCompare(b.name);
        case "alpha-za": return b.name.localeCompare(a.name);
        case "best-selling": return b.rating - a.rating || a.stock - b.stock;
        case "date-new": return b.id - a.id;
        case "date-old": return a.id - b.id;
        default: {
          const af = a.badge === "lionels-pick" ? 0 : 1;
          const bf = b.badge === "lionels-pick" ? 0 : 1;
          return af - bf || a.stock - b.stock;
        }
      }
    });
  }, [selectedCategories, selectedFinishes, selectedPriceRange, sortBy]);

  /* Pagination */
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginatedProducts = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, selectedFinishes, selectedPriceRange, sortBy]);

  const activeFilterCount =
    selectedCategories.length +
    selectedFinishes.length +
    (selectedPriceRange !== null ? 1 : 0);

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedFinishes([]);
    setSelectedPriceRange(null);
  };

  /* Active filter pills */
  const activeFilterPills: { label: string; onRemove: () => void }[] = [];
  selectedCategories.forEach((c) => {
    activeFilterPills.push({
      label: c,
      onRemove: () => setSelectedCategories((prev) => prev.filter((v) => v !== c)),
    });
  });
  selectedFinishes.forEach((f) => {
    activeFilterPills.push({
      label: f,
      onRemove: () => setSelectedFinishes((prev) => prev.filter((v) => v !== f)),
    });
  });
  if (selectedPriceRange !== null) {
    activeFilterPills.push({
      label: PRICE_RANGES[selectedPriceRange].label,
      onRemove: () => setSelectedPriceRange(null),
    });
  }

  /* Quick category select */
  const selectCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories([cat]);
    }
  };

  return (
    <>
      <AnnouncementBar />
      <Header cartCount={cartCount} />

      {/* ── Collection Banner (Hero) ── */}
      <section className="shop-hero">
        <div className="shop-hero-overlay" />
      </section>

      {/* ── Main shop section ── */}
      <section className="shop-section">
        <div className="container">
          <div className="shop-page-intro">
            <nav className="shop-breadcrumb" aria-label="Breadcrumb">
              <a href="/"><HomeIcon /></a>
              <svg className="breadcrumb-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
              <a href="/shop">Collections</a>
              <svg className="breadcrumb-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
              <span>All products</span>
            </nav>
            <h1 className="shop-page-title">All products</h1>
          </div>
          {/* Toolbar */}
          <div className="shop-toolbar">
            <div className="shop-toolbar-left">
              <button
                className={`shop-filter-toggle${filtersOpen ? " active" : ""}`}
                onClick={() => setFiltersOpen(!filtersOpen)}
              >
                <FilterIcon />
                <span>Show filters</span>
                {activeFilterCount > 0 && (
                  <span className="filter-count">{activeFilterCount}</span>
                )}
              </button>

              {/* Category quick-link pills */}
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`shop-category-pill${selectedCategories.length === 1 && selectedCategories[0] === cat ? " active" : ""}`}
                  onClick={() => selectCategory(cat)}
                >
                  {cat}<sup>{categoryCounts[cat]}</sup>
                </button>
              ))}

              {/* Show on model placeholder */}
              <button className="shop-model-btn">
                Show on model
              </button>
            </div>

            <div className="shop-toolbar-right">
              <div className="shop-sort">
                <select
                  id="shop-sort-sel"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <p className="shop-result-count">
                {filtered.length} product{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* ── Horizontal Filter Panel (dropdown) ── */}
          <div className={`shop-filter-panel${filtersOpen ? " open" : ""}`}>
            <div className="shop-filter-panel-inner">
              <div className="shop-filter-group">
                <h4>Category</h4>
                {CATEGORIES.map((c) => (
                  <label key={c} className="shop-filter-check">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(c)}
                      onChange={() => toggle(selectedCategories, c, setSelectedCategories)}
                    />
                    <span>{c}</span>
                    <span className="shop-filter-count">
                      {PRODUCTS.filter((p) => p.category === c).length}
                    </span>
                  </label>
                ))}
              </div>

              <div className="shop-filter-group">
                <h4>Finish</h4>
                {FINISHES.map((f) => (
                  <label key={f} className="shop-filter-check">
                    <input
                      type="checkbox"
                      checked={selectedFinishes.includes(f)}
                      onChange={() => toggle(selectedFinishes, f, setSelectedFinishes)}
                    />
                    <span>{f}</span>
                    <span className="shop-filter-count">
                      {PRODUCTS.filter((p) => p.finish === f).length}
                    </span>
                  </label>
                ))}
              </div>

              <div className="shop-filter-group">
                <h4>Price Range</h4>
                {PRICE_RANGES.map((r, i) => (
                  <label key={r.label} className="shop-filter-check">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={selectedPriceRange === i}
                      onChange={() => setSelectedPriceRange(selectedPriceRange === i ? null : i)}
                    />
                    <span>{r.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Active filter pills */}
            {activeFilterPills.length > 0 && (
              <div className="shop-active-filters">
                {activeFilterPills.map((pill) => (
                  <button key={pill.label} className="shop-filter-pill" onClick={pill.onRemove}>
                    {pill.label}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </button>
                ))}
                <button className="shop-clear-all" onClick={clearFilters}>Clear all</button>
              </div>
            )}
          </div>

          {/* ── Product Grid ── */}
          {filtered.length === 0 ? (
            <div className="shop-empty">
              <p>No products match your filters.</p>
              <button className="shop-empty-btn" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="shop-product-grid">
                {paginatedProducts.map((product) => (
                  <div className="shop-card" key={product.id}>
                    <div className="shop-card-image">
                      {/* Badges */}
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

                      {/* Image swap on hover */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="shop-img-primary"
                      />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.hoverImage}
                        alt={`${product.name} detail`}
                        className="shop-img-hover"
                      />

                      {/* Quick View eye icon — top-right on hover */}
                      <button
                        className="quick-view-btn"
                        onClick={() => openQuickView(product)}
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
                          {!product.comparePrice &&
                            `$${product.price.toLocaleString()}`}
                        </p>
                      </div>
                      {/* Color swatches */}
                      {product.colors.length > 0 && (
                        <div className="shop-card-swatches">
                          {product.colors.map((color, i) => (
                            <button
                              key={i}
                              className={`shop-swatch${(activeColors[product.id] ?? 0) === i ? " active" : ""}`}
                              style={{ background: color }}
                              onClick={() =>
                                setActiveColors((prev) => ({ ...prev, [product.id]: i }))
                              }
                              aria-label={`Color variant ${i + 1}`}
                            />
                          ))}
                        </div>
                      )}
                      {product.stock <= 5 && (
                        <p className="shop-stock-label">
                          Only {product.stock} left
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Pagination ── */}
              {totalPages > 1 && (
                <nav className="shop-pagination" aria-label="Pagination">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={`shop-page-btn${currentPage === page ? " active" : ""}`}
                      onClick={() => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      {page}
                    </button>
                  ))}
                  {currentPage < totalPages && (
                    <button
                      className="shop-page-btn shop-page-next"
                      onClick={() => {
                        setCurrentPage((p) => p + 1);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      Next &rarr;
                    </button>
                  )}
                </nav>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── Discover Pure Euphony ── */}
      <section className="euphony-section">
        <div className="euphony-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://picsum.photos/seed/euphony-piano/1600/800"
            alt="Live performance"
          />
        </div>
        <div className="euphony-overlay">
          <div className="container">
            <div className="euphony-content">
              <p className="euphony-tag">DREAMPLAY</p>
              <h2>Discover Pure Euphony</h2>
              <p className="euphony-text">
                Every instrument we craft carries a singular purpose &mdash; to
                dissolve the boundary between musician and music. Our master
                artisans spend over 200 hours on each piece, tuning not just the
                mechanics, but the soul of every key. From the weighted touch of
                our grand actions to the whisper-quiet digital interfaces,
                DreamPlay instruments don&apos;t just produce sound &mdash; they
                channel emotion.
              </p>
              <p className="euphony-text">
                We believe that true euphony is not heard; it is felt. It lives
                in the resonance that lingers after the last note fades, in the
                perfect response of a key beneath your fingertip, in the moment
                when practice transcends into art.
              </p>
              <a href="/" className="euphony-cta">
                Explore Our Craft
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Recently Viewed ── */}
      {recentlyViewed.length > 0 && (
        <section className="shop-recent-section">
          <div className="container">
            <h2 className="section-heading">Recently Viewed</h2>
            <div className="shop-recent-scroller" ref={recentRef}>
              {recentlyViewed.map((p) => (
                <div
                  className="shop-recent-card"
                  key={p.id}
                  onClick={() => openQuickView(p)}
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
      )}

      <Footer />
      <BackToTop />

      {/* Quick View Drawer */}
      <QuickBuyDrawer
        product={drawerProduct}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onAddToCart={addToCart}
      />
    </>
  );
}
