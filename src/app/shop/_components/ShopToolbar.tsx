"use client";

import { useState } from "react";
import { FilterIcon } from "./icons";
import {
  PRODUCTS,
  CATEGORIES,
  FINISHES,
  PRICE_RANGES,
  SORT_OPTIONS,
} from "../_lib/shop-constants";
import type { SortOption } from "../_lib/shop-types";

interface ActiveFilterPill {
  label: string;
  onRemove: () => void;
}

interface ShopToolbarProps {
  filtersOpen: boolean;
  setFiltersOpen: (v: boolean) => void;
  activeFilterCount: number;
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  selectedFinishes: string[];
  setSelectedFinishes: React.Dispatch<React.SetStateAction<string[]>>;
  selectedPriceRange: number | null;
  setSelectedPriceRange: React.Dispatch<React.SetStateAction<number | null>>;
  sortBy: SortOption;
  setSortBy: React.Dispatch<React.SetStateAction<SortOption>>;
  filteredCount: number;
  categoryCounts: Record<string, number>;
  selectCategory: (cat: string) => void;
  activeFilterPills: ActiveFilterPill[];
  onClearFilters: () => void;
}

function toggle(
  arr: string[],
  val: string,
  setter: React.Dispatch<React.SetStateAction<string[]>>
) {
  setter(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
}

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`filter-accordion-chevron${open ? " open" : ""}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function ShopToolbar({
  filtersOpen,
  setFiltersOpen,
  activeFilterCount,
  selectedCategories,
  setSelectedCategories,
  selectedFinishes,
  setSelectedFinishes,
  selectedPriceRange,
  setSelectedPriceRange,
  sortBy,
  setSortBy,
  filteredCount,
  categoryCounts,
  selectCategory,
  activeFilterPills,
  onClearFilters,
}: ShopToolbarProps) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    category: true,
    finish: true,
    price: true,
  });

  const toggleGroup = (key: string) =>
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <>
      <div className="shop-toolbar">
        <div className="shop-toolbar-left">
          <button
            className={`shop-filter-toggle${filtersOpen ? " active" : ""}`}
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <FilterIcon />
            <span>{filtersOpen ? "Hide filters" : "Show filters"}</span>
            {activeFilterCount > 0 && (
              <span className="filter-count">{activeFilterCount}</span>
            )}
          </button>

          <span className="shop-toolbar-divider" />

          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`shop-category-pill${
                selectedCategories.length === 1 && selectedCategories[0] === cat
                  ? " active"
                  : ""
              }`}
              onClick={() => selectCategory(cat)}
            >
              {cat}
              <sup>{categoryCounts[cat]}</sup>
            </button>
          ))}
        </div>

        <div className="shop-toolbar-right">
          <p className="shop-result-count">
            {filteredCount} product{filteredCount !== 1 ? "s" : ""}
          </p>
          <div className="shop-sort">
            <label htmlFor="shop-sort-sel" className="shop-sort-label">
              Sort by:
            </label>
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
        </div>
      </div>

      {/* Horizontal Filter Panel (dropdown) */}
      <div className={`shop-filter-panel${filtersOpen ? " open" : ""}`}>
        <div className="shop-filter-panel-inner">
          <div className="shop-filter-group">
            <button
              className="shop-filter-group-header"
              onClick={() => toggleGroup("category")}
            >
              <h4>Category</h4>
              <ChevronDown open={!!openGroups.category} />
            </button>
            <div className={`shop-filter-group-body${openGroups.category ? " open" : ""}`}>
              {CATEGORIES.map((c) => (
                <label key={c} className="shop-filter-check">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(c)}
                    onChange={() =>
                      toggle(selectedCategories, c, setSelectedCategories)
                    }
                  />
                  <span>{c}</span>
                  <span className="shop-filter-count">
                    {PRODUCTS.filter((p) => p.category === c).length}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="shop-filter-group">
            <button
              className="shop-filter-group-header"
              onClick={() => toggleGroup("finish")}
            >
              <h4>Finish</h4>
              <ChevronDown open={!!openGroups.finish} />
            </button>
            <div className={`shop-filter-group-body${openGroups.finish ? " open" : ""}`}>
              {FINISHES.map((f) => (
                <label key={f} className="shop-filter-check">
                  <input
                    type="checkbox"
                    checked={selectedFinishes.includes(f)}
                    onChange={() =>
                      toggle(selectedFinishes, f, setSelectedFinishes)
                    }
                  />
                  <span>{f}</span>
                  <span className="shop-filter-count">
                    {PRODUCTS.filter((p) => p.finish === f).length}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="shop-filter-group">
            <button
              className="shop-filter-group-header"
              onClick={() => toggleGroup("price")}
            >
              <h4>Price Range</h4>
              <ChevronDown open={!!openGroups.price} />
            </button>
            <div className={`shop-filter-group-body${openGroups.price ? " open" : ""}`}>
              {PRICE_RANGES.map((r, i) => (
                <label key={r.label} className="shop-filter-check">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={selectedPriceRange === i}
                    onChange={() =>
                      setSelectedPriceRange(selectedPriceRange === i ? null : i)
                    }
                  />
                  <span>{r.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {activeFilterPills.length > 0 && (
          <div className="shop-active-filters">
            {activeFilterPills.map((pill) => (
              <button
                key={pill.label}
                className="shop-filter-pill"
                onClick={pill.onRemove}
              >
                {pill.label}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            ))}
            <button className="shop-clear-all" onClick={onClearFilters}>
              Clear all
            </button>
          </div>
        )}
      </div>
    </>
  );
}
