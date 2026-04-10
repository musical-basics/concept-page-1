"use client";

import Link from "next/link";
import { useState, useCallback, useMemo } from "react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import type { Product, SortOption } from "./_lib/shop-types";
import {
  PRODUCTS,
  CATEGORIES,
  PRICE_RANGES,
  ITEMS_PER_PAGE,
} from "./_lib/shop-constants";
import ShopHero from "./_components/ShopHero";
import ShopToolbar from "./_components/ShopToolbar";
import ProductCard from "./_components/ProductCard";
import ShopPagination from "./_components/ShopPagination";
import RecentlyViewed from "./_components/RecentlyViewed";
import { QuickBuyDrawer } from "./_components/QuickBuyDrawer";

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
  const activePage = Math.min(currentPage, totalPages);
  const paginatedProducts = filtered.slice(
    (activePage - 1) * ITEMS_PER_PAGE,
    activePage * ITEMS_PER_PAGE
  );

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

      <ShopHero />

      <section className="shop-section">
        <div className="container">
          <ShopToolbar
            filtersOpen={filtersOpen}
            setFiltersOpen={setFiltersOpen}
            activeFilterCount={activeFilterCount}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedFinishes={selectedFinishes}
            setSelectedFinishes={setSelectedFinishes}
            selectedPriceRange={selectedPriceRange}
            setSelectedPriceRange={setSelectedPriceRange}
            sortBy={sortBy}
            setSortBy={setSortBy}
            filteredCount={filtered.length}
            categoryCounts={categoryCounts}
            selectCategory={selectCategory}
            activeFilterPills={activeFilterPills}
            onClearFilters={clearFilters}
          />

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
                  <ProductCard
                    key={product.id}
                    product={product}
                    activeColorIndex={activeColors[product.id] ?? 0}
                    onColorChange={(id, i) =>
                      setActiveColors((prev) => ({ ...prev, [id]: i }))
                    }
                    onQuickView={openQuickView}
                  />
                ))}
              </div>

              <ShopPagination
                totalPages={totalPages}
                activePage={activePage}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </section>

      {/* Discover Pure Euphony */}
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
              <Link href="/" className="euphony-cta">
                Explore Our Craft
              </Link>
            </div>
          </div>
        </div>
      </section>

      <RecentlyViewed
        products={recentlyViewed}
        onOpenQuickView={openQuickView}
      />

      <Footer />
      <BackToTop />

      <QuickBuyDrawer
        key={`${drawerProduct?.id ?? "none"}-${drawerOpen ? "open" : "closed"}`}
        product={drawerProduct}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onAddToCart={addToCart}
      />
    </>
  );
}
