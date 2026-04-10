# SHOP_REFACTOR_PLAN.md

Concrete implementation plan for splitting `src/app/shop/page.tsx` into maintainable modules.

---

## Current state

`src/app/shop/page.tsx` (~430 lines, single `"use client"` file) contains:

| Section | Lines (approx) |
|---|---|
| `Product` interface + `SortOption` type | 10 |
| `PRODUCTS` array (12 items) | 14 |
| Filter/sort constants (`CATEGORIES`, `FINISHES`, `PRICE_RANGES`, `SORT_OPTIONS`, `ITEMS_PER_PAGE`) | 20 |
| `QuickBuyDrawer` component | 80 |
| `EyeIcon`, `FilterIcon`, `HomeIcon` SVG components | 35 |
| `ShopPage` (state, logic, full JSX) | ~280 |

---

## Target file layout

```
src/app/shop/
├── page.tsx                          ← trimmed orchestrator, ~120 lines
├── _lib/
│   ├── shop-types.ts                 ← Product interface, SortOption type
│   ├── shop-constants.ts             ← CATEGORIES, FINISHES, PRICE_RANGES, SORT_OPTIONS, ITEMS_PER_PAGE
│   └── shop-data.ts                  ← PRODUCTS array
└── _components/
    ├── icons.tsx                     ← EyeIcon, FilterIcon, HomeIcon
    ├── QuickBuyDrawer.tsx            ← drawer + overlay
    ├── ShopHero.tsx                  ← collection banner + breadcrumbs
    ├── ShopToolbar.tsx               ← toolbar bar + filter panel (coupled, keep together)
    ├── ShopPagination.tsx            ← numbered pagination + Next button
    └── RecentlyViewed.tsx            ← recently-viewed horizontal scroller
```

---

## Extraction order

Steps within the same numbered batch can be done in parallel. Each batch must complete before the next begins.

### Batch 1 — pure data/types, no React (no deps)

**`src/app/shop/_lib/shop-types.ts`**
```ts
// extract: Product interface, SortOption type
export interface Product { ... }
export type SortOption = ...
```

**`src/app/shop/_lib/shop-constants.ts`**
```ts
// extract: CATEGORIES, FINISHES, PRICE_RANGES, SORT_OPTIONS, ITEMS_PER_PAGE
import type { SortOption } from "./shop-types";
```

**`src/app/shop/_components/icons.tsx`**
```tsx
// extract: EyeIcon, FilterIcon, HomeIcon — pure SVG, no hooks
export function EyeIcon() { ... }
export function FilterIcon() { ... }
export function HomeIcon() { ... }
```

### Batch 2 — depends on Batch 1

**`src/app/shop/_lib/shop-data.ts`**
```ts
import type { Product } from "./shop-types";
export const PRODUCTS: Product[] = [ ... ]
```

**`src/app/shop/_components/QuickBuyDrawer.tsx`**
```tsx
"use client";
import type { Product } from "../_lib/shop-types";
// extract QuickBuyDrawer component verbatim
// Props interface:
interface Props {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onAddToCart: () => void;
}
// PRESERVE: eslint-disable-next-line @next/next/no-img-element
// PRESERVE: body overflow side effect in useEffect
```

**`src/app/shop/_components/ShopHero.tsx`**
```tsx
// No "use client" needed — purely static JSX
import Link from "next/link";
import { HomeIcon } from "./icons";
// Renders the shop-hero section + breadcrumb nav
// No props needed (static content)
export default function ShopHero() { ... }
```

**`src/app/shop/_components/ShopPagination.tsx`**
```tsx
"use client";
// Props interface:
interface Props {
  totalPages: number;
  activePage: number;
  onPageChange: (page: number) => void;
}
// Renders shop-pagination nav
// window.scrollTo({ top: 0, behavior: "smooth" }) stays here, inside handlers
export default function ShopPagination({ totalPages, activePage, onPageChange }: Props) { ... }
```

**`src/app/shop/_components/RecentlyViewed.tsx`**
```tsx
"use client";
import type { Product } from "../_lib/shop-types";
// recentRef moves inside this component — it only references the inner scroller div
// Props interface:
interface Props {
  products: Product[];
  onOpenQuickView: (product: Product) => void;
}
// PRESERVE: eslint-disable-next-line @next/next/no-img-element
export default function RecentlyViewed({ products, onOpenQuickView }: Props) { ... }
```

### Batch 3 — depends on Batch 1 + 2

**`src/app/shop/_components/ShopToolbar.tsx`**
```tsx
"use client";
import { FilterIcon } from "./icons";
import { CATEGORIES, FINISHES, PRICE_RANGES, SORT_OPTIONS } from "../_lib/shop-constants";
import type { SortOption } from "../_lib/shop-types";
import { PRODUCTS } from "../_lib/shop-data";  // for per-filter product counts

// Props interface:
interface Props {
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
  activeFilterPills: { label: string; onRemove: () => void }[];
  onClearFilters: () => void;
}
// Contains: toolbar bar + horizontal filter panel (tightly coupled, keep in one file)
export default function ShopToolbar(props: Props) { ... }
```

### Batch 4 — update page.tsx

Remove all extracted code from `page.tsx`. Import from `_lib` and `_components`. Keep only:
- `"use client"`
- Imports
- `ShopPage` default export with: state declarations, derived values (`filtered`, pagination, `categoryCounts`, `activeFilterPills`, `clearFilters`, `selectCategory`, `openQuickView`, `addToCart`, `toggle`)
- JSX orchestration (render `<ShopHero>`, `<ShopToolbar>`, product grid loop, `<ShopPagination>`, euphony section, `<RecentlyViewed>`, `<QuickBuyDrawer>`)

> **Note on EuphonySection**: The euphony promo section is not in the extraction spec. Leave it inline in `page.tsx` rather than creating a new file for one-off static content. Revisit only if it needs interactivity.

---

## Props / interface decisions

### What stays in `page.tsx`
All filter/sort state lives in `ShopPage` and is passed as props. This avoids introducing context for a refactor-only task.

- `cartCount` + `addToCart` — stays in `ShopPage` (shared with Header)
- `activeColors` (per-card color swatch state) — stays in `ShopPage` (drives product grid directly)
- `recentlyViewed` + `setRecentlyViewed` — stays in `ShopPage` (updated by `openQuickView` there)
- `drawerProduct` + `drawerOpen` — stays in `ShopPage` (controls `QuickBuyDrawer`)

### What moves into components
- `recentRef` — moves into `RecentlyViewed` (only used for its own scroller div)
- `qty` + `selectedColor` (drawer-local) — already inside `QuickBuyDrawer`, stays there

---

## Risk notes

### R1: `"use client"` boundary propagation
`ShopHero` is static JSX — do **not** add `"use client"`. All other extracted components that use hooks or event handlers need `"use client"`. Forgetting it on `ShopPagination` or `RecentlyViewed` will cause a hydration/build error.

### R2: `key` prop on `QuickBuyDrawer`
The current page renders:
```tsx
<QuickBuyDrawer
  key={`${drawerProduct?.id ?? "none"}-${drawerOpen ? "open" : "closed"}`}
  ...
/>
```
This key resets drawer-internal state (`qty`, `selectedColor`) when a different product is opened. **Do not remove or simplify this key** — it is load-bearing behavior.

### R3: ESLint `@next/next/no-img-element` disable comments
`<img>` tags exist in `QuickBuyDrawer`, `RecentlyViewed`, and the euphony section. Each disable comment must travel with its `<img>` or lint will break.

### R4: `toggle` helper function
The `toggle` function is used by `ShopToolbar` but is currently defined in `ShopPage`. Options:
- Pass it as a prop (verbose)
- Inline equivalent logic in `ShopToolbar`'s `onChange` handlers (preferred — it's one line)
- Move to a small util

Recommended: inline it in `ShopToolbar`; no need for a shared utility for two callers.

### R5: `PRODUCTS` import in `ShopToolbar` vs `page.tsx`
`ShopToolbar` renders per-filter product counts using `PRODUCTS.filter(...)`. This means `ShopToolbar` will import directly from `_lib/shop-data`. That is intentional and not a circular dependency.

Alternatively, pass the counts as a pre-computed prop. Either works; importing directly is simpler for a pure refactor.

### R6: Import of `PRODUCTS` from `shop-data` in `page.tsx`
After extraction, `page.tsx` still needs `PRODUCTS` for the `filtered` useMemo and `categoryCounts`. Keep that import.

### R7: Build verification between batches
Run `npm run build && npm run lint` after each batch, not just at the end. This catches import errors early before the file count grows.

---

## Verification checklist

After all batches complete:
- [ ] `npm run build` — zero errors
- [ ] `npm run lint` — no new correctness errors
- [ ] Shop page renders in browser at `/shop`
- [ ] Filter panel opens/closes
- [ ] Category pills filter products
- [ ] Sort dropdown works
- [ ] Quick view drawer opens with correct product, qty resets between products
- [ ] Pagination works, scrolls to top
- [ ] Recently Viewed appears after opening quick view
- [ ] `page.tsx` line count is materially reduced (target: ~120–150 lines)
- [ ] Only files under `src/app/shop/` changed

---

## Summary of line count expectations

| File | Expected lines |
|---|---|
| `page.tsx` (after) | ~120–150 |
| `_lib/shop-types.ts` | ~15 |
| `_lib/shop-constants.ts` | ~30 |
| `_lib/shop-data.ts` | ~20 |
| `_components/icons.tsx` | ~35 |
| `_components/QuickBuyDrawer.tsx` | ~90 |
| `_components/ShopHero.tsx` | ~25 |
| `_components/ShopToolbar.tsx` | ~110 |
| `_components/ShopPagination.tsx` | ~30 |
| `_components/RecentlyViewed.tsx` | ~30 |
